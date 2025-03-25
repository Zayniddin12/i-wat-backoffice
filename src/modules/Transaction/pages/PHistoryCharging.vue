<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCar from "@/components/Card/CCar.vue";
import {
  chargingTableHeadData,
  fakeChargingInfo,
} from "@/modules/Transaction/data";
import { useI18n } from "vue-i18n";
import { computed, onMounted, reactive, ref, watch } from "vue";
import CCharger from "@/components/Card/CCharger.vue";
import ChargingInfo from "@/modules/Transaction/components/cards/ChargingInfo.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FormDateTime from "@/components/Form/Date/FDateTimePicker.vue";
import FormTime from "@/components/Form/Date/FTimePicker.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { formatPhoneNumber, parseCustomDate } from "@/utils";
import ApiService from "@/services/ApiService";
import CNodata from "@/components/Common/NoData/NoData.vue";
import { changeNumberFormat } from "@/utils/changeNumberFormat";
import { ITotalData } from "@/modules/Transaction/types";
import dayjs from "dayjs";

const route = useRoute();
const { mounted } = useMounted();
const { t } = useI18n();
const addressList = ref([]);
const totalData = ref<ITotalData[]>([...fakeChargingInfo()]);
const routes = computed(() => [
  {
    name: t("transaction.title"),
    route: "/",
  },
]);
const userList = ref([]);

const {
  tableData,
  totals,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch("/charge-transactions/");

const filter = reactive({
  address: "",
  user: "",
  start_timestamp__gte: "",
  start_timestamp__lte: "",
  order_by: "",
  time_range_after: "",
  time_range_before: "",
});

const sortOrder = reactive({
  cost: 0, // 0: no sort, 1: ascending, -1: descending
  meter_used: 0,
});

const sortBy = (key: string) => {
  if (sortOrder[key] === 1) {
    sortOrder[key] = -1;
  } else if (sortOrder[key] === -1) {
    sortOrder[key] = 0;
  } else {
    sortOrder[key] = 1;
  }

  const orderFields = Object.keys(sortOrder)
    .filter((key) => sortOrder[key] !== 0)
    .map((key) => (sortOrder[key] === 1 ? `-${key}` : key));

  filter.order_by = orderFields.join(",");
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
};

function formatTime(timeStr: string) {
  const [hour, minute] = timeStr.split(":");
  const formattedHour = hour.padStart(2, "0");
  return `${formattedHour}:${minute}`;
}

watch(
  () => filter,
  () => {
    const {
      start_timestamp__gte,
      start_timestamp__lte,
      time_range_after,
      time_range_before,
    } = filter;

    if (time_range_after && !time_range_before) {
      return;
    } else {
      const timesstamps: any = {
        start_timestamp__gte: "",
        start_timestamp__lte: "",
      };

      const currentTime = formatTime(getCurrentTime());
      if (start_timestamp__gte) {
        const [f, tempTime] = start_timestamp__gte.split(" ");
        if (tempTime === currentTime) {
          timesstamps.start_timestamp__gte = dayjs(
            parseCustomDate(start_timestamp__gte)
          ).format("YYYY-MM-DD");
        } else {
          timesstamps.start_timestamp__gte = dayjs(
            parseCustomDate(start_timestamp__gte)
          ).format("YYYY-MM-DD HH:mm");
        }
      }

      if (start_timestamp__lte) {
        const [f, tempTime] = start_timestamp__lte.split(" ");
        if (tempTime === currentTime) {
          timesstamps.start_timestamp__lte = dayjs(
            parseCustomDate(start_timestamp__lte)
          ).format("YYYY-MM-DD");
        } else {
          timesstamps.start_timestamp__lte = dayjs(
            parseCustomDate(start_timestamp__lte)
          ).format("YYYY-MM-DD HH:mm");
        }
      }

      filterTableData({
        ...filter,
        time_range_after:
          time_range_after && time_range_before ? time_range_after : "",
        time_range_before:
          time_range_before && time_range_after ? time_range_before : "",
        start_timestamp__gte: timesstamps.start_timestamp__gte,
        start_timestamp__lte: timesstamps.start_timestamp__lte,
      });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => totals.value,
  () => {
    totalData.value[0].icon1 = "icon-cash text-green text-3xl";
    totalData.value[1].icon1 = "icon-light text-[#F2B33A] text-3xl";

    totalData.value[0].value1 = `${changeNumberFormat(
      +totals.value?.sum_cost
    )} UZS`;
    totalData.value[0].value2 = `${changeNumberFormat(
      +(totals.value?.sum_cost_vip ?? "0")
    )} UZS`;
    totalData.value[1].value1 = `${changeNumberFormat(
      +totals.value?.sum_meter_used
    )} кВт`;
    totalData.value[1].value2 = `${t("meter_used", {
      count: changeNumberFormat(+(totals.value?.sum_meter_used_vip ?? "0")),
    })}`;
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  ApiService.get(`address`, "?limit=1000").then((res) => {
    addressList.value = res?.data?.results.filter(
      (address: { name: string }) => address.name
    );
  });
  ApiService.get(`select-user-list`).then((res) => {
    userList.value = res.data.filter(
      (user: { full_name: string }) => user.full_name
    );
  });
});
</script>

<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <section>
    <CCard class="p-6">
      <CTableWrapper
        :current-page="paginationData?.currentPage"
        :data="tableData"
        :head="chargingTableHeadData()"
        :items-per-page="+route.query?.limit || 10"
        :limit="paginationData?.defaultLimit"
        :loading="loading"
        :subtitle="t('history.count', { count: paginationData.total ?? 0 })"
        :title="t('charging_sessions')"
        :total="paginationData?.total"
        th-class="last:!text-left"
        head-classes="!max-w-[1300px]"
        @sort="sortBy"
        :order-value="filter.order_by"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        @search="onSearch"
      >
        <template #beforeSearch>
          <div class="flex items-center gap-5 flex-wrap w-full">
            <div class="flex items-center gap-2">
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale !== 'uz'"
              >
                {{ t("from") }}
              </p>
              <FormTime
                v-model="filter.time_range_after"
                @startTime="filter.time_range_after = $event"
              />
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale === 'uz'"
              >
                {{ t("from") }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale !== 'uz'"
              >
                {{ t("to") }}
              </p>
              <FormTime
                v-model="filter.time_range_before"
                @startTime="filter.time_range_before = $event"
              />
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale === 'uz'"
              >
                {{ t("to") }}
              </p>
            </div>
            <FSelect
              v-model="filter.address"
              :options="[{ name: $t('all_ezc'), id: '' }, ...addressList]"
              :placeholder="$t('all_ezc')"
              is-checked
              label-key="name"
              selected-option-styles="h-10 max-w-[250px]"
              value-key="id"
            />
            <FSelect
              v-model="filter.user"
              :options="[{ full_name: $t('all_users'), id: '' }, ...userList]"
              :placeholder="$t('all_users')"
              is-checked
              label-key="full_name"
              selected-option-styles="h-10 max-w-[250px]"
              value-key="id"
            />
          </div>
        </template>
        <template #afterSearch>
          <div class="flex items-center gap-5 flex-wrap w-full justify-end">
            <div class="flex items-center gap-2">
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale !== 'uz'"
              >
                {{ t("from") }}
              </p>
              <FormDateTime v-model="filter.start_timestamp__gte" />
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale === 'uz'"
              >
                {{ t("from") }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale !== 'uz'"
              >
                {{ t("to") }}
              </p>
              <FormDateTime
                v-model="filter.start_timestamp__lte"
                :min-date="
                  parseCustomDate(filter.start_timestamp__gte)?.toISOString()
                "
                :disabled="!Boolean(filter.start_timestamp__gte)"
              />
              <p
                class="text-base text-dark capitalize"
                v-if="$i18n.locale === 'uz'"
              >
                {{ t("to") }}
              </p>
            </div>
          </div>
        </template>
        <template #filter>
          <transition mode="out-in" name="fade">
            <div
              v-if="totalData.length && Object.keys(totals).length"
              class="grid grid-cols-2 gap-4 my-6"
            >
              <ChargingInfo
                v-for="(data, idx) in totalData"
                :key="idx"
                :card="data"
              />
            </div>
          </transition>
        </template>

        <!--        no-data-->
        <template #no-data>
          <CNodata
            :subtitle="$t('history.no_subtitle')"
            :title="$t('history.no_title')"
            class="mt-8 px-6 pt-0"
            image="/images/svg/no-data/no-notification.svg"
          />
        </template>

        <!--        body -->
        <template #index="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #user="{ row: data }">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 flex items-center justify-center border border-gray/50 rounded-full"
            >
              <img
                v-if="data?.user?.avatar_url"
                :alt="data?.user?.full_name"
                :src="data?.user?.avatar_url"
                class="w-full h-full object-cover rounded-full"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6.27836 19.4259C6.23743 19.8381 6.5384 20.2054 6.95059 20.2463C7.36277 20.2873 7.73009 19.9863 7.77102 19.5741L6.27836 19.4259ZM16.229 19.5741C16.2699 19.9863 16.6372 20.2873 17.0494 20.2463C17.4616 20.2054 17.7626 19.8381 17.7216 19.4259L16.229 19.5741ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM13.25 10C13.25 10.6904 12.6904 11.25 12 11.25V12.75C13.5188 12.75 14.75 11.5188 14.75 10H13.25ZM12 11.25C11.3096 11.25 10.75 10.6904 10.75 10H9.25C9.25 11.5188 10.4812 12.75 12 12.75V11.25ZM10.75 10C10.75 9.30964 11.3096 8.75 12 8.75V7.25C10.4812 7.25 9.25 8.48122 9.25 10H10.75ZM12 8.75C12.6904 8.75 13.25 9.30964 13.25 10H14.75C14.75 8.48122 13.5188 7.25 12 7.25V8.75ZM7.77102 19.5741C7.98417 17.4272 9.79668 15.75 12 15.75V14.25C9.01797 14.25 6.56693 16.5194 6.27836 19.4259L7.77102 19.5741ZM12 15.75C14.2033 15.75 16.0158 17.4272 16.229 19.5741L17.7216 19.4259C17.4331 16.5194 14.982 14.25 12 14.25V15.75Z"
                  fill="#94A8AA"
                />
              </svg>
            </div>
            <div>
              <h5 class="mb-0.5 text-dark text-xs font-medium leading-130">
                {{ data?.user?.full_name }}
              </h5>
              <p class="text-gray-300 text-xs font-normal leading-130">
                {{ formatPhoneNumber(data?.user?.phone) }}
              </p>
            </div>
          </div>
        </template>
        <template #car="{ row: data }">
          <CCar
            :car="{
              image: data?.car?.manufacturer_icon,
              name: data?.car?.manufacturer_name,
              model: data?.car?.model_name,
            }"
          />
        </template>
        <template #station="{ row: data }">
          <CCharger :name="data?.address_name" />
        </template>
        <template #columns="{ row: data }">
          <span class="text-dark text-sm font-normal">{{
            data?.connector_name
          }}</span>
        </template>
        <template #used_kw="{ row: data }">
          <span class="text-dark text-xs font-normal leading-130">
            {{ data?.meter_used }} кВт
          </span>
        </template>
        <template #paid_amount="{ row: data }">
          <div>
            <span
              v-if="+data?.cost > 0"
              class="text-dark text-xs font-normal leading-130"
            >
              {{ changeNumberFormat(data?.cost) }}
            </span>
            <p v-else>0</p>
            <!--            <TooltipVip v-else />-->
          </div>
        </template>

        <template #parking="{ row: data }">
          <p class="text-dark text-xs font-normal leading-130">
            {{ changeNumberFormat(data?.parking_cost ?? 0) }}
          </p>
        </template>
        <template #booking="{ row: data }">
          <p class="text-dark text-xs font-normal leading-130">
            {{ changeNumberFormat(data?.booking_cost ?? 0) }}
          </p>
        </template>
        <template #charging_date="{ row: data }">
          <p class="text-xs font-normal mb-1">
            {{ dayjs(data?.start_timestamp)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.start_timestamp)?.format("HH:mm") }}
          </p>
        </template>
      </CTableWrapper>
    </CCard>
  </section>
</template>

<style scoped></style>
