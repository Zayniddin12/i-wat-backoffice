<script lang="ts" setup>
import { exchangeActions } from "@/modules/Notification/data";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CButton from "@/components/Common/CButton.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { userTableHeadData } from "@/modules/Users/data";
import { formatMoneyDecimal, formatPhoneNumber } from "@/utils";
import CUserCard from "@/components/Card/CUserCard.vue";
import CTableDate from "@/components/Common/CTableDate.vue";

interface User {
  active_status: boolean;
  avatar_url: string;
  balance: number;
  car_count: number;
  charge_point_count: number;
  date_joined: string; // Assuming this is a string representation of a date
  full_name: string | null;
  id: number;
  is_birth_date: boolean;
  phone: string;
  role: string;
}

const { t } = useI18n();
const router = useRouter();

const { tableData, paginationData, onChangeLimit, loading } = useTableFetch(
  "/users/?order_by=-date_joined",
  {
    limit: 5,
  }
);
</script>

<template>
  <CCard class="p-6">
    <CTableWrapper
      :current-page="paginationData?.currentPage ?? 0"
      :data="tableData"
      :head="userTableHeadData()"
      :items-per-page="paginationData?.defaultLimit ?? 0"
      :limit="paginationData?.defaultLimit ?? 0"
      :loading="loading"
      :subtitle="t('users', { count: paginationData?.total ?? 0 })"
      :title="$t('new_users')"
      :total="paginationData?.total"
      no-footer
      no-search
      th-class="!bg-gray !text-gray-100"
      title-class="!truncate"
      @itemsPerPage="onChangeLimit"
    >
      <!--      body-->
      <template #index="{ row }">
        <span class="text-dark text-xs font-medium">{{ row._index }}.</span>
      </template>
      <template #user="{ row: data }">
        <CUserCard
          :card="{
            avatar: data?.avatar_url,
            full_name: data?.full_name,
            phone_number: formatPhoneNumber(data?.phone),
            userLink: `/users/${data?.id}`,
            is_birth_date: data?.is_birth_date,
          }"
        />
      </template>
      <template #col_vo_car="{ row: data }">
        <p class="text-dark text-xs font-normal ml-7">
          {{ data?.car_count }}
        </p>
      </template>
      <template #col_vo_station="{ row: data }">
        <p class="text-dark text-xs font-normal ml-7">
          {{ data?.charge_point_count > 0 ? data?.col_vo_station : "-" }}
        </p>
      </template>
      <template #balance="{ row: data }">
        <span v-if="data?.balance"
          >{{
            data?.balance ? formatMoneyDecimal(data?.balance) : "-"
          }}
          UZS</span
        >
      </template>
      <template #registration_date="{ row: data }">
        <CTableDate :date="data?.date_joined" />
      </template>
      <template #last_login="{ row: data }">
        <CTableDate :date="data?.last_login || data?.date_joined" />
      </template>
      <template #status="{ row: data }">
        <span :class="[{ 'text-red': !data?.active_status }, 'text-right']">
          {{ data?.active_status ? $t("active") : $t("inactive") }}
        </span>
      </template>

      <template #afterSearch>
        <CButton
          :text="$t('show_more')"
          class="flex items-center py-2 px-4 gap-1"
          icon="icon-chevron-right text-sm"
          size="md"
          variant="info"
          @click="router.push({ name: 'PUsers' })"
        />
      </template>
      <template #no-data>
        <NoData
          :button-text="$t('add_notification')"
          :subtitle="$t('no_notifications_added_subtitle')"
          :title="$t('no_notifications_added')"
          class="mt-8 px-6 pb-[100px] pt-0"
          image="/images/svg/no-data/no-notification.svg"
        />
      </template>
      <template #action="{ row: data }">
        <CActionsDropdown
          :list="exchangeActions"
          :selected-item="data"
          @edit="router.push({ name: 'PNotificationEdit' })"
        />
      </template>
    </CTableWrapper>
  </CCard>
</template>

<style scoped></style>
