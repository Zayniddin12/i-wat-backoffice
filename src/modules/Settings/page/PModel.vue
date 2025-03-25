<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <section class="p-6 bg-white rounded-xl">
    <CCard>
      <CTableWrapper
        :current-page="paginationData?.currentPage"
        :data="tableData"
        :head="modelHead"
        :items-per-page="+route.query?.limit || 10"
        :limit="paginationData?.defaultLimit"
        :loading="loading"
        :subtitle="t('model_count', { count: paginationData?.total ?? 0 })"
        :title="$t('models')"
        :total="paginationData?.total"
        th-class="!bg-gray !text-gray-100 last:!text-right"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        @search="onSearch"
      >
        <template #id="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #name="{ row: data }">
          <span class="text-xs font-bold">{{ data?.name }}</span>
        </template>
        <template #mark="{ row: data }">
          <CStationCard
            :card="{
              title: data?.manufacturer_name,
              image: data?.manufacturer_icon,
            }"
          />
        </template>
        <template #added_at="{ row: data }">
          <p class="text-xs font-normal">
            {{ dayjs(data?.created_at)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.created_at)?.format("HH:mm") }}
          </p>
        </template>
        <template #afterSearch>
          <CButton
            :text="$t('add')"
            class="flex items-center py-2 px-4 gap-2"
            icon="icon-plus"
            size="md"
            @click="openAddModel"
          />
        </template>
        <template v-if="dataValue?.length" #beforeSearch>
          <div class="flex items-center justify-end">
            <FSelect
              v-model="mark"
              :options="[
                { name: $t('all_marks'), value: '' },
                ...selectOptions,
              ]"
              :placeholder="$t('all_marks')"
              is-checked
              selected-option-styles="h-10 max-w-[250px]"
            />
          </div>
        </template>
        <template #no-data>
          <CNodata
            :button-text="t('add_model')"
            :subtitle="$t('no_models_subtitle')"
            :title="$t('no_models')"
            button-custom-class="!mt-0"
            class="mt-8 px-6 pb-20 pt-0"
            image="/images/svg/no-data/no-notification.svg"
            @submit="openAddModel"
          />
        </template>
        <template #action="{ row: data }">
          <CActionsDropdown
            :list="exchangeActions"
            :selected-item="data"
            class="mr-4"
            @delete="handleDeleteModel(data)"
            @edit="openEditModel(data)"
          />
        </template>
      </CTableWrapper>
    </CCard>

    <CDialog
      :title="$t(isEdit ? 'edit_model_car' : 'add_model_car')"
      body-class="!max-w-[420px] !overflow-visible"
      v-bind="{ show }"
      @close="show = false"
    >
      <div class="p-5 pt-4">
        <FGroup :label="$t('mark_car')" class="mb-5">
          <FSelect
            v-model="form.values.mark"
            :error="form.$v.value.mark?.$error"
            :options="selectOptions"
            :placeholder="$t('select_model_car')"
            is-checked
            selectedOptionStyles="!bg-gray"
          />
        </FGroup>
        <FGroup :label="$t('model_car')">
          <FInput
            v-model="form.values.model"
            :error="form.$v.value.model?.$error"
            :placeholder="$t('enter_model_value')"
          />
        </FGroup>
      </div>
      <template #footer>
        <div class="p-5 pt-0 flex items-center justify-end">
          <div class="flex items-center gap-4">
            <CButton
              :text="$t('cancel')"
              type="button"
              variant="info"
              @click="show = false"
            />
            <CButton
              :disabled="form.$v.value.$invalid"
              :loading="isLoading"
              :text="$t(isEdit ? 'save' : 'add')"
              variant="primary"
              @click="submit"
            />
          </div>
        </div>
      </template>
    </CDialog>
    <CDeleteDialog
      :subtitle="$t('delete_content')"
      :title="$t('delete_model')"
      :loading="deleteLoading"
      :show="showDeleteModel"
      @close="showDeleteModel = false"
      @submit="deleteModel"
    />
  </section>
</template>
<script lang="ts" setup>
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import dayjs from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import { exchangeActions, modelHead } from "@/modules/Notification/data";
import { useTableFetch } from "@/composables/useTableFetch";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CStationCard from "@/modules/Station/components/CStationCard.vue";
import { dataValue } from "@/modules/Settings/data";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CNodata from "@/components/Common/NoData/NoData.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FGroup from "@/components/Form/FGroup.vue";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import { ICarModel } from "@/modules/Settings/types";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";

const { mounted } = useMounted();
const { t } = useI18n();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const isEdit = ref(false);
const mark = ref("");
const routes = computed(() => [
  {
    name: t("settings"),
    route: "/settings",
  },
  {
    name: t("models"),
    route: "/settings/model",
  },
]);

const show = ref(false);
const route = useRoute();
const isLoading = ref(false);
const selectOptions = ref<ICarModel[]>([]);
const deleteLoading = ref(false);
const showDeleteModel = ref(false);
const modelID = ref("");
let editedItem: ICarModel;

const form = useForm(
  {
    mark: "",
    model: "",
  },
  {
    mark: { required },
    model: { required },
  }
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
} = useTableFetch("/car-models/");

const openEditModel = (data: any) => {
  let id = selectOptions.value.find(
    (el) => el?.name === data?.manufacturer_name
  )?.id;
  editedItem = data;
  editedItem.manufacturer_id = Number(id);
  isEdit.value = true;
  show.value = true;
  form.values.mark = Number(id);
  form.values.model = data?.name;
};

const openAddModel = () => {
  form.values.mark = "";
  form.values.model = "";
  show.value = true;
  isEdit.value = false;
};

watch(
  () => show.value,
  () => {
    if (!show.value) {
      form.values.mark = "";
      form.values.model = "";
      form.$v.value.$reset();
    }
  }
);

watch(
  () => mark.value,
  () => {
    filterTableData({ manufacturer: mark.value });
  }
);

onMounted(() => {
  ApiService.get(`manufacturers`, "?limit=1000").then((res) => {
    selectOptions.value = res.data.results;
  });
});

function submit() {
  !isEdit.value ? addModel() : editModel();
}

function addModel() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) return;
  isLoading.value = true;
  ApiService.post("/car-models/", {
    name: form.values.model,
    manufacturer: form.values.mark,
  })
    .then(() => {
      showToast(t("success_messages.successfully_added"), "success");
      fetchTableData();
    })
    .catch((error) => {
      handleError(error);
    })
    .finally(() => {
      isLoading.value = false;
      show.value = false;
    });
}

function editModel() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) return;
  if (
    Number(form.values.mark) === editedItem?.manufacturer_id &&
    form.values.model === editedItem?.name
  ) {
    show.value = false;
    return;
  }
  isLoading.value = true;
  ApiService.put(`/car-model/${editedItem?.id}/`, {
    name: form.values.model,
    manufacturer: form.values.mark,
    id: editedItem?.id,
  })
    .then(() => {
      showToast(t("success_messages.successfully_edited"), "success");
      fetchTableData();
    })
    .catch((error) => {
      handleError(error);
    })
    .finally(() => {
      isLoading.value = false;
      show.value = false;
    });
}

function handleDeleteModel(data: any) {
  showDeleteModel.value = true;
  modelID.value = data?.id;
}

function deleteModel() {
  deleteLoading.value = true;
  ApiService.delete(`car-model/${modelID.value}/`)
    .then(() => {
      showToast(t("success_messages.successfully_deleted"), "success");
      fetchTableData();
    })
    .catch((error) => {
      handleError(error);
    })
    .finally(() => {
      deleteLoading.value = false;
      showDeleteModel.value = false;
    });
}
</script>

<style scoped></style>
