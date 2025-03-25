<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <main>
    <header>
      <CCommonHeader
        :key="single"
        v-model="activeTab"
        :data="single"
        :loading="loadingSingle"
        :sub-title="single?.landmark"
        :tab-list="getTabs"
        :title="single?.name"
        @add="openAddModal"
        @delete="deleteModal = true"
        @edit="editStationModal = true"
      >
        <template v-if="checkRouteFromUser" #actions>
          <CButton
            :text="$t('add_column')"
            class="mt-0"
            icon="icon-plus pl-1 text-xs"
            icon-position="right"
            variant="primary"
            @click="editStationModal = true"
          />
        </template>

        <template #details>
          <CProfileDashDetail
            :description="$t('column_count')"
            :title="single?.columns_ids?.length as string"
          />

          <CProfileDashDetail
            :description="$t('added_at')"
            :title="dayjs(single.created_at).format('DD.MM.YYYY')"
          />

          <CProfileDashDetail
            :description="$t('price_of_station')"
            :title="single.price_parking as string + ' UZS'"
          />
        </template>
      </CCommonHeader>
    </header>

    <section class="mt-5">
      <CCard class="p-5 pb-0">
        <Transition mode="out-in" name="fade">
          <div :key="activeTab">
            <div v-for="(tab, idx) in tabs" :key="idx">
              <div v-if="activeTab === tab.value">
                <Column
                  :column="currentColumn"
                  :is-fetching="isFetching"
                  @edit-column="editColumn"
                />
              </div>
            </div>
            <div v-if="activeTab === 'charging_history'">
              <HistoryCharging :options="tabs" />
            </div>
          </div>
        </Transition>
      </CCard>
    </section>
    <CDialog
      :title="$t('delete')"
      body-class="!max-w-sm"
      v-bind="{ show: deleteModal }"
      @close="deleteModal = false"
    >
      <div class="container my-5 text-lg text-center">
        <p class="text-gray-100 text-sm">
          {{ $t("delete_station") }}
        </p>
        <div class="flex items-center justify-end gap-5 my-4">
          <CButton
            :text="$t('cancel')"
            class="w-full flex items-center justify-center py-2 px-4 gap-2"
            size="md"
            variant="info"
            @click="deleteModal = false"
          />
          <CButton
            :text="$t('delete')"
            class="w-full flex items-center justify-center py-2 px-4 gap-2 bg-red hover:bg-red/90 transition-200"
            size="md"
            @click="deleteStansion"
          />
        </div>
      </div>
    </CDialog>

    <CDialog
      :title="$t(isEdit ? 'edit_column' : 'add_columns')"
      body-class="!max-w-xl"
      v-bind="{ show: showAddModal }"
      @close="closeModal"
    >
      <CAddColumn
        :station-id="single?.id"
        :column="currentColumn"
        :is-edit="isEdit"
        @close="closeModal"
        @fetch="fetchColumns"
      />
    </CDialog>
    <CDialog
      :title="$t('edit_station')"
      body-class="!max-w-4xl"
      v-bind="{ show: editStationModal }"
      @close="editStationModal = false"
    >
      <CAddStation
        :data="single"
        is-edit
        @close="editStationModal = false"
        @edited="stationEdited"
      />
    </CDialog>
  </main>
</template>
<script lang="ts" setup>
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, ref, unref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CAddColumn from "@/modules/Station/components/CAddColumn.vue";
import { ITabItem } from "@/components/Tab/CTab.types";
import CAddStation from "@/modules/Station/components/CAddStation.vue";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import { IColumn, IStation } from "@/modules/Station/types/interface";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CCard from "@/components/Card/CCard.vue";
import Column from "@/modules/Station/components/Tables/Column.vue";
import HistoryCharging from "@/modules/Station/components/Tables/HistoryCharging.vue";
import CButton from "@/components/Common/CButton.vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";

const { mounted } = useMounted();
const { t } = useI18n();
const route = useRoute();
const { showToast } = useCustomToast();
const router = useRouter();
const routes = computed(() => [
  {
    name: t("eez"),
    route: "/stations",
  },
  {
    name: single.value?.name,
    route: "",
  },
]);

const { handleError } = useHandleError();
const showAddModal = ref(false);
const isEdit = ref(false);
const deleteModal = ref(false);
const editStationModal = ref(false);
const loadingSingle = ref(false);

const single = ref<IStation>({});
const checkRouteFromUser = computed(() => {
  return route.query?.isFromUser === "true";
});
const currentColumn = ref<IColumn>();

const tabs = ref<ITabItem[]>([]);
const activeTab = ref();
const isFetching = ref(false);

function fetchColumns() {
  isFetching.value = true;
  console.log("edited");
  fetchSingleData();
}

// fetch single data
const fetchSingleData = () => {
  loadingSingle.value = true;

  ApiService.get<IStation>(`/address/${route.params.id}`)
    .then((res) => {
      tabs.value = [];
      single.value = res.data;
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      loadingSingle.value = false;
    });
};

fetchSingleData();

const getTabs = computed(() => {
  if (!single.value?.columns_ids?.length)
    return [
      {
        label: t("charging_history"),
        value: "charging_history",
      },
    ];

  single.value?.columns_ids.forEach((item, idx) => {
    tabs.value.push({
      label: (item.name as string) ?? t("column", { id: item.id }),
      value: `column_no_${idx + 1}`,
      id: item?.id,
    });
  });

  return [
    ...tabs.value,
    {
      label: t("charging_history"),
      value: "charging_history",
    },
  ];
});

const getCurrentColumn = () => {
  if (!single.value.columns_ids?.length) return;

  currentColumn.value = single.value.columns_ids[0];
};

getCurrentColumn();

const openAddModal = () => {
  isEdit.value = false;
  showAddModal.value = true;
};

function editColumn() {
  isEdit.value = true;
  showAddModal.value = true;
}

const stationEdited = () => {
  fetchSingleData();
  editStationModal.value = false;
};

const closeModal = () => {
  showAddModal.value = false;
  isEdit.value = false;
};

watch(
  () => activeTab,
  (val) => {
    const id = tabs.value.find((item) => item.value === unref(val))?.id;

    single.value?.columns_ids?.find((item) => {
      if (item.id === id) {
        currentColumn.value = item;
      }
    });
  },
  { deep: true, immediate: true }
);

watch(
  () => tabs,
  (tabList) => {
    activeTab.value = tabList.value[0]?.value ?? "charging_history";
  },
  { immediate: true, deep: true }
);

function deleteStansion(id: any) {
  ApiService.delete(`/address/${route.params?.id}/`)
    .then(() => {
      showToast(t("success_messages.successfully_deleted"), "success");
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      deleteModal.value = false;
      router.push({ name: "PStations" });
    });
}
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 8px 30px 0 rgba(25, 30, 54, 0.2);
}
</style>
