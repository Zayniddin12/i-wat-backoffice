<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { actionListConnector, connectorsHead } from "@/modules/Station/data";
import ApiService from "@/services/ApiService";
import apiService from "@/services/ApiService";
import CChargerCard from "@/modules/Settings/components/CChargerCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CButton from "@/components/Common/CButton.vue";
import CStatus from "@/components/Card/CStatus.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import CDropdown from "@/components/Common/Dropdown/CDropdown.vue";
import CAddConnector from "@/modules/Station/components/CAddConnector.vue";
import CDeactivate from "@/modules/Station/components/CDeactivate.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { IColumn } from "@/modules/Station/types/interface";
import CCard from "@/components/Card/CCard.vue";
import UserList from "@/modules/Station/components/UserList.vue";
import { useHandleError } from "@/composables/useHandleError";
import { changeNumberFormat } from "@/utils/changeNumberFormat";
import CTableDate from "@/components/Common/CTableDate.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { moneyMask } from "@/utils";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { IUser } from "@/modules/Auth/types";
import { types } from "sass";
import Number = types.Number;

interface IProps {
  column: {
    id: number;
    name: string;
  };
  isFetching?: boolean;
}

const props = defineProps<IProps>();

defineEmits(["edit-column"]);
const { t } = useI18n();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const loading = ref(false);
const connectorModal = ref(false);
const isEditConnector = ref(false);
const actionModal = ref(false);
const deactivateData = ref({});
const columnSingle = ref<IColumn>([]);
const actionData = ref({});
const route = useRoute();
const openHours = ref(false); // Added ref for openHours
const connectorForm = useForm(
  {
    name: "",
    power: "",
    power_size: "",
    price: "",
    start_time: "00:00:00",
    end_time: "00:00:00",
  },
  {
    name: { required },
    power: { required },
    power_size: { required },
    price: { required },
    start_time: {
      required,
    },
    end_time: {
      required,
    },
  }
);

const openModalEdit = () => {
  openHours.value = true; // Set openHours to true to open the modal
};

const closeModalEdit = () => {
  openHours.value = false;
};

function addConnector() {
  const formData = {
    type_connection: connectorForm.values.name,
    price: connectorForm.values.price,
    power_unit: connectorForm.values.power_size,
    power: connectorForm.values.power,
    charge_point: props.column.id,
  };
  try {
    apiService.post("/connectors/", formData).then(() => {
      showToast(t("successfully_added"), "success");
      getConnectors();
      connectorModal.value = false;
    });
  } catch (err) {
    handleError(err);
  }
}

function deactivateConnector() {
  //   bind api
  ApiService.post(`stop-ongoing-charge-transactions/`, {
    transaction: deactivateData.value?.id,
  })
    .then(() => {
      showToast(t("successfully_ended"), "success");
      getConnectors();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (actionModal.value = false));
}

function getAction(action: string, data: object) {
  loading.value = true;
  ApiService.patch(`/connectors/${data?.id}/`, {
    available: !data?.available,
  })
    .then(() => {
      getConnectors();
      if (data?.available) {
        showToast(t("successfully_activated"), "success");
      } else {
        showToast(t("successfully_deactivated"), "success");
      }
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (loading.value = false));
}

function openActionModal(data: any) {
  actionModal.value = true;
  deactivateData.value = data?.stop_data;
}

const getConnectors = () => {
  ApiService.get<IColumn>(`/address/column/${props.column.id}`).then((res) => {
    columnSingle.value = res.data;
  });
};

onMounted(() => getConnectors());

watch(
  () => props.isFetching,
  (val) => {
    if (!val) return;
    getConnectors();
  }
);

watch(
  () => connectorModal.value,
  () => {
    if (!connectorModal.value) {
      for (let key in connectorForm.values) {
        connectorForm.values[key] = "";
      }
      connectorForm.$v.value.$reset();
    }
  }
);
const form = useForm(
  {
    start_time: "00:00:00",
    end_time: "00:00:00",
    nightWithoutDiscount: "",
    nightWithDiscount: "",
    dayWithoutDiscount: "",
    price: "",
  },
  {
    nightWithoutDiscount: { required },
    nightWithDiscount: { required },
    dayWithoutDiscount: { required },
    price: { required },
  }
);

function editStation(data: IUser, id) {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) {
    showToast(t("fill_all_fields"), "error");
    return;
  } else {
    ApiService.put(`/connectors/${id}/`, {
      ...data,
      pricess: [
        {
          price: form.values.nightWithDiscount,
          start_time: form.values.start_time,
          end_time: form.values.end_time,
        },
      ],
      night_price: parseInt(form.values.nightWithoutDiscount),
      price: parseInt(form.values.price),
      daytime_price: parseInt(form.values.dayWithoutDiscount),
    })
      .then(() => {
        console.log(data);
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        closeModalEdit();
        form.values.nightWithoutDiscount = "";
        form.values.dayWithoutDiscount = "";
        form.values.price = "";
        form.values.end_time = "00:00:00";
        form.values.start_time = "00:00:00";
        form.$v.value.$reset();
      });
  }
}

const times = ref([
  {
    value: "00:00:00",
  },
  {
    value: "00:30:00",
  },
  {
    value: "01:00:00",
  },
  {
    value: "01:30:00",
  },
  {
    value: "02:00:00",
  },
  {
    value: "02:30:00",
  },
  {
    value: "03:00:00",
  },
  {
    value: "03:30:00",
  },
  {
    value: "03:30:00",
  },
  {
    value: "04:00:00",
  },
  {
    value: "04:30:00",
  },
  {
    value: "05:00:00",
  },
  { value: "05:30:00" },
  { value: "06:00:00" },
  { value: "06:30:00" },
  { value: "07:00:00" },
  { value: "07:30:00" },
  { value: "08:00:00" },
  { value: "08:30:00" },
  { value: "09:00:00" },
  { value: "09:30:00" },
  { value: "10:00:00" },
  { value: "10:30:00" },
  { value: "11:00:00" },
  { value: "11:30:00" },
  { value: "12:00:00" },
  { value: "12:30:00" },
  { value: "13:00:00" },
  { value: "13:30:00" },
  { value: "14:00:00" },
  { value: "14:30:00" },
  { value: "15:00:00" },
  { value: "15:30:00" },
  { value: "16:00:00" },
  { value: "16:30:00" },
  { value: "17:00:00" },
  { value: "17:30:00" },
  { value: "18:00:00" },
  { value: "18:30:00" },
  { value: "19:00:00" },
  { value: "19:30:00" },
  { value: "20:00:00" },
  { value: "20:30:00" },
  { value: "21:00:00" },
  { value: "21:30:00" },
  { value: "22:00:00" },
  { value: "22:30:00" },
  { value: "23:00:00" },
  { value: "23:30:00" },
]);
</script>

<template>
  <section>
    <CCard class="pb-5">
      <CTableWrapper
        :current-page="1 ?? 0"
        :data="columnSingle.connectors ?? []"
        :key="columnSingle.connectors"
        :head="connectorsHead"
        :items-per-page="10 ?? 0"
        :limit="10 ?? 0"
        no-search
        th-class="last:text-end"
        td-class="last:text-end"
      >
        <template #header_title>
          <div
            class="w-[-webkit-fill-available] flex items-center space-x-3 divide-gray-300 divide-x"
          >
            <div>
              <h2
                class="mb-1 max-w-[200px] text-xl leading-[22px] font-bold text-dark truncate"
              >
                {{ columnSingle?.name ?? t("column", { id: column?.id }) }}
              </h2>
              <p class="text-xs leading-normal font-normal text-gray-100">
                {{
                  t("connectors", {
                    count: columnSingle?.connectors?.length ?? 0,
                  })
                }}
              </p>
            </div>
            <UserList :users="columnSingle?.owners" />
          </div>
        </template>

        <template #afterSearch>
          <div class="flex gap-4 items-center">
            <CButton
              :text="$t('edit')"
              class="flex items-center py-2 px-4 gap-2"
              icon="icon-edit
                    !text-gray-300 pr-2"
              icon-position="left"
              size="md"
              variant="info"
              @click="$emit('edit-column')"
            />
            <CButton
              :text="$t('add_connector')"
              class="flex items-center py-2 px-4 gap-2"
              icon="icon-plus pl-2"
              icon-position="left"
              size="md"
              @click="connectorModal = true"
            />
          </div>
        </template>

        <template #no-data>
          <NoData
            :subtitle="$t('no_connectors_subtitle')"
            :title="$t('no_connectors_title')"
            class="mt-8 px-6 pb-[100px] pt-0"
            :button-text="$t('add_connector')"
            image="/images/svg/no-data/no-notification.svg"
            @submit="connectorModal = true"
          />
        </template>

        <!--        body-->
        <template #_index="{ row }">
          <span class="font-semibold text-sm">{{ row?._index }}.</span>
        </template>
        <template #type="{ row: data }">
          <CChargerCard
            :card="{
              status: data?.status,
              title: data?.charging_type_name,
              marc_icon: data?.charging_type_icon,
            }"
          />
        </template>
        <template #status_app="{ row: data }">
          <CStatus
            :status="data?.status ?? 'Charging'"
            :text="t(String(data?.status ?? 'charging').toLowerCase())"
          />
        </template>
        <template #price="{ row: data }">
          <span class="text-xs"
            >{{ changeNumberFormat(data?.price ?? 0) }} UZS</span
          >
        </template>
        <template #with_discount="{ row: data }">
          <span class="text-xs"
            >{{ changeNumberFormat(data?.with_discount ?? 0) }} UZS</span
          >
        </template>
        <template #power="{ row: data }">
          <span class="text-xs"
            >{{ changeNumberFormat(data?.power ?? 0) }} kWt</span
          >
        </template>
        <template #date="{ row: data }">
          <CTableDate :date="data?.created_at" />
        </template>
        <template #status="{ row: data }">
          <span
            :class="{
              'text-red': !data?.available,
            }"
            class="text-xs"
            >{{ data?.available ? $t("active") : $t("inactive") }}</span
          >
        </template>

        <template #action="{ row: data }">
          <CDropdown v-if="!data?.stop_data" class="w-7 ml-auto">
            <template #head>
              <transition mode="out-in" name="fade">
                <div
                  v-if="loading && actionData?.id === data?.id"
                  class="spinner-circle"
                />
                <div
                  v-else
                  class="h-6 w-6 mx-auto nr-5 flex items-center justify-center gap-2.5 rounded-md bg-transparent group hover:bg-gray focus:bg-gray cursor-pointer transition-300"
                  @click="actionData = data"
                >
                  <i
                    class="icon-icon-3dot text-2xl text-gray-200 group-hover:text-dark duration-300"
                  />
                </div>
              </transition>
            </template>

            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <template v-for="(item, idx) in actionListConnector" :key="idx">
                  <div
                    v-if="item?.active === !data?.available"
                    class="min-w-[158px] h-11 cursor-pointer flex items-center p-3 gap-2 hover:bg-gray/40 transition-300 group"
                    @click="getAction(item.value, data)"
                  >
                    <i
                      :class="item.class"
                      class="text-gray icon-icon-clock text-xl transition-300"
                    />
                    <span
                      class="text-sm font-medium text-dark-100 leading-normal"
                      >{{ $t(item.value) }}
                    </span>
                  </div>
                </template>
                <div
                  @click="openModalEdit"
                  class="min-w-[158px] h-11 cursor-pointer flex items-center p-3 gap-2 hover:bg-gray/40 transition-300 group"
                >
                  <i class="icon-edit text-gray-200 text-xl transition-300" />
                  <span class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("edit") }}
                  </span>
                </div>
              </div>
            </template>
          </CDropdown>
          <div
            v-else
            class="bg-red/[9%] cursor-pointer duration-200 hover:bg-red/[11%] w-max ml-auto rounded-md px-2.5 py-1.5 flex gap-2 items-center"
            @click="openActionModal(data)"
          >
            <img alt="flag icon" src="/images/flag.png" />
            <span class="text-red font-semibold text-sm">{{
              t("end_charging")
            }}</span>
          </div>
          <CDialog
            v-bind="{ show: openHours }"
            :title="$t('edit_price')"
            @close="closeModalEdit"
            body-class="!max-w-[540px]"
          >
            <div class="p-5 pt-4">
              <div>
                <div>
                  <p
                    class="font-medium text-base leading-130 text-gray-100 pb-4"
                  >
                    {{ $t("during_the_day") }}
                  </p>
                  <div class="flex-y-center space-x-5">
                    <FGroup :label="$t('without_discount')">
                      <FInput
                        v-model="form.values.dayWithoutDiscount"
                        :error="form.$v.value.dayWithoutDiscount?.$error"
                        v-maska="moneyMask()"
                        placeholder="0"
                      >
                        <template #suffix>
                          <span class="text-sm font-normal text-gray-200"
                            >UZS</span
                          >
                        </template>
                      </FInput>
                    </FGroup>

                    <FGroup :label="$t('with_discount')">
                      <FInput
                        v-model="form.values.price"
                        :error="form.$v.value.price?.$error"
                        v-maska="moneyMask()"
                        placeholder="0"
                      >
                        <template #suffix>
                          <span class="text-sm font-normal text-gray-200"
                            >UZS</span
                          >
                        </template>
                      </FInput>
                    </FGroup>
                  </div>
                </div>

                <div class="mt-6">
                  <p
                    class="font-medium text-base leading-130 text-gray-100 pb-4"
                  >
                    {{ $t("night") }}
                  </p>
                  <FGroup>
                    <div class="flex-y-center space-x-5">
                      <FGroup :label="$t('without_discount')">
                        <FInput
                          v-model="form.values.nightWithoutDiscount"
                          :error="form.$v.value.nightWithoutDiscount?.$error"
                          v-maska="moneyMask()"
                          placeholder="0"
                        >
                          <template #suffix>
                            <span class="text-sm font-normal text-gray-200"
                              >UZS</span
                            >
                          </template>
                        </FInput>
                      </FGroup>
                      <FGroup :label="$t('with_discount')">
                        <FInput
                          v-model="form.values.nightWithDiscount"
                          :error="form.$v.value.nightWithDiscount?.$error"
                          v-maska="moneyMask()"
                          placeholder="0"
                        >
                          <template #suffix>
                            <span class="text-sm font-normal text-gray-200"
                              >UZS</span
                            >
                          </template>
                        </FInput>
                      </FGroup>
                    </div>
                  </FGroup>
                </div>

                <div class="mt-4">
                  <div class="flex-y-center space-x-5">
                    <FGroup :label="$t('with')">
                      <FSelect
                        class="w-full"
                        v-model="form.values.start_time"
                        :options="times"
                        :placeholder="$t('add_car_form.start_time')"
                        filter-key="value"
                        from-top
                        label-key="value"
                        selected-option-styles="!bg-gray"
                        value-key="value"
                      />
                    </FGroup>
                    <FGroup :label="$t('to')">
                      <FSelect
                        class="w-full"
                        v-model="form.values.end_time"
                        :options="times"
                        :placeholder="$t('add_car_form.end_time')"
                        filter-key="value"
                        from-top
                        label-key="value"
                        selected-option-styles="!bg-gray"
                        value-key="value"
                      />
                    </FGroup>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-400 p-5 flex justify-end">
              <CButton
                :text="$t('cancel')"
                variant="info"
                class="mr-2"
                @click="closeModalEdit"
              />
              <CButton
                :text="$t('save')"
                variant="primary"
                @click="editStation(null, data?.id)"
              />
            </div>
          </CDialog>
        </template>
      </CTableWrapper>

      <CDialog
        :title="$t(isEditConnector ? 'edit_connector' : 'add_connector')"
        body-class="!max-w-[421px]"
        v-bind="{ show: connectorModal }"
        @close="connectorModal = false"
      >
        <CAddConnector
          :form="connectorForm"
          @cancel="connectorModal = false"
          @submit="addConnector"
        />
      </CDialog>

      <CDialog
        :title="$t('deactivate_connector')"
        body-class="!max-w-[421px]"
        v-bind="{ show: actionModal }"
        @close="actionModal = false"
      >
        <CDeactivate
          :data="deactivateData"
          @cancel="actionModal = false"
          @submit="deactivateConnector"
        />
      </CDialog>
    </CCard>
  </section>
</template>

<style>
.spinner-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #a3a3a3 94%, #0000) top/3.8px 3.8px
      no-repeat,
    conic-gradient(#0000 30%, #a3a3a3);
  -webkit-mask: radial-gradient(
    farthest-side,
    #0000 calc(100% - 3.8px),
    #000 0
  );
  animation: spinner-c7wet2 1s infinite linear;
}

@keyframes spinner-c7wet2 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
