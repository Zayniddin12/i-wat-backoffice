<script setup lang="ts">
import { useTableFetch } from "@/composables/useTableFetch";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { historyChargingTableHeadData } from "@/modules/Transaction/data";
import CCard from "@/components/Card/CCard.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CCar from "@/components/Card/CCar.vue";
import CCharger from "@/components/Card/CCharger.vue";
import { useRoute } from "vue-router";
import {
  calculateDuration,
  changeNumberFormat,
} from "@/utils/changeNumberFormat";
import CTableDate from "@/components/Common/CTableDate.vue";
import CheckModal from "@/modules/Transaction/components/modals/CheckModal.vue";
import { IHistoryCharging } from "@/modules/Users/types";
import CarModal from "@/modules/Users/components/Modals/CarModal.vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import ChargingHistoryModal from "@/modules/Users/components/Modals/ChargingHistoryModal.vue";

const { t } = useI18n();
const route = useRoute();
const { handleError } = useHandleError();
const singleData = ref<IHistoryCharging>();
const showCheckModal = ref(false);
const carModal = ref(false);
const selectedCar = ref<any>([]);

const {
  totals,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
} = useTableFetch(`/charge-transactions/?user=${route.params?.id}`);

const upper = computed(() => {
  return {
    start_charging: `${dayjs(singleData.value?.start_timestamp).format(
      "HH:mm"
    )}, ${dayjs(singleData.value?.start_timestamp).format("DD.MM.YYYY")}`,
    car: singleData.value?.car?.model_name,
    station: singleData.value?.address_name,
    consumed: t("meter_used", {
      count: changeNumberFormat(Number(singleData.value?.meter_used)),
    }),
    delay_after_charging: t("spent_minute", {
      count: calculateDuration(
        String(singleData.value?.start_timestamp),
        String(singleData.value?.end_timestamp)
      ),
    }),
  };
});

const lower = computed(() => {
  return {
    price_per_charge: `${changeNumberFormat(
      Number(singleData.value?.booking_cost)
    )} UZS`,
    parking_price: `${changeNumberFormat(
      Number(singleData.value?.parking_cost)
    )} UZS`,
  };
});

const openCheckModal = (data: IHistoryCharging) => {
  singleData.value = data;
  showCheckModal.value = true;
};
const openCarModal = (data: IHistoryCharging) => {
  singleData.value = data;
  carModal.value = true;
};

function submitCarModal(data: number[]) {
  selectedCar.value = data;
  ApiService.get(
    `charge-transactions`,
    `?user=${route.params?.id}&cars=${data.join(",")}`
  )
    .then((res) => {
      tableData.value = res.data.results;
      carModal.value = false;
    })
    .catch((err) => {
      handleError(err);
    });
}

const showChargingHistory = ref(false);
const chargingHistoryModalData = ref<IHistoryCharging | null>(null);

const openChargingHistory = (data: any) => {
  singleData.value = data;
  showChargingHistory.value = true;
  chargingHistoryModalData.value = data;
};
</script>

<template>
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
        :head="historyChargingTableHeadData()"
        th-class="!bg-gray !text-gray-100 last:!text-left"
        @onRowClick="openChargingHistory"
        tr-class="hover:cursor-pointer"
      >
        <template #header_title>
          <div class="flex items-center space-x-3 divide-gray-300 divide-x">
            <div>
              <h2 class="mb-1 text-xl leading-[22px] font-bold text-dark">
                {{ $t("history.charging") }}
              </h2>
              <p class="text-xs leading-normal font-normal text-gray-100">
                {{
                  t("history.charging_count", {
                    count: paginationData?.total ?? 0,
                  })
                }}
              </p>
            </div>
          </div>
        </template>
        <template #beforeSearch>
          <div class="flex items-center gap-5 w-full justify-end">
            <CProfileDashDetail
              class="!max-h-10"
              v-if="totals?.sum_cost"
              active
              :description="$t('total_amount_spent')"
              :title="`${changeNumberFormat(+totals?.sum_cost)} UZS`"
              mini
            />
            <FSelect
              no-options
              :placeholder="$t('all_cars')"
              value-key="value"
              label-key="title"
              selected-option-styles="h-10"
              is-checked
              @click="openCarModal"
            />
          </div>
        </template>
        <template #no-data>
          <NoData
            :title="$t('history.charging_no_data')"
            title-class="!min-w-[440px]"
            :subtitle="$t('history.charging_no_data_subtitle')"
            class="mt-8 px-6 pb-[88px] pt-0"
            image="/images/svg/no-data/no-notification.svg"
          />
        </template>

        <!--      body-->
        <template #index="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #car="{ row: data }">
          <CCar
            :car="{
              image: data?.car?.manufacturer_icon,
              name: data?.car?.model_name,
              model: data?.car?.manufacturer_name,
            }"
          />
        </template>
        <template #station="{ row: data }">
          <CCharger
            :name="data?.address_name"
            class="hover:text-primary transition-300 cursor-pointer"
          />
          <!--            @click="openCheckModal(data)"-->
        </template>
        <template #columns="{ row: data }">
          <span class="text-dark text-sm font-normal">{{
            data?.connector_name
          }}</span>
        </template>
        <template #used_kw="{ row: data }">
          <span class="text-dark text-xs font-normal leading-130">
            {{
              t("meter_used", { count: changeNumberFormat(data?.meter_used) })
            }}
          </span>
        </template>
        <template #charged>
          <span
            class="text-white flex items-center justify-center text-xs font-medium p-1 w-[34px] h-6 min-h-6 min-w-[34px] rounded-md bg-red border-2 border-dark/20"
          >
            10%</span
          >
        </template>
        <template #paid_amount="{ row: data }">
          <span
            @click="openCheckModal(data)"
            class="text-dark text-xs font-normal leading-130 duration-200 cursor-pointer hover:underline hover:text-blue"
          >
            {{ changeNumberFormat(data?.cost) }}
          </span>
        </template>
        <template #charging_date="{ row: data }">
          <CTableDate :date="data?.start_timestamp" />
        </template>
      </CTableWrapper>
    </CCard>

    <CheckModal
      :show="showCheckModal"
      @close="showCheckModal = false"
      v-bind="{
        upper,
        lower,
        total: `${changeNumberFormat(Number(singleData?.payed_cost ?? 0))} UZS`,
      }"
    />
    <ChargingHistoryModal
      @openCheck="showCheckModal = true"
      :show="showChargingHistory"
      @close="showChargingHistory = false"
      v-bind="{
        data: chargingHistoryModalData,
      }"
    />
    <CarModal
      :show="carModal"
      @close="carModal = false"
      @submit="submitCarModal"
    />
  </section>
</template>

<style scoped></style>
