<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { activeUsersTableHeadData } from "@/modules/Dashboard/data";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import NoData from "@/components/Common/NoData/NoData.vue";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { defineProps } from "vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import CCar from "@/components/Card/CCar.vue";
import CCharger from "@/components/Card/CCharger.vue";
import dayjs from "dayjs";
import { formatPhoneNumber } from "@/utils";

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{
  isSearch: boolean;
  noFooter?: boolean;
  tableItems?: {
    defaultLimit: number;
  };
}>();
const { tableData, paginationData, onSearch, onChangeLimit, loading } =
  useTableFetch("/ongoing-charge-transactions/", { limit: 5 });
</script>

<template>
  <CCard class="p-6">
    <CTableWrapper
      :current-page="1"
      :data="tableData"
      :head="activeUsersTableHeadData()"
      :items-per-page="paginationData.defaultLimit"
      :limit="paginationData.defaultLimit"
      :loading="loading"
      :no-footer="noFooter"
      :no-search="!isSearch"
      :subtitle="t('charging_count', paginationData.total)"
      :title="$t('dashboard.active_users')"
      :total="paginationData.total"
      :tr-class="{ '!border-gray-400': isSearch }"
      type="transparent"
      @search="onSearch"
      @items-per-page="onChangeLimit"
      @page-change="onChangeLimit"
    >
      <template #beforeSearch>
        <slot name="beforeSearch" />
      </template>

      <template #afterSearch>
        <CButton
          v-show="!isSearch"
          :text="$t('show_more')"
          :variant="'info'"
          class="flex items-center py-2 px-4 gap-1"
          icon="icon-chevron-right !text-sm"
          size="md"
          @click="router.push({ name: 'PActiveUsers' })"
        />
      </template>

      <template #no-data>
        <NoData
          :subtitle="$t('dashboard.active_user_not_found_subtitle')"
          :title="$t('dashboard.active_user_not_found')"
          image="/images/svg/no-data/no-notification.svg"
        />
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
        />
      </template>
      <template #car="{ row: data }">
        <CCar
          :car="{
            model: data?.car?.model_name,
            image: data?.car?.manufacturer_icon,
            name: data?.car?.manufacturer_name,
          }"
        />
      </template>
      <template #col_vo_station="{ row: data }">
        <CCharger :name="data?.charge_point_address?.name" />
      </template>
      <template #col_vo_column="{ row: data }">
        <span class="text-dark text-xs font-normal">
          {{ data?.connector_name }}
        </span>
      </template>
      <template #start_date="{ row: data }">
        <div class="flex flex-col justify-end">
          <span class="text-dark text-xs font-normal">
            {{ dayjs(data?.start_timestamp).format("DD.MM.YYYY") }}
          </span>
          <span class="text-gray-300 text-xs font-normal">{{
            dayjs(data?.start_timestamp).format("HH:mm")
          }}</span>
        </div>
      </template>
    </CTableWrapper>
  </CCard>
</template>

<style scoped></style>
