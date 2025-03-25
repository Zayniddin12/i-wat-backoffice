<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { useI18n } from "vue-i18n";
import NoData from "@/components/Common/NoData/NoData.vue";
import { stationsHead } from "@/modules/Station/data";
import { exchangeActions } from "@/modules/Notification/data";
import { useCustomToast } from "@/composables/useCustomToast";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/services/ApiService";
import { useTableFetch } from "@/composables/useTableFetch";
import CStationCard from "@/modules/Station/components/CStationCard.vue";
import CQuantityCard from "@/modules/Station/components/CQuantityCard.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import CTableDate from "@/components/Common/CTableDate.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CAddStation from "@/modules/Station/components/CAddStation.vue";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";

const { t } = useI18n();
const route = useRoute();
const showAddModal = ref(false);
const { showToast } = useCustomToast();
const router = useRouter();
const isLoading = ref(false);
const selectedExchange = ref();

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

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  fetchTableData,
  filterTableData,
} = useTableFetch(`/address/?user=${route.params?.id}`);

const getQuantity = (data: any) => {
  return data?.count_connectors.replace(/[\s-]/g, "").replace(/\//g, " / ");
};

const filter = reactive({
  region: +route.query.region || "all",
});

const closeAddModal = () => {
  showAddModal.value = false;
};

const openAddModal = () => {
  showAddModal.value = true;
};

const regions = ref([]);

watch(
  () => filter,
  (newFilter) => {
    const query = { ...route.query };

    if (newFilter.region !== "") {
      query.region = newFilter.region.toString();
    } else {
      delete query.region;
    }

    router.replace({ query });

    filterTableData(filter);
  },
  { deep: true }
);

onMounted(() => {
  ApiService.get(`/regions`, "?limit=1000").then((res) => {
    regions.value = res.data?.map((r) => {
      return {
        label: r?.name,
        value: r?.id,
      };
    });
  });
});
</script>

<template>
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
      th-class="!bg-gray !text-gray-100 last:!text-left"
      :head="stationsHead"
      :title="$t('list_of_stations')"
      :subtitle="t('number_of_stations', { count: paginationData?.total ?? 0 })"
    >
      <!--      head  -->
      <template #beforeSearch>
        <div>
          <FSelect
            v-model="filter.region"
            :options="[{ label: t('all_regions'), value: 'all' }, ...regions]"
            :placeholder="t('all_regions')"
            is-checked
            label-key="label"
            selected-option-styles="h-10 max-w-[250px]"
            value-key="value"
          />
        </div>
      </template>
      <!--      body  -->
      <template #_index="{ row }">
        <span class="font-semibold text-sm">{{ row?._index }}.</span>
      </template>
      <template #title="{ row: data }">
        <CStationCard
          :card="{
            id: data?.id,
            title: data?.name,
            tab: true,
            icon: 'icon-ring-location-rounded text-blue text-[20px]',
          }"
        />
      </template>
      <template #quantity="{ row: data }">
        <CQuantityCard :quantity="getQuantity(data)" />
      </template>
      <template #location_name="{ row: data }">
        <span>{{ data?.address }}</span>
      </template>
      <template #date="{ row: data }">
        <CTableDate :date="data?.created_at" />
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
          :subtitle="$t('no_data_station_subtitle')"
          :title="$t('no_data_station_title')"
          class="mb-0"
          image="/images/svg/no-data/no-notification.svg"
          button-custom-class="!mt-0"
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
    </CTableWrapper>

    <CDialog
      :show="showAddModal"
      :title="$t('add_station')"
      body-class="!max-w-4xl"
      v-bind="{ show: showAddModal }"
      @close="showAddModal = false"
    >
      <CAddStation @close="closeAddModal" />
    </CDialog>
  </CCard>
</template>

<style scoped>
span {
  @apply text-dark font-normal text-xs;
}
</style>
