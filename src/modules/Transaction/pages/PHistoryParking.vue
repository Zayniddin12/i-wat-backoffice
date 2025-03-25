<script lang="ts" setup>
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { allStatusAmount } from "@/modules/Transaction/data";
import CUserCard from "@/components/Card/CUserCard.vue";
import { formatMoneyDecimal, formatPhoneNumber } from "@/utils";
import FSelect from "@/components/Form/Select/FSelect.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { historyParkingTableHeadData } from "@/modules/Transaction/data";
import CCar from "@/components/Card/CCar.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();

const filter = reactive({
  active_status: "",
});

const breadcrumbRoutes = computed(() => {
  return [
    {
      name: t("transaction_for_parking"),
      route: "/users",
      disabled: true,
    },
  ];
});

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch("/parking-transactions/");

watch(
  () => filter,
  (newVal) => {
    filterTableData({
      ...newVal,
      order_by:
        newVal.active_status === "all" ? undefined : newVal.active_status,
    });
  },
  { deep: true }
);
</script>

<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb :routes="breadcrumbRoutes" />
  </Teleport>

  <CCard class="p-6">
    <CTableWrapper
      :current-page="paginationData?.currentPage"
      :data="tableData"
      :head="historyParkingTableHeadData()"
      :items-per-page="+route.query?.limit || 10"
      :limit="paginationData?.defaultLimit"
      :loading="loading"
      :subtitle="
        t('history_of_transactions_count', { count: paginationData?.total })
      "
      :title="t('transaction_for_parking')"
      :total="paginationData?.total"
      head-classes="!max-w-[870px]"
      th-class="users-module__row last:!text-right"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      no-search
    >
      <!--      head   -->
      <template #beforeSearch>
        <div class="flex items-center justify-end gap-5">
          <FSelect
            v-model="filter.active_status"
            :options="allStatusAmount()"
            :placeholder="t('filter_by_price')"
            is-checked
            label-key="label"
            selected-option-styles="h-10 max-w-[250px]"
            value-key="value"
          />
        </div>
      </template>

      <!--      body  -->
      <template #index="{ row }">
        <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
      </template>
      <template #user="{ row: data }">
        <CUserCard
          :card="{
            avatar: data?.user?.avatar_url,
            full_name: data?.user?.full_name,
            phone_number: formatPhoneNumber(data?.user?.phone),
            userLink: `/users/${data?.user?.id}`,
          }"
          :is-admin="data?.user?.role === 'Admin'"
          :is-birthday="data?.user?.is_birth_date"
        />
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
      <template #balance="{ row: data }">
        <span>{{ formatMoneyDecimal(data?.parking_cost) }} UZS</span>
      </template>
      <template #registration_date="{ row: data }">
        <div class="flex flex-col gap-1">
          <p class="text-xs font-normal mb-1">
            {{ dayjs(data?.start_timestamp)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.start_timestamp)?.format("HH:mm") }}
          </p>
        </div>
      </template>
      <template #last_login="{ row: data }">
        <div class="flex flex-col gap-1">
          <p v-if="data?.end_timestamp" class="text-xs font-normal mb-1">
            {{ dayjs(data?.end_timestamp)?.format("DD.MM.YYYY") }}
          </p>
          <p
            v-if="data?.end_timestamp"
            class="text-xs font-normal text-gray-300"
          >
            {{ dayjs(data?.end_timestamp)?.format("HH:mm") }}
          </p>
          <p
            v-if="!data?.end_timestamp"
            class="text-xs font-normal mb-1 w-full mx-auto ml-7"
          >
            -
          </p>
        </div>
      </template>

      <!--      no data  -->
      <template #no-data>
        <NoData
          :subtitle="t('users_module.all_users.no_data_subtitle')"
          :title="t('users_module.all_users.no_data_title')"
          class="p-0 pb-[76px]"
          image="/images/svg/no-data/default_no_data.svg"
        />
      </template>
    </CTableWrapper>
  </CCard>
</template>

<style>
span {
  @apply text-dark text-xs font-normal;
}

.users-module__row:nth-child(3),
.users-module__row:nth-child(4) {
  text-align: center !important;
}
</style>
