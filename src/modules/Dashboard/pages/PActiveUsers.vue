<script lang="ts" setup>
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { activeUsersTableHeadData } from "@/modules/Dashboard/data";
import dayjs from "dayjs";
import CCharger from "@/components/Card/CCharger.vue";
import CCard from "@/components/Card/CCard.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import CCar from "@/components/Card/CCar.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { formatPhoneNumber } from "@/utils";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";

const {
  tableData,
  onPageChange,
  paginationData,
  onSearch,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch("/ongoing-charge-transactions/");

const { mounted } = useMounted();
const { t } = useI18n();
const route = useRoute();
const addressList = ref([]);
const userList = ref([]);
const filter = reactive({
  address: "",
  user: "",
});

const routes = computed(() => [
  {
    name: t("main_page"),
    route: "/",
  },
  {
    name: t("charging_now"),
    route: "",
  },
]);

onMounted(() => {
  ApiService.get(`address`, "?limit=1000").then((res) => {
    addressList.value = res?.data?.results.filter(
      (item: { name: string }) => item?.name
    );
  });
  ApiService.get(`select-user-list`).then((res) => {
    userList.value = res?.data.filter(
      (item: { full_name: string }) => item?.full_name
    );
  });
});

watch(
  () => filter,
  () => {
    filterTableData(filter);
  },
  { deep: true }
);
</script>

<template>
  <header>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <SBreadcrumb v-bind="{ routes }" />
    </Teleport>
  </header>
  <main>
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
        :head="activeUsersTableHeadData()"
        :subtitle="t('charging_count', paginationData.total)"
        :title="$t('dashboard.active_users')"
        type="transparent"
      >
        <template #beforeSearch>
          <nav class="flex items-center gap-5">
            <FSelect
              :options="[{ name: t('all_ezc'), id: '' }, ...addressList]"
              v-model="filter.address"
              :placeholder="$t('all_ezc')"
              value-key="id"
              label-key="name"
              selected-option-styles="h-10 max-w-[250px]"
              is-checked
            />
            <FSelect
              :options="[{ full_name: t('all_users'), id: '' }, ...userList]"
              v-model="filter.user"
              :placeholder="$t('all_users')"
              value-key="id"
              label-key="full_name"
              selected-option-styles="h-10 max-w-[250px]"
              is-checked
            />
          </nav>
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
              {{ dayjs(data?.start_date).format("DD.MM.YYYY") }}
            </span>
            <span class="text-gray-300 text-xs font-normal">{{
              dayjs(data?.start_date).format("HH:mm")
            }}</span>
          </div>
        </template>
      </CTableWrapper>
    </CCard>
  </main>
</template>

<style scoped></style>
