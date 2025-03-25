<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <section class="p-6 bg-white rounded-xl">
    <CCard>
      <CTableWrapper
        :title="$t('type_chargers')"
        :subtitle="t('type_charge', { count: paginationData?.total ?? 0 })"
        :head="chargerHead"
        :data="tableData"
        :items-per-page="+route.query?.limit || 10"
        :limit="paginationData?.defaultLimit ?? 0"
        :current-page="paginationData?.currentPage ?? 0"
        :total="paginationData?.total"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        :loading="loading"
        @pageChange="onPageChange"
        th-class="!bg-gray !text-gray-100 last:!text-right"
      >
        <template #id="{ row }">
          <span class="text-dark text-xs font-medium">{{ row?._index }}.</span>
        </template>
        <template #name="{ row: data }">
          <CChargerCard
            :card="{
              marc_icon: data?.icon,
              title: data?.name,
            }"
          />
        </template>
        <template #category="{ row: data }">
          <span class="text-xs ml-4">{{ data?.type }}</span>
        </template>
        <template #added_at="{ row: data }">
          <p class="text-xs font-normal mb-1">
            {{ dayjs(data?.created_at)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.created_at)?.format("HH:mm") }}
          </p>
        </template>
        <template #date="{ row: data }">
          <p class="text-xs font-normal">
            {{ dayjs(data?.date)?.format("DD.MM.YYYY") }}
          </p>
          <p class="text-xs font-normal text-gray-300">
            {{ dayjs(data?.date)?.format("HH:mm") }}
          </p>
        </template>
        <template #afterSearch>
          <CButton
            :text="$t('add')"
            icon="icon-plus"
            class="flex items-center py-2 px-4 gap-2"
            size="md"
            @click="openAddModal"
          />
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_charge_title')"
            :subtitle="$t('no_charge_subtitle')"
            :button-text="t('add_charger')"
            button-custom-class="!mt-0"
            class="mt-8 px-6 pb-20 pt-0"
            image="/images/svg/no-data/no-notification.svg"
            @submit="openAddModal"
          />
        </template>
        <template #action="{ row: data }">
          <CActionsDropdown
            class="mr-4"
            :list="exchangeActions"
            :selected-item="data"
            @edit="openEditModal(data)"
            @delete="openDeleteModal(data)"
          />
        </template>
      </CTableWrapper>
    </CCard>

    <CDialog
      v-bind="{ show }"
      :title="$t(isEdit ? 'edit_user_modal.title' : 'history.charging_add')"
      @close="show = false"
      body-class="!max-w-[421px] !overflow-y-visible"
    >
      <div class="p-5 pt-4">
        <FGroup :label="$t('logo')">
          <ImageUploader
            @change="form.values.image = $event"
            size="10 MB"
            :default-image="form.values.image"
            :error="form.$v.value.image?.$error || isError"
          />
        </FGroup>
        <FGroup class="mt-5" :label="$t('charger_name')">
          <FInput
            :placeholder="$t('enter_charger_name')"
            v-model="form.values.name"
            :error="form.$v.value.name?.$error || isError"
            @input="isError = false"
          />
        </FGroup>

        <FGroup class="mt-5" :label="$t('category')">
          <FSelect
            :options="selectOptions"
            v-model="form.values.category"
            :error="form.$v.value.category?.$error || isError"
            @change="isError = false"
            selectedOptionStyles="!bg-gray"
            :placeholder="$t('enter_charger_category')"
            is-checked
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
      :show="deleteModal"
      @close="deleteModal = false"
      :title="singleData?.name"
      :subtitle="$t('delete_charge_type')"
      @submit="deleteCharger(singleData)"
    />
  </section>
</template>
<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CActionsDropdown from "@/components/Common/Dropdown/CActionsDropdown.vue";
import { chargerHead, exchangeActions } from "@/modules/Notification/data";
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
import CChargerCard from "@/modules/Settings/components/CChargerCard.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { IChargingType } from "@/modules/Settings/types";

const { mounted } = useMounted();
const { t } = useI18n();
const singleData = ref({});
const isEdit = ref(false);
const route = useRoute();
const isLoading = ref(false);
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const routes = computed(() => [
  {
    name: t("settings"),
    route: "/settings",
    link: true,
  },
  {
    name: t("type_chargers"),
    route: "/",
  },
]);

const selectOptions = ref([
  {
    id: "AC",
    name: "AC",
  },
  {
    id: "DC",
    name: "DC",
  },
]);

const show = ref(false);
const deleteModal = ref(false);
let selectedItem: IChargingType;
const isError = ref(false);

const form = useForm(
  {
    image: "",
    name: "",
    category: "",
  },
  {
    image: { required },
    name: { required },
    category: { required },
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
} = useTableFetch("/chargingtypes/");

watch(
  () => show.value,
  () => {
    if (!show.value) {
      form.values.name = "";
      form.values.category = "";
      form.values.image = "";
      form.$v.value.$reset();
    }
  }
);

const openEditModal = (data: any) => {
  isEdit.value = true;
  show.value = true;
  selectedItem = data;
  form.values.image = data?.icon;
  form.values.name = data?.name;
  form.values.category = data?.type;
};

const openAddModal = () => {
  form.values.image = "";
  form.values.name = "";
  form.values.category = "";
  show.value = true;
  isEdit.value = false;
};

const openDeleteModal = (data: any) => {
  deleteModal.value = true;
  singleData.value = data;
};

function submit() {
  isEdit.value ? editChargingType() : addChargingType();
}

function addChargingType() {
  isLoading.value = true;
  ApiService.post("chargingtypes/", {
    name: form.values.name,
    type: form.values.category,
    icon: form.values.image?.id,
  })
    .then(() => {
      showToast(t("success_messages.successfully_added"), "success");
      fetchTableData();
      show.value = false;
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

function editChargingType() {
  if (
    form.values.image === selectedItem?.icon &&
    form.values.category === selectedItem?.type &&
    form.values.name === selectedItem?.name
  ) {
    show.value = false;
    return;
  }
  isLoading.value = true;
  ApiService.put(`chargingtype/${selectedItem.id}/`, {
    name: form.values.name,
    type: form.values.category,
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

function deleteCharger(data: any) {
  deleteModal.value = false;
  isLoading.value = true;
  ApiService.delete(`chargingtype/${data?.id}/`)
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
</script>

<style scoped></style>
