<script setup lang="ts">
import { ref } from "vue";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { userTableCarHeadData } from "@/modules/Users/data";
import { useI18n } from "vue-i18n";
import CCar from "@/components/Card/CCar.vue";
import CCarNumber from "@/components/Card/CCarNumber.vue";
import CButton from "@/components/Common/CButton.vue";
import MAddCar from "@/modules/Users/components/Modals/MAddCar.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import EditCar from "@/modules/Users/components/Modals/EditCar.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";
import { convertPhoneNumberToString } from "@/utils/changeNumberFormat";
import CTableDate from "@/components/Common/CTableDate.vue";
import TypeConnector from "@/modules/Users/components/Cards/TypeConnector.vue";

const { t } = useI18n();
const route = useRoute();
const { handleError } = useHandleError();
const { showToast } = useCustomToast();
const singleData = ref<any>({});
const addCarModal = ref<boolean>(false);
const isOpenEditModal = ref<boolean>(false);
const isLoading = ref(false);
const form = useForm(
  {
    user: Number(route.params.id),
    vin: "",
    manufacturer: "",
    model: "",
    charging_type: null,
    state_number: "",
  },
  {
    vin: { required },
    manufacturer: { required },
    model: { required },
    charging_type: { required },
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
} = useTableFetch(`/cars/?user=${route.params?.id}`);

const openEditModal = (data: any) => {
  singleData.value = data;
  isOpenEditModal.value = true;
};

function addCar() {
  isLoading.value = true;
  ApiService.post(`/cars/`, form.values)
    .then(() => {
      fetchTableData();
      showToast(t("success_messages.successfully_added"), "success");
      addCarModal.value = false;
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function editCar(data: any) {
  isLoading.value = true;
  ApiService.put(`/car/${singleData.value?.id}/`, data)
    .then(() => {
      isLoading.value = false;
      fetchTableData();
      showToast(t("success_messages.successfully_edited"), "success");
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      isOpenEditModal.value = false;
    });
}
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
      :head="userTableCarHeadData()"
      :title="$t('list_of_cars')"
      :subtitle="t('number_of_cars', { n: paginationData.total ?? 0 })"
      no-search
      head-classes="!gap-0"
      th-class="last:!text-right"
    >
      <!--      head    -->
      <template #beforeSearch>
        <CButton
          :text="t('add')"
          icon="icon-plus text-xs pl-1"
          icon-position="right"
          class="w-full"
          variant="primary"
          @click="addCarModal = true"
        />

        <MAddCar
          v-bind="{
            form,
            show: addCarModal,
            loading: isLoading,
          }"
          @close="addCarModal = false"
          @submit="addCar"
        />
      </template>
      <template #no-data>
        <NoData
          :title="$t('no_data_cars_title')"
          :subtitle="$t('no_data_cars_subtitle')"
          image="/images/svg/no-data/default_no_data.svg"
        >
          <template #actions>
            <CButton
              :text="$t('add_machine')"
              icon="icon-plus text-xs pl-1"
              icon-position="left"
              class="w-full"
              variant="info"
              @click="addCarModal = true"
            />
          </template>
        </NoData>
      </template>
      <!--      body   -->
      <template #index="{ row }">
        <span class="font-medium text-xs"> {{ row?._index }}. </span>
      </template>
      <template #model="{ row: data }">
        <CCar
          :car="{
            model: data?.model?.manufacturer_name,
            image: data?.model?.manufacturer_icon,
            name: data?.model?.name,
            user_defined: data?.mode?.user_defined,
          }"
        />
      </template>
      <template #number="{ row: data }">
        <CCarNumber
          :type="data?.state_number_type ?? 'TYPE_II'"
          :value="convertPhoneNumberToString(data?.state_number)"
        />
      </template>
      <template #vin="{ row: data }">
        <span>{{ data?.vin || "-" }}</span>
      </template>
      <template #connector="{ row: data }">
        <TypeConnector :charging_type="data?.charging_type" />
      </template>
      <template #added_date="{ row: data }">
        <CTableDate :date="data?.created_at" />
      </template>
      <template #action="{ row: data }">
        <div
          @click="openEditModal(data)"
          class="flex justify-end text-gray-200 text-xl mr-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="cursor-pointer transition-300 group"
          >
            <path
              d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z"
              stroke="#667779"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="group-hover:stroke-primary"
            />
          </svg>
        </div>
      </template>
    </CTableWrapper>

    <EditCar
      @close="isOpenEditModal = false"
      v-bind="{
        data: singleData,
        show: isOpenEditModal,
      }"
      @submit="editCar"
    />
  </CCard>
</template>

<style scoped>
span {
  @apply text-dark font-normal text-xs;
}
</style>
