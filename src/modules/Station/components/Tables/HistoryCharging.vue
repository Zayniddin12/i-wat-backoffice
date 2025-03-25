<script lang="ts" setup>
import { historyHeadData } from "@/modules/Station/data";
import { useTableFetch } from "@/composables/useTableFetch";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CButton from "@/components/Common/CButton.vue";
import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CCar from "@/components/Card/CCar.vue";
import CTableDate from "@/components/Common/CTableDate.vue";
import { formatMoneyDecimal } from "@/utils";
import CheckModal from "@/modules/Transaction/components/modals/CheckModal.vue";
import CCard from "@/components/Card/CCard.vue";
import { ITabItem } from "@/components/Tab/CTab.types";
import dayjs from "dayjs";
import {
  calculateDuration,
  changeNumberFormat,
} from "@/utils/changeNumberFormat";
import { IHistoryCharging } from "@/modules/Users/types";

interface IProps {
  options?: ITabItem[];
}

const props = defineProps<IProps>();
const { t } = useI18n();
const route = useRoute();

const connectorModal = ref(false);
const selectOptions = computed(() => {
  if (!props.options) return [];

  return [
    {
      label: t("all_columns"),
      value: "",
    },
    ...props.options,
  ];
});
const checkModal = ref(false);
const activeColumn = ref("");
const checkData = ref<IHistoryCharging>();

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch(`/charge-transactions/?address=${route.params?.id}`);

const upper = computed(() => {
  return {
    start_charging: `${dayjs(checkData.value?.start_timestamp).format(
      "HH:mm"
    )}, ${dayjs(checkData.value?.start_timestamp).format("DD.MM.YYYY")}`,
    station: checkData.value?.address_name,
    consumed: t("meter_used", {
      count: changeNumberFormat(Number(checkData.value?.meter_used)),
    }),
    delay_after_charging: t("spent_minute", {
      count: calculateDuration(
        String(checkData.value?.start_timestamp),
        String(checkData.value?.end_timestamp)
      ),
    }),
  };
});

const lower = computed(() => {
  return {
    price_per_charge: `${changeNumberFormat(
      Number(checkData.value?.cost ?? 0)
    )} UZS`,
    parking_price: `${changeNumberFormat(
      Number(checkData.value?.parking_cost ?? 0)
    )} UZS`,
    booking_price: `${changeNumberFormat(
      Number(checkData.value?.booking_cost ?? 0)
    )} UZS`,
  };
});

function openCheckModal(data: any) {
  checkData.value = data;
  checkModal.value = true;
}

watch(
  () => activeColumn.value,
  (val) => {
    filterTableData({
      connector__charge_point_id: val.split("column_no_")[1],
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <section>
    <CCard class="pb-5">
      <CTableWrapper
        :current-page="paginationData?.currentPage ?? 0"
        :data="tableData"
        :head="historyHeadData()"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :loading="loading"
        :no-search="tableData.length === 0"
        :total="paginationData?.total"
        th-class="!bg-gray !text-gray-100"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        @search="onSearch"
      >
        <template #header_title>
          <div class="flex items-center space-x-3 divide-gray-300 divide-x">
            <div>
              <h2 class="mb-1 text-xl leading-[22px] font-bold text-dark">
                {{ $t("history.title") }}
              </h2>
              <p class="text-xs leading-normal font-normal text-gray-100">
                {{ t("history.count", { count: paginationData?.total ?? 0 }) }}
              </p>
            </div>
          </div>
        </template>

        <template #index="{ row: data }">
          <span class="text-dark text-xs font-medium">{{ data?._index }}.</span>
        </template>
        <template #user="{ row: data }">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 flex items-center justify-center border border-gray/[60] rounded-full"
            >
              <img
                :alt="data?.user?.full_name"
                :src="data?.user?.avatar_url"
                class="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h5 class="mb-0.5 text-dark text-xs font-medium leading-130">
                {{ data?.user?.full_name }}
              </h5>
              <p class="text-gray-300 text-xs font-normal leading-130">
                {{ data?.user?.phone }}
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
          <span class="text-dark text-sm font-normal">{{
            data?.address_name
          }}</span>
        </template>
        <template #used_kw="{ row: data }">
          <span class="text-dark text-xs font-normal leading-130">
            {{ data?.meter_used }} кВт
          </span>
        </template>
        <template #paid_amount="{ row: data }">
          <span
            class="text-dark text-xs font-normal leading-130 hover:text-primary transition-300 hover:underline cursor-pointer"
            @click="() => openCheckModal(data)"
          >
            {{ formatMoneyDecimal(data?.cost) }}
          </span>
        </template>
        <template #charging_date="{ row: data }">
          <CTableDate :date="data.end_timestamp" />
        </template>

        <svg
          height="32"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 4H4v9.01h2V6h7V4z" fill="currentColor" />
          <path
            d="M29.49 13.12l-9-5a1 1 0 0 0-1 0l-9 5A1 1 0 0 0 10 14v10a1 1 0 0 0 .52.87l9 5A1 1 0 0 0 20 30a1.05 1.05 0 0 0 .49-.13l9-5A1 1 0 0 0 30 24V14a1 1 0 0 0-.51-.88zM19 27.3l-7-3.89v-7.72l7 3.89zm1-9.45L13.06 14L20 10.14L26.94 14zm8 5.56l-7 3.89v-7.72l7-3.89z"
            fill="currentColor"
          />
        </svg>

        <template #beforeSearch>
          <FSelect
            v-if="selectOptions.length !== 1"
            v-model="activeColumn"
            :options="selectOptions"
            :placeholder="$t('all_columns')"
            is-checked
            label-key="label"
            selected-option-styles="h-10"
            value-key="value"
          />
        </template>
        <template #no-data>
          <NoData
            :subtitle="$t('no_charging_history_subtitle')"
            :title="$t('no_charging_history_title')"
            class="mt-8 px-6 pb-[100px] pt-0"
            image="/images/svg/no-data/no-notification.svg"
          >
            <template #actions>
              <CButton
                :text="$t('add_connector')"
                icon="icon-plus pr-2"
                icon-position="left"
                variant="info"
                @click="connectorModal = true"
              />
            </template>
          </NoData>
        </template>
      </CTableWrapper>

      <CheckModal
        :show="checkModal"
        @close="checkModal = false"
        v-bind="{
          upper,
          lower,
          total: `${changeNumberFormat(
            Number(Number(checkData?.payed_cost ?? 0))
          )} UZS`,
        }"
      />
    </CCard>
  </section>
</template>

<style scoped></style>
