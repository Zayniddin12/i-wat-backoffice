<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FCheckbox from "@/components/Form/Checkbox/FCheckbox.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { userTableHeadData } from "@/modules/Users/data";
import { formatMoneyDecimal, formatPhoneNumber } from "@/utils";
import dayjs from "dayjs";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useMounted } from "@vueuse/core";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const router = useRouter();

const userTypes = ref([
  {
    title: t("users_module.user_type.all"),
    value: ""
  },
  {
    title: t("users_module.user_type.in_station"),
    value: 1
  },
  {
    title: t("users_module.user_type.out_station"),
    value: 2
  },
  {
    title: t("users_module.user_type.admin"),
    value: 3
  }
]);

const filter = reactive({
  is_birth_date: route.query.is_birth_date === "true",
  active_status: route.query.active_status ? +route.query.active_status : "",
  user_type: +route.query.user_type || ""
});

const statusOptions = ref([
  { label: t("users_module.status.all"), value: 0 },
  { label: t("users_module.status.active"), value: 1 },
  { label: t("users_module.status.inactive"), value: 2 }
]);

const breadcrumbRoutes = computed(() => {
  return [
    {
      name: t("side_menu.users"),
      route: "/users",
      link: true
    },
    {
      name: t("side_menu.all_users"),
      route: "/users",
      disabled: true
    }
  ];
});

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData
} = useTableFetch("/users/", {}, false, true);

const mappedFilter = computed(() => ({
  ...filter,
  active_status:
    filter.active_status === 0
      ? "all"
      : filter.active_status === 1
        ? "true"
        : "false"
}));

watch(
  () => filter,
  (newFilter) => {
    const query = { ...route.query };

    if (newFilter.is_birth_date !== undefined) {
      query.is_birth_date = newFilter.is_birth_date.toString();
    } else {
      delete query.is_birth_date;
    }

    if (newFilter.active_status !== "") {
      query.active_status = newFilter.active_status.toString();
    } else {
      delete query.active_status;
    }

    if (newFilter.user_type !== "") {
      query.user_type = newFilter.user_type.toString();
    } else {
      delete query.user_type;
    }

    router.replace({ query });

    filterTableData(mappedFilter.value);
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
      :head="userTableHeadData()"
      :items-per-page="+route.query?.limit || 10"
      :limit="paginationData?.defaultLimit"
      :loading="loading"
      :subtitle="t('users', { count: paginationData?.total })"
      :title="t('side_menu.all_users')"
      :total="paginationData?.total"
      head-classes="!max-w-[870px]"
      th-class="users-module__row last:!text-right"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      @search="onSearch"
    >
      <!--      head   -->
      <template #beforeSearch>
        <div class="flex items-center justify-end gap-5">
          <FCheckbox
            v-model="filter.is_birth_date"
            :checked="filter.is_birth_date"
            :label="t('users_module.is_birthday_today')"
            @change="filter.is_birth_date = $event"
          />
          <FSelect
            v-model="filter.active_status"
            :options="statusOptions"
            :placeholder="t('users_module.status.placeholder')"
            label-key="label"
            value-key="value"
          />
          <FSelect
            v-model="filter.user_type"
            :options="userTypes"
            :placeholder="t('all_users')"
            is-checked
            label-key="title"
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
            avatar: data?.avatar_url,
            full_name: data?.full_name,
            phone_number: formatPhoneNumber(data?.phone),
            userLink: `/users/${data?.id}`,
          }"
          :is-admin="data?.role === 'Admin'"
          :is-birthday="data?.is_birth_date"
        />
      </template>
      <template #col_vo_car="{ row: data }">
        <p class="text-dark text-xs font-normal w-full">
          {{ data?.car_count }}
        </p>
      </template>
      <template #col_vo_station="{ row: data }">
        <p class="text-dark text-xs font-normal">
          {{ data?.charge_point_count > 0 ? data?.charge_point_count : "-" }}
        </p>
      </template>
      <template #balance="{ row: data }">
        <span>{{ formatMoneyDecimal(data?.balance) }} UZS</span>
      </template>
      <template #registration_date="{ row: data }">
        <div class="flex flex-col gap-1">
          <p class="text-xs font-normal">
            {{ dayjs(data?.date_joined)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.date_joined)?.format("HH:mm") }}
          </p>
        </div>
      </template>
      <template #last_login="{ row: data }">
        <div class="flex flex-col gap-1">
          <p v-if="data?.last_login" class="text-xs font-normal">
            {{ dayjs(data?.last_login)?.format("DD.MM.YYYY") }}
          </p>
          <p v-if="data?.last_login" class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.last_login)?.format("HH:mm") }}
          </p>
          <p
            v-if="!data?.last_login"
            class="text-xs font-normal mb-1 w-full mx-auto ml-7"
          >
            -
          </p>
        </div>
      </template>
      <template #status="{ row: data }">
        <p :class="[{ 'text-red': !data?.active_status }, '']">
          {{ data?.active_status ? t("active") : t("inactive") }}
        </p>
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
  <!--  <div v-else-if="!loading" class="bg-white rounded-xl p-6">-->
  <!--    <div class="flex flex-col">-->
  <!--      <div>-->
  <!--        <h2 class="mb-1 text-xl leading-[22px] font-bold text-dark">-->
  <!--          {{ t("side_menu.all_users") }}-->
  <!--        </h2>-->
  <!--        <p class="text-xs leading-normal font-normal text-gray-100">-->
  <!--          {{ t("users", { count: 0 }) }}-->
  <!--        </p>-->
  <!--      </div>-->

  <!--      <div class="mt-4">-->
  <!--        <NoData-->
  <!--          :subtitle="t('users_module.all_users.no_data_subtitle')"-->
  <!--          :title="t('users_module.all_users.no_data_title')"-->
  <!--          class="p-0 pb-[76px]"-->
  <!--          image="/images/svg/no-data/default_no_data.svg"-->
  <!--        />-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
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
