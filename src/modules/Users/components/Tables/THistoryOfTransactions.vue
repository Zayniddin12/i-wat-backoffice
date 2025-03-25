<script setup lang="ts">
import { useTableFetch } from "@/composables/useTableFetch";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";
import { historyTransactionHeadData } from "@/modules/Transaction/data";
import CCard from "@/components/Card/CCard.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { useRoute } from "vue-router";
import CPaymentCardTable from "@/modules/Transaction/components/cards/CPaymentCardTable.vue";
import {
  changeNumberFormat,
  convertStringToDate,
} from "@/utils/changeNumberFormat";
import CTableDate from "@/components/Common/CTableDate.vue";
import dayjs from "dayjs";
import CheckModal from "@/modules/Transaction/components/modals/CheckModal.vue";
import { ITransaction } from "@/modules/Transaction/types";
import CIncomeAndExpense from "@/components/Profile/CIncomeAndExpense.vue";

const { t } = useI18n();
const route = useRoute();
const singleData = ref<ITransaction>();
const date = ref("");
const showCheckModal = ref(false);

const openCheckModal = (data: ITransaction) => {
  showCheckModal.value = true;
  singleData.value = data;
};

const {
  totals,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch(`/payment-transactions/?user=${route.params.id}`);

const upper = computed(() => {
  return {
    date: `${dayjs(singleData.value?.created_at).format("HH:mm")}, ${dayjs(
      singleData.value?.created_at
    ).format("DD:MM:YYYY")}`,
    transactionMethod: t(`payment_types.${singleData.value?.variant}`),
    transactionID: singleData.value?.transaction_id,
    merchant_id: singleData.value?.merchant_id,
  };
});

const lower = computed(() => {
  return {
    commission: `${singleData.value?.payment_commission ?? 0}%`,
    summa: `${changeNumberFormat(Number(singleData.value?.amount))} UZS`,
  };
});

watch(
  () => date.value,
  (val) => {
    filterTableData({
      created_at__gte: String(convertStringToDate(String(val))[0]) ?? "",
      created_at__lte: String(convertStringToDate(String(val))[1]) ?? "",
    });
  },
  {
    deep: true,
  }
);
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
        :head="historyTransactionHeadData()"
        th-class="!bg-gray !text-gray-100 last:!text-left"
        @onRowClick="openCheckModal"
      >
        <template #header_title>
          <div class="flex items-center space-x-3 divide-gray-300 divide-x">
            <div>
              <h2
                class="mb-1 text-xl leading-[22px] font-bold text-dark truncate"
              >
                {{ $t("history_of_transactions") }}
              </h2>
              <p class="text-xs leading-normal font-normal text-gray-100">
                {{
                  t("history_of_transactions_count", {
                    count: paginationData?.total ?? 0,
                  })
                }}
              </p>
            </div>
          </div>
        </template>
        <template #beforeSearch>
          <div class="flex items-center gap-5 w-full justify-end flex-nowrap">
            <CIncomeAndExpense
              :amount="`${changeNumberFormat(+totals?.total_sum)} ${$t('uzs')}`"
              :subtitle="$t('income')"
              :isPositive="true"
            />
            <CIncomeAndExpense
              :amount="`${changeNumberFormat(+totals?.total_sum)} ${$t('uzs')}`"
              :subtitle="$t('expense')"
              :isPositive="false"
            />
            <!--            <CProfileDashDetail-->
            <!--              class="!w-max"-->
            <!--              active-->
            <!--              :description="$t('total_amount_spent')"-->
            <!--              :title="`${changeNumberFormat(+totals?.total_sum)} UZS`"-->
            <!--              mini-->
            <!--            />-->
            <FDatePicker
              v-model="date"
              range
              class="border border-gray rounded-md w-full min-w-[240px] max-w-[250px]"
              custom-class="bg-gray rounded-md"
            />
          </div>
        </template>

        <template #no-data>
          <NoData
            :title="$t('transaction.no_transactions')"
            title-class="!min-w-[440px]"
            :subtitle="$t('transaction.no_transactions_subtitle')"
            class="mt-8 px-6 pb-[100px] pt-0"
            image="/images/svg/no-data/no-notification.svg"
          />
        </template>

        <!--      body-->
        <template #index="{ row }">
          <span class="text-dark !text-xs !font-medium"
            >{{ row?._index }}.</span
          >
        </template>
        <template #method="{ row: data }">
          <CPaymentCardTable :data="data" />
        </template>
        <template #amount="{ row: data }">
          <span
            @click="openCheckModal(data)"
            :class="[data?.amount > 0 ? 'text-green' : 'text-red']"
            class="text-xs font-normal leading-130 !duration-200 hover:underline cursor-pointer"
          >
            {{ data?.amount > 0 ? "+" : "-" }}
            {{ changeNumberFormat(+data?.amount) }}
          </span>
        </template>
        <template #commission="{ row: data }">
          <span class="text-xs">{{ data?.percentage ?? 0 }}%</span>
        </template>
        <template #date="{ row: data }">
          <CTableDate :date="data?.created_at" />
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
  </section>
</template>

<style scoped></style>
