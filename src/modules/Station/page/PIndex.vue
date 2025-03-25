<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <section>
    <CCard class="p-5">
      <CTableWrapper
        :current-page="paginationData?.currentPage ?? 0"
        :data="tableData"
        :head="stationsHead"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :loading="loading"
        :subtitle="t('eez', { count: paginationData?.total ?? 0 })"
        :title="$t('all_ezc')"
        :total="paginationData?.total"
        th-class="!bg-gray !text-gray-100"
        status-colors
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        @search="onSearch"
      >
        <template #beforeSearch>
          <div class="flex items-center justify-end gap-5">
            <FSelect
              v-model="filter.active_status"
              :options="allStatus()"
              :placeholder="t('users_module.status.placeholder')"
              is-checked
              label-key="label"
              selected-option-styles="h-10 max-w-[250px]"
              value-key="value"
            />
            <FSelect
              v-model="filter.active_status"
              :options="allStatus()"
              :placeholder="t('users_module.status.placeholder')"
              is-checked
              label-key="label"
              selected-option-styles="h-10 max-w-[250px]"
              value-key="value"
            />
          </div>
        </template>
        <template #_index="{ row: data }">
          <span class="font-medium text-sm">{{ data._index }}.</span>
        </template>
        <template #title="{ row: data }">
          <CStationCard :card="{ title: data?.name, id: data?.id }" />
        </template>
        <template #quantity="{ row: data }">
          <div class="flex-center max-w-[90px]">
            <div
              v-if="data?.count_connectors"
              class="bg-gray text-gray-300 flex-center px-1 py-0.5 rounded max-w-fit flex items-center space-x-0.5"
            >
              <span class="text-dark/90 text-xs font-medium tracking-widest">{{
                data?.count_connectors
              }}</span>
            </div>
            <span v-else>-</span>
          </div>
        </template>
        <template #location_name="{ row: data }">
          <CStationCard
            :card="{
              title: 'Парковка Чиланзара №32 (EBB-98735)',
              id: data?.id,
            }"
          />
        </template>
        <template #address="{ row: data }">
          <p class="max-w-[250px]">{{ data?.address }}</p>
        </template>
        <template #date="{ row: data }">
          <p class="text-xs font-normal">
            {{ dayjs(data?.created_at)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.created_at)?.format("HH:mm") }}
          </p>
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

        <template #afterSearch>
          <CButton
            :text="$t('add')"
            class="flex items-center py-2 px-4 gap-2"
            icon="icon-plus pl-2"
            size="md"
            @click="openAddModal"
          />
        </template>
        <template #no-data>
          <NoData
            :subtitle="$t('no_station_subtitle')"
            :title="$t('no_station')"
            :button-text="$t('add_station')"
            @submit="openAddModal"
            class="mt-8 px-6 pb-[76px] pt-0"
            button-custom-class="!mt-0"
            image="/images/svg/no-data/no-notification.svg"
          />
        </template>
        <template #action="{ row: data }">
          <CActionsDropdown
            :list="exchangeActions"
            :selected-item="data"
            @delete="deleteExchange(selectedExchange)"
            @edit="router.push({ name: 'PNotificationEdit' })"
          />
        </template>
        <template #beforePagination>
          <CStatusIndicate />
        </template>
      </CTableWrapper>
    </CCard>
    <CDialog
      :title="$t('add_station')"
      body-class="!max-w-md"
      is-flow
      v-bind="{ show: showAddModal }"
      @close="closeModal"
    >
      <template #default>
        <CCard class="px-5 pt-4 pb-5">
          <form @submit.prevent class="grid grid-cols-1 gap-5">
            <FGroup :label="$t('add_car_form.model')">
              <FSelect
                v-model="form.values.station"
                :error="form.$v.value.station?.$error"
                :options="addressList"
                isIcon
                :placeholder="$t('select_connector')"
                is-checked
                label-key="name"
                selectedOptionStyles="!bg-gray"
                value-key="id"
              />
            </FGroup>
            <div class="flex items-center justify-end gap-5">
              <CButton
                :text="$t('cancel')"
                variant="info"
                @click="closeModal"
              />
              <CButton type="submit" :text="$t('continue')" />
            </div>
          </form>
        </CCard>
      </template>
    </CDialog>
  </section>
</template>
<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import { useTableFetch } from "@/composables/useTableFetch";
import { exchangeActions } from "@/modules/Notification/data";
import CStationCard from "@/modules/Station/components/CStationCard.vue";
import { stationsHead } from "@/modules/Station/data";
import { allStatus } from "@/modules/Users/data";
import ApiService from "@/services/ApiService";
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import CStatusIndicate from "../components/CStatusIndicate.vue";

const { mounted } = useMounted();
const { t } = useI18n();
const routes = computed(() => [
  {
    name: t("eez"),
    route: "/",
  },
]);

const { showToast } = useCustomToast();
const router = useRouter();
const isLoading = ref(false);
const selectedExchange = ref();
const onToggle = ref(false);
const form = useForm(
  {
    station: "",
  },
  {
    station: { required },
  }
);

function deleteExchange(exchange: any) {
  isLoading.value = true;
  ApiService.delete(`/bot/exchange/${exchange?.id}`)
    .then(() => {
      showToast(t("successfully_deleted"), "success");
      fetchTableData();
    })
    .catch(() => {
      showToast(t("some_error"), "error");
    })
    .finally(() => {
      selectedExchange.value = null;
      isLoading.value = false;
    });
}

const showAddModal = ref(false);

const openAddModal = () => {
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
};

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  fetchTableData,
} = useTableFetch("/address/");

const route = useRoute();
const userTypes = ref([
  {
    title: t("users_module.user_type.all"),
    value: "",
  },
  {
    title: t("users_module.user_type.in_station"),
    value: 1,
  },
  {
    title: t("users_module.user_type.out_station"),
    value: 2,
  },
  {
    title: t("users_module.user_type.admin"),
    value: 3,
  },
]);
const addressList = ref([]);

const filter = reactive({
  active_status: "",
});

const { filterTableData } = useTableFetch("/users/");

onMounted(() => {
  ApiService.get(`address`, "?limit=1000").then((res) => {
    addressList.value = res?.data.results.map((item: any) => {
      return {
        ...item,
        icon: item?.icon ?? "/images/station/location.svg",
      };
    });
    console.log("addressList", addressList.value);
  });
});

watch(
  () => filter,
  (newVal) => {
    filterTableData({
      ...newVal,
      active_status: newVal.active_status === "all" ? "" : newVal.active_status,
    });
  },
  { deep: true }
);
</script>
