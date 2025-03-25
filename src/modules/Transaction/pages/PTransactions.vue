<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import {
  fakeChargingInfo,
  transactionTableHeadData,
  paymentSelects,
} from "@/modules/Transaction/data";
import { useI18n } from "vue-i18n";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import CheckModal from "@/modules/Transaction/components/modals/CheckModal.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import {
  changeNumberFormat,
  convertStringToDate,
} from "@/utils/changeNumberFormat";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CNodata from "@/components/Common/NoData/NoData.vue";
import ChargingInfo from "@/modules/Transaction/components/cards/ChargingInfo.vue";
import ApiService from "@/services/ApiService";
import { ITotalData, ITransaction } from "@/modules/Transaction/types";
import CProfile from "@/components/Common/CProfile.vue";
import { formatPhoneNumber } from "@/utils";
import CPaymentCardTable from "@/modules/Transaction/components/cards/CPaymentCardTable.vue";

const { t } = useI18n();

const showCheckModal = ref(false);
const { mounted } = useMounted();
const route = useRoute();
const filter = reactive({
  payment: "",
  user: "",
  date: "",
});
const userList = ref([]);
const checkData = ref<ITransaction>();

const routes = computed(() => [
  {
    name: t("transaction.title"),
    route: "/",
  },
]);
const totalData = ref<ITotalData[]>([...fakeChargingInfo()]);

const openCheckModal = (data: any) => {
  checkData.value = data;
  showCheckModal.value = true;
};

const {
  tableData,
  totals,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch("/payment-transactions/");

const upper = computed(() => {
  return {
    date: `${dayjs(checkData.value?.created_at).format("HH:mm")}, ${dayjs(
      checkData.value?.created_at
    ).format("DD:MM:YYYY")}`,
    transactionMethod: t(`payment_types.${checkData.value?.variant}`),
    transactionID: checkData.value?.transaction_id,
    merchant_id: checkData.value?.merchant_id,
  };
});

const lower = computed(() => {
  return {
    commission: `${checkData.value?.payment_commission ?? 0}%`,
    summa: `${changeNumberFormat(Number(checkData.value?.amount))} UZS`,
  };
});

watch(
  () => filter,
  () => {
    filterTableData({
      user: filter.user,
      variant: filter.payment,
      created_at__gte:
        String(convertStringToDate(String(filter.date))[0]) ?? "",
      created_at__lte:
        String(convertStringToDate(String(filter.date))[1]) ?? "",
    });
  },
  {
    deep: true,
  }
);

watch(
  () => totals.value,
  () => {
    totalData.value[0].icon1 = "icon-light text-[#F2B33A] text-3xl";
    totalData.value[0].icon2 = "icon-cash text-green text-3xl";
    totalData.value[0].value1 = `${changeNumberFormat(
      +totals.value?.meter_used
    )} кВт`;
    totalData.value[0].value2 = `${changeNumberFormat(
      +totals.value?.total_sum
    )} UZS`;
    totalData.value[0].title1 = t("total_kwt_used");
    totalData.value[0].title2 = t("total_paid");
  },
  { deep: true }
);

onMounted(() => {
  ApiService.get(`select-user-list`).then((res) => {
    userList.value = res?.data?.filter(
      (e: { full_name: string }) => e.full_name
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
        :data="tableData"
        :current-page="paginationData?.currentPage"
        @itemsPerPage="onChangeLimit"
        :items-per-page="+route.query?.limit || 10"
        :total="paginationData?.total"
        @pageChange="onPageChange"
        @search="onSearch"
        :limit="paginationData?.defaultLimit"
        :loading="loading"
        :head="transactionTableHeadData()"
        :title="t('history_of_transactions')"
        :subtitle="
          t('history_of_transactions_count', {
            count: paginationData.total ?? 0,
          })
        "
        th-class="last:!text-left"
      >
        <template #beforeSearch>
          <div class="flex items-center gap-5">
            <FSelect
              :options="[
                { title: $t('payment_types.title'), value: '' },
                ...paymentSelects(),
              ]"
              v-model="filter.payment"
              :placeholder="$t('payment_types.title')"
              value-key="value"
              label-key="title"
              selected-option-styles="h-10 max-w-[250px]"
              is-checked
            />
            <FSelect
              :options="[{ full_name: $t('all_users'), id: '' }, ...userList]"
              v-model="filter.user"
              :placeholder="$t('all_users')"
              value-key="id"
              label-key="full_name"
              selected-option-styles="h-10 max-w-[250px]"
              is-checked
            />
          </div>
        </template>
        <template #afterSearch>
          <FDatePicker
            v-model="filter.date"
            class="border border-gray h-10 flex items-center justify-center min-w-[240px] rounded-md focus:border-none"
            custom-class="min-w-[248px] bg-transparent rounded-md"
            range
          />
        </template>

        <!--        after selecting show this-->
        <template #filter>
          <transition mode="out-in" name="fade">
            <div
              v-if="totalData.length && Object.keys(totals).length"
              class="grid grid-cols-2 gap-4 my-6"
            >
              <div class="card grid grid-cols-2">
                <div
                  class="flex items-center gap-3 border-r border-[rgba(148, 168, 170, 0.4)"
                >
                  <CProfile
                    user-type="profile"
                    noBg
                    :user="{
                      fullName: totals?.user?.full_name,
                      phone: formatPhoneNumber(totals?.user?.phone),
                      image: totals?.user?.avatar_url,
                    }"
                  />
                </div>
                <div class="flex items-center gap-3 pl-4">
                  <img src="/images/svg/money-stack.svg" alt="money stack" />
                  <div class="flex flex-col">
                    <h5 class="mb-0.5 text-gray-100 text-xs font-normal">
                      {{ t("not_paid_vip") }}
                    </h5>
                    <p class="text-base font-semibold text-dark leading-130">
                      {{ changeNumberFormat(+totals?.tr_count) }}
                    </p>
                  </div>
                </div>
              </div>

              <ChargingInfo
                v-for="(data, idx) in totalData.slice(0, 1)"
                :key="idx"
                :card="data"
              />
            </div>
          </transition>
        </template>
        <!--no-data-->
        <template #no-data>
          <CNodata
            :title="$t('history.no_transaction_title')"
            :subtitle="$t('history.no_subtitle')"
            class="mt-8 px-6 pt-0"
            image="/images/svg/no-data/no-notification.svg"
          />
        </template>

        <!--        body -->
        <template #index="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #method="{ row: data }">
          <CPaymentCardTable
            :data="data"
            @click="openCheckModal(data)"
            class="cursor-pointer"
          />
        </template>
        <template #transactionId="{ row: data }">
          <span
            class="text-dark text-xs font-normal leading-130 cursor-pointer hover:text-primary transition-300"
            @click="openCheckModal(data)"
          >
            {{ data?.transaction_id }}
          </span>
        </template>
        <template #amount="{ row: data }">
          <span
            v-if="data?.variant == 'Charging'"
            class="text-xs text-red font-normal leading-130"
          >
            -{{ changeNumberFormat(+data?.amount) }}
          </span>
          <span
            v-else
            :class="[data?.amount > 0 ? 'text-green' : 'text-red']"
            class="text-xs font-normal leading-130"
          >
            +{{ changeNumberFormat(+data?.amount) }}
          </span>
        </template>
        <template #date="{ row: data }">
          <p class="text-xs font-normal mb-1">
            {{ dayjs(data?.created_at)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.created_at)?.format("HH:mm") }}
          </p>
        </template>
        <template #user="{ row: data }">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 flex items-center justify-center rounded-full">
              <img
                v-if="data?.user?.avatar_url"
                :src="data?.user?.avatar_url"
                :alt="data?.user?.full_name"
                class="w-full h-full object-cover rounded-full"
              />
              <img
                v-else
                src="/images/default-avatar.png"
                :alt="data?.user?.full_name"
                class="w-full h-full object-cover rounded-full"
              />
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
      </CTableWrapper>
    </CCard>

    <CheckModal
      :show="showCheckModal"
      @close="showCheckModal = false"
      v-bind="{
        upper,
        lower,
        total: `${changeNumberFormat(
          Number(Number(checkData?.payed_cost ?? 0))
        )} UZS`,
      }"
    />
  </section>
</template>

<style scoped></style>
