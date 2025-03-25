<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, ref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CNodata from "@/components/Common/NoData/NoData.vue";
import CButton from "@/components/Common/CButton.vue";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import { exchangeActions, notificationHead } from "@/modules/Notification/data";
import { useTableFetch } from "@/composables/useTableFetch";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { useRoute, useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import ApiService from "@/services/ApiService";
import dayjs from "dayjs";
import {
  convertDateToString,
  convertStringToDate,
} from "@/utils/changeNumberFormat";
import { useHandleError } from "@/composables/useHandleError";

const { mounted } = useMounted();
const { t } = useI18n();
const { handleError } = useHandleError();
const routes = computed(() => [
  {
    name: t("notification"),
    route: "/",
  },
]);
const route = useRoute();
const { showToast } = useCustomToast();
const router = useRouter();
const isLoading = ref(false);

const date = ref(
  convertDateToString(
    String(route.query?.created_at__gte),
    String(route.query?.created_at__lte)
  )
);

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  fetchTableData,
  filterTableData,
} = useTableFetch("/notifications/NotificationList/");

function deleteNotification(id: any) {
  isLoading.value = true;
  ApiService.delete(`/notification/${id}/`)
    .then(() => {
      showToast(t("success_messages.successfully_deleted"), "success");
      fetchTableData();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

watch(
  () => date.value,
  (val) => {
    filterTableData({
      created_at__gte: String(convertStringToDate(String(val))[0]) ?? "",
      created_at__lte: String(convertStringToDate(String(val))[1]) ?? "",
    });
  }
);
</script>

<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="p-6 bg-white rounded-xl">
    <div>
      <CCard>
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
          :title="$t('notification_title')"
          :subtitle="t('notifications', { count: paginationData?.total })"
          :head="notificationHead"
          th-class="!bg-gray !text-gray-100 last:!text-right !max-w-[342px]"
        >
          <template #id="{ row }">
            <span class="font-semibold text-sm text-dark"
              >{{ row?._index }}.</span
            >
          </template>
          <template #name="{ row: data }">
            <span
              class="text-dark font-semibold text-xs line-clamp-2 !max-w-[382px]"
              >{{ data?.title }}</span
            >
          </template>
          <template #date_create="{ row: data }">
            <p class="text-xs font-normal mb-1">
              {{ dayjs(data?.created_at)?.format("DD.MM.YYYY") }}
            </p>
            <p class="text-xs font-normal text-gray-300">
              {{ dayjs(data?.created_at)?.format("HH:mm") }}
            </p>
          </template>
          <template #date_departure="{ row: data }">
            <p class="text-xs font-normal mb-1">
              {{ dayjs(data?.add_time)?.format("DD.MM.YYYY") }}
            </p>
            <p class="text-xs font-normal text-gray-300">
              {{ dayjs(data?.add_time)?.format("HH:mm") }}
            </p>
          </template>

          <template #beforeSearch>
            <div class="min-w-[248px] w-full">
              <FDatePicker
                v-model="date"
                range
                class="border border-gray rounded-md min-w-[240px] w-full"
                custom-class="bg-transparent rounded-md"
              />
            </div>
          </template>
          <template #afterSearch>
            <CButton
              :text="$t('add')"
              icon="icon-plus"
              class="flex items-center py-2 px-4 gap-2"
              size="md"
              @click="router.push({ name: 'PNotificationAdd' })"
            />
          </template>
          <template #no-data>
            <CNodata
              :title="$t('no_notifications_added')"
              :subtitle="$t('no_notifications_added_subtitle')"
              class="mt-8 px-6 pb-20 pt-0"
              :button-text="$t('add_notification')"
              image="/images/svg/no-data/no-notification.svg"
              button-custom-class="!mt-0"
              @submit="router.push({ name: 'PNotificationAdd' })"
            />
          </template>
          <template #action="{ row: data }">
            <CActionsDropdown
              class="mr-4"
              :list="exchangeActions"
              :selected-item="data"
              @edit="
                router.push({
                  name: 'PNotificationEdit',
                  params: { id: data?.id },
                })
              "
              @delete="deleteNotification(data?.id)"
            />
          </template>
        </CTableWrapper>
      </CCard>
    </div>
  </div>
</template>

<style scoped></style>
