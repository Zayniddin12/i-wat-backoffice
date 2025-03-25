<script setup lang="ts">
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { userTableCarsHeadData } from "@/modules/Users/data";
import CUserCard from "@/components/Card/CUserCard.vue";
import CCar from "@/components/Card/CCar.vue";
import TypeConnector from "@/modules/Users/components/Cards/TypeConnector.vue";
import CCarNumber from "@/components/Card/CCarNumber.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute, useRouter } from "vue-router";
import { convertPhoneNumberToString } from "@/utils/changeNumberFormat";
import { formatPhoneNumber } from "@/utils";
import CTableDate from "@/components/Common/CTableDate.vue";
import ApiService from "@/services/ApiService";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const router = useRouter();
const manufacturerList = ref([]);
const modelList = ref([]);
const breadcrumbRoutes = computed(() => {
  return [
    {
      name: t("side_menu.cars"),
      route: "/users",
      link: true,
    },
    {
      name: t("side_menu.cars_machine"),
      route: "/users",
      disabled: true,
    },
  ];
});

const filter = reactive({
  is_user_defined: route.query.is_user_defined === "true",
  manufacturer: +route.query.manufacturer || "",
  model: +route.query.model || "",
});

watch(
  () => filter.is_user_defined,
  (newValue) => {
    const query = { ...route.query };
    if (newValue !== undefined) {
      query.is_user_defined = newValue.toString();
    } else {
      delete query.is_user_defined;
    }
    router.replace({ query });
    filterTableData(filter);
  }
);

watch(
  () => filter.manufacturer,
  (newValue) => {
    const query = { ...route.query };
    if (newValue) {
      query.manufacturer = newValue;
    } else {
      delete query.manufacturer;
    }
    router.replace({ query });
    filterTableData(filter);
  }
);

watch(
  () => filter.model,
  (newValue) => {
    const query = { ...route.query };
    if (newValue) {
      query.model = newValue;
    } else {
      delete query.model;
    }
    router.replace({ query });
    filterTableData(filter);
  }
);

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  filterTableData,
} = useTableFetch("/cars/");

onMounted(() => {
  ApiService.get(`manufacturers`, "?limit=1000").then((res) => {
    manufacturerList.value = res.data?.results;
  });

  ApiService.get(`car-models`, "?limit=1000").then((res) => {
    modelList.value = res.data?.results;
  });
});

watch(
  () => filter,
  () => {
    filterTableData(filter);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb :routes="breadcrumbRoutes" />
  </Teleport>
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
      :head="userTableCarsHeadData()"
      :title="$t('side_menu.cars_machine')"
      :subtitle="t('cars_count', { count: paginationData.total ?? 0 })"
      th-class="last:!text-left"
    >
      <template #no-data>
        <NoData
          :title="$t('no_cars_machine_title')"
          :subtitle="$t('no_cars_machine_subtitle')"
          class="mt-8 px-6 pb-[60px] pt-0"
          image="/images/svg/no-data/no-notification.svg"
          slot-classes="!m-0"
        />
      </template>

      <!--   head   -->
      <template #beforeSearch>
        <div class="flex items-center justify-end gap-5">
          <FCheckbox
            :checked="filter.is_user_defined"
            @change="filter.is_user_defined = $event"
            :label="$t('user_machine.checkbox_title')"
            label-styles="inline-block max-w-[132px]"
          />
          <pre></pre>
          <FSelect
            :options="[
              { name: $t('user_machine.selects.all_models'), id: '' },
              ...modelList,
            ]"
            v-model="filter.model"
            :placeholder="$t('user_machine.selects.all_models')"
            selected-option-styles="h-10 max-w-[250px]"
            is-checked
          />
          <FSelect
            :options="[
              { name: $t('user_machine.selects.all_marks'), id: '' },
              ...manufacturerList,
            ]"
            v-model="filter.manufacturer"
            :placeholder="$t('user_machine.selects.all_marks')"
            selected-option-styles="h-10 max-w-[250px]"
            is-checked
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
        />
      </template>
      <template #number="{ row: data }">
        <CCarNumber
          :type="data?.state_number_type ?? 'TYPE_II'"
          :value="convertPhoneNumberToString(data?.state_number)"
        />
      </template>
      <template #model="{ row: data }">
        <CCar
          :car="{
            image: data?.model?.manufacturer_icon,
            name: data?.model?.manufacturer_name,
            model: data?.model?.name,
          }"
        />
      </template>
      <template #vin="{ row: data }">
        <span v-if="data?.vin" class="text-xs">{{ data?.vin }}</span>
        <span v-else class="text-xs"> - </span>
      </template>
      <template #connector="{ row: data }">
        <TypeConnector :charging_type="data?.charging_type" />
      </template>
      <template #added_date="{ row: data }">
        <CTableDate :date="data?.created_at" />
      </template>
    </CTableWrapper>
  </CCard>
</template>
