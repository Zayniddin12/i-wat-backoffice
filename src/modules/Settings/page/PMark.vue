<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <section class="p-6 bg-white rounded-xl">
    <CCard>
      <CTableWrapper
        :title="$t('mark')"
        :subtitle="t('stamps', { count: paginationData.total ?? 0 })"
        :head="mainModelHead"
        :data="tableData"
        :current-page="paginationData?.currentPage"
        @itemsPerPage="onChangeLimit"
        :items-per-page="+route.query?.limit || 10"
        :total="paginationData?.total"
        @pageChange="onPageChange"
        @search="onSearch"
        :limit="paginationData?.defaultLimit"
        :loading="loading"
        th-class="!bg-gray !text-gray-100 last:!text-right"
      >
        <template #id="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #name="{ row: data }">
          <CCar
            :car="{
              image: data?.icon,
              name: data?.name,
            }"
          />
        </template>
        <template #mark="{ row: data }">
          <span class="text-xs ml-3">{{ data?.model_count ?? 0 }}</span>
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
            icon="icon-plus"
            class="flex items-center py-2 px-4 gap-2"
            size="md"
            @click="openAddMark"
          />
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_mark_added')"
            :subtitle="$t('no_mark_added_subtitle')"
            class="mt-8 px-6 pb-20 pt-0"
            :button-text="t('add_mark')"
            @submit="openAddMark"
            image="/images/svg/no-data/no-notification.svg"
            button-custom-class="!mt-0"
          />
        </template>
        <template #action="{ row: data }">
          <CActionsDropdown
            class="mr-4"
            :list="exchangeActions"
            :selected-item="data"
            @delete="handleDeleteMark(data)"
            @edit="openEditModal(data)"
          />
        </template>
      </CTableWrapper>
    </CCard>

    <CDialog
      v-bind="{ show }"
      :title="$t(isEdit ? 'edit_mark_car' : 'add_mark_car')"
      @close="show = false"
      body-class="!max-w-[421px]"
    >
      <div class="p-5 pt-4">
        <FGroup :label="$t('logo')">
          <ImageUploader
            @change="form.values.image = $event"
            size="10 MB"
            :default-image="form.values.image"
          />
        </FGroup>
        <FGroup class="mt-5" :label="$t('mark_car')">
          <FInput
            :placeholder="$t('choose_mark_car')"
            v-model="form.values.mark"
            :error="form.$v.value.mark?.$error || isError"
            @input="isError = false"
          />
        </FGroup>
      </div>
      <template #footer>
        <div class="p-5 pt-0 flex items-center justify-end">
          <div class="flex items-center gap-4">
            <CButton
              variant="info"
              :text="$t('cancel')"
              type="button"
              @click="show = false"
            />
            <CButton
              variant="primary"
              :disabled="form.$v.value.$invalid"
              :loading="isLoading"
              :text="$t(isEdit ? 'save' : 'add')"
              @click="submit"
            />
          </div>
        </div>
      </template>
    </CDialog>
    <CDeleteDialog
      :subtitle="$t('delete_content')"
      :title="$t('delete_mark')"
      :loading="deleteLoading"
      :show="showDeleteMark"
      @close="showDeleteMark = false"
      @submit="deleteMark"
    />
  </section>
</template>
<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CCard from "@/components/Card/CCard.vue";
import CCar from "@/components/Card/CCar.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import { exchangeActions, mainModelHead } from "@/modules/Notification/data";
import { useTableFetch } from "@/composables/useTableFetch";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CNodata from "@/components/Common/NoData/NoData.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FGroup from "@/components/Form/FGroup.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import { IMark } from "@/modules/Settings/types";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";

const { mounted } = useMounted();
const { t } = useI18n();
const route = useRoute();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const routes = computed(() => [
  {
    name: t("settings"),
    route: "/settings",
  },
  {
    name: t("mark"),
    route: "/settings/mark",
  },
]);

const show = ref(false);
const isEdit = ref(false);
const isError = ref(false);
const isLoading = ref(false);
const deleteLoading = ref(false);
const showDeleteMark = ref(false);
const markID = ref("");
let editedItem: IMark;

const openEditModal = (data: any) => {
  editedItem = data;
  isEdit.value = true;
  show.value = true;
  form.values.mark = data?.name;
  form.values.image = data?.icon;
};

const openAddMark = () => {
  form.values.mark = "";
  form.values.image = "";
  show.value = true;
  isEdit.value = false;
};

const form = useForm(
  {
    mark: "",
    image: "",
  },
  {
    mark: { required },
    image: { required },
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
} = useTableFetch("/manufacturers/");

watch(
  () => show.value,
  () => {
    if (!show.value) {
      form.values.mark = "";
      form.values.image = "";
      form.$v.value.$reset();
    }
  }
);
function submit() {
  isEdit.value ? editMark() : addMark();
}

function addMark() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) return;
  isLoading.value = true;
  ApiService.post("manufacturers/", {
    name: form.values.mark,
    icon: form.values.image?.id,
  })
    .then(() => {
      showToast(t("success_messages.successfully_added"), "success");
      show.value = false;
      fetchTableData();
      isError.value = false;
    })
    .catch((err) => {
      handleError(err);
      isError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function editMark() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) return;
  if (
    form.values.mark === editedItem?.name &&
    form.values.image === editedItem?.icon
  ) {
    show.value = false;
    return;
  }

  isLoading.value = true;
  ApiService.put(`manufacturer/${editedItem?.id}/`, {
    name: form.values.mark,
    icon: form.values.image?.id,
  })
    .then(() => {
      showToast(t("success_messages.successfully_edited"), "success");
      show.value = false;
      fetchTableData();
      isError.value = false;
    })
    .catch((err) => {
      handleError(err);
      isError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function handleDeleteMark(data: any) {
  showDeleteMark.value = true;
  markID.value = data?.id;
}
function deleteMark() {
  deleteLoading.value = true;
  ApiService.delete(`/manufacturer/${markID.value}/`)
    .then(() => {
      showToast(t("success_messages.successfully_deleted"), "success");
      fetchTableData();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      deleteLoading.value = false;
      showDeleteMark.value = false;
    });
}
</script>

<style scoped></style>
