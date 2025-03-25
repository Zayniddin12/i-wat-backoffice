<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <main>
    <header>
      <CCard class="p-5 flex items-center justify-between">
        <h3 class="w-full text-xl text-dark leading-130 font-semibold">
          Добавить новую станцию
        </h3>
        <div class="space-x-4 flex items-center">
          <CButton variant="info" :text="$t('cancel')" />
          <CButton variant="primary" :text="$t('add')" />
        </div>
      </CCard>
    </header>

    <section class="mt-5">
      <div class="flex space-x-5 mb-5">
        <CCard class="p-5 w-1/2">
          <FGroup label="Эта станция прикрепляется к текущему локацию">
            <div class="border-b border-gray-400 -mt-1"></div>
            <div class="flex justify-between items-center">
              <p class="text-sm font-normal">Мирабад №28 (EBB-98735)</p>
              <CButton
                variant="info"
                icon="icon-edit"
                icon-position="left"
                :text="$t('edit2')"
                size="md"
              />
            </div>
            <!-- <div class="border-b border-gray-400 pb-5"></div> -->
            <!-- <FInput placeholder="Мирабад №28 (EBB-98735)" /> -->
          </FGroup>
        </CCard>
        <CCard class="p-5 w-1/2">
          <div class="flex gap-5">
            <FGroup class="!w-1/2" label="Отображаемое имя">
              <FInput placeholder="Введите название колонки" />
            </FGroup>
            <FGroup class="!w-1/2" label="Connection ID ">
              <FInput placeholder="Введите Connection ID" />
            </FGroup>
          </div>
        </CCard>
      </div>
      <CCard class="p-5 mt-5">
        <h3 class="text-lg font-medium text-dark border-b border-gray-400 pb-5">
          Доступы пользователям
        </h3>
        <div class="flex gap-5 mt-5">
          <FGroup label="Владелец">
            <FInput placeholder="Выберите владельца" />
          </FGroup>
          <FGroup label="Доступ для заряжения">
            <FInput placeholder="Выберите пользователей" />
          </FGroup>
        </div>
        <div class="flex gap-5 mt-3">
          <div class="w-1/2"></div>
          <FCheckbox
            :checked="false"
            @change="() => {}"
            label="Для всех пользователей"
            class="w-1/2"
          />
        </div>
      </CCard>
      <CCard class="p-5 mt-5">
        <div class="flex gap-5 justify-between">
          <label
            class="relative my-4 inline-flex items-center cursor-pointer max-w-[166px]"
          >
            <input type="checkbox" class="sr-only peer" />
            <span
              class="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"
            ></span>
            <span class="ms-3 text-sm font-medium text-dark">Бронирование</span>
          </label>
          <label
            class="relative my-4 inline-flex items-center cursor-pointer w-1/2"
          >
            <input type="checkbox" class="sr-only peer" />
            <span
              class="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"
            ></span>
            <span class="ms-3 text-sm font-medium text-dark text-nowrap">{{
              $t("charging_history_modal.parking.title")
            }}</span>
          </label>
        </div>
        <div class="flex gap-5 justify-between">
          <div class="flex w-1/2 gap-5">
            <FGroup class="!w-1/2" label="Цена за бронь (мин)">
              <FInput placeholder="" />
            </FGroup>
            <FGroup class="!w-1/2" label="Бесплатная минута">
              <FInput placeholder="Введите Connection ID" />
            </FGroup>
          </div>
          <div class="flex w-1/2">
            <FGroup label="Цена за парковку (мин)">
              <FInput placeholder="Введите Connection ID" />
            </FGroup>
          </div>
        </div>
      </CCard>
    </section>

    <section class="mt-5">
      <CCard class="p-5">
        <div class="flex">
          <h3 class="w-full text-xl text-dark leading-130 font-semibold">
            Коннектор A
          </h3>
          <CButton
            variant="error"
            icon="icon-trash"
            icon-position="left"
            :text="$t('delete')"
            >Удалить</CButton
          >
        </div>
        <h3 class="text-lg font-medium text-dark border-b border-gray-400 pb-5">
          Доступы пользователям
        </h3>
      </CCard>
    </section>

    <footer>
      <CButton
        class="mt-5 w-full"
        icon="icon-plus pr-1"
        icon-position="left"
        variant="primary"
        :text="$t('add_connector2')"
        size="lg"
      />
    </footer>

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
      <CAddStationV1
        :data="single"
        is-edit
        @close="editStationModal = false"
        @edited="stationEdited"
      />
    </CDialog>
  </main>
</template>
<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { ITabItem } from "@/components/Tab/CTab.types";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import { useMounted } from "@/composables/useMounted";
import CAddColumn from "@/modules/Station/components/CAddColumn.vue";
import CAddStationV1 from "@/modules/Station/components/CAddStation-v1.vue";
import { IColumn, IStation } from "@/modules/Station/types/interface";
import ApiService from "@/services/ApiService";
import { computed, ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

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
