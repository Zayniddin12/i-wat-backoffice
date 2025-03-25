<template>
  <div class="p-5">
    <CTabLang
      v-model="nameValue"
      :list="tabListLanguage"
      class="!w-full"
      withIcon
    />
    <Transition mode="out-in" name="fade">
      <div :key="nameValue" class="mt-6 space-y-5">
        <FGroup :label="$t(`column_title`)">
          <FInput
            v-model="form.values[`name_${nameValue}`]"
            :error="form.$v.value[`name_${nameValue}`]?.$error"
            :placeholder="$t('enter_column_title')"
          />
        </FGroup>
        <FGroup :label="$t(`owner`)">
          <FSelectMultiple
            v-model="form.values.owner"
            :error="form.$v.value.owner?.$error"
            :options="options"
            :placeholder="$t('add_car_form.connector_placeholder')"
            filter-key="phone"
            label-key="phone"
            selected-option-styles="!bg-gray"
            value-key="id"
            @on-toggle="onToggleOwner = $event"
          >
            <template #option="{ option: option, selectedList: selectedList }">
              <div class="px-3 py-2.5 flex items-center justify-between">
                <div class="text-dark hover:text-white transition-300">
                  <CProfile
                    :user="{
                      job: option?.job,
                      fullName: option?.fullName,
                      phone: option?.phone,
                      image: option?.image,
                    }"
                    user-type="profile-card"
                  />
                </div>
                <FCheckbox :checked="selectedList?.includes(option?.id)" />
              </div>
            </template>
            <template
              #selectedOption="{ value: selectedValues, remove: removeTag }"
            >
              <i
                :class="{ '!rotate-180': onToggleOwner }"
                class="icon-chevron absolute right-2.5 flex-center h-4 transition-200 text-base text-gray-700 block shrink-0"
              ></i>
              <p v-if="!selectedValues.length" class="text-sm">
                {{ $t("add_car_form.choose_user") }}
              </p>
              <div
                class="flex flex-wrap items-center justify-start gap-3 pr-2.5"
              >
                <div
                  v-for="(so, idx) in selectedValues.slice(0, 2)"
                  :key="idx"
                  :class="{ '!bg-white': !onToggleOwner }"
                  class="flex items-center rounded-[4px] bg-gray px-2 py-1.5 gap-1"
                >
                  <p class="text-xs font-medium">{{ so?.phone }}</p>
                  <div
                    class="w-4 h-4 p-[3px] group hover:bg-red-100 flex items-center justify-center bg-[#66777929] rounded-full"
                    @click="removeTag(so?.id)"
                  >
                    <i
                      class="icon-close text-gray-200 text-[6px] group-hover:text-red transition-300"
                    />
                  </div>
                </div>

                <div
                  v-if="selectedValues.length > 2"
                  :class="{ '!bg-white': !onToggleOwner }"
                  class="flex items-center rounded-[4px] bg-gray px-2 py-1.5 gap-1"
                >
                  <p class="text-xs font-medium">
                    +{{ selectedValues.length - 2 }}
                  </p>
                </div>
              </div>
            </template>
          </FSelectMultiple>
        </FGroup>
        <FGroup :label="$t(`charging_access`)">
          <FSelectMultiple
            v-model="form.values.charging_access"
            :error="form.$v.value.charging_access?.$error"
            :options="options"
            :placeholder="$t('add_car_form.connector_placeholder')"
            :loading="loading"
            filter-key="phone"
            label-key="phone"
            selected-option-styles="!bg-gray"
            value-key="id"
            @on-toggle="onToggleUser = $event"
          >
            <template #option="{ option: option, selectedList: selectedList }">
              <div class="px-3 py-2.5 flex items-center justify-between">
                <div class="text-dark hover:text-white transition-300">
                  <CProfile
                    :user="{
                      job: option?.job,
                      fullName: option?.fullName,
                      phone: option?.phone,
                      image: option?.image,
                    }"
                    user-type="profile-card"
                  />
                </div>
                <FCheckbox :checked="selectedList?.includes(option?.id)" />
              </div>
            </template>

            <template
              #selectedOption="{ value: selectedValues, remove: removeTag }"
            >
              <i
                v-if="!stationStore.loadingUserList"
                :class="{ '!rotate-180': onToggleUser }"
                class="icon-chevron absolute right-2.5 flex-center h-4 transition-200 text-base text-gray-700 block shrink-0"
              ></i>
              <CSelectLoading v-else />
              <p v-if="!selectedValues.length" class="text-sm">
                {{ $t("select_user") }}
              </p>
              <div
                class="flex flex-wrap items-center justify-start gap-3 pr-2.5"
              >
                <div
                  v-for="(so, idx) in selectedValues.slice(0, 2)"
                  :key="idx"
                  :class="{ '!bg-white': !onToggleUser }"
                  class="flex items-center rounded-[4px] bg-gray px-2 py-1.5 gap-1"
                >
                  <p class="text-xs font-medium">{{ so?.phone }}</p>
                  <div
                    class="w-4 h-4 p-[3px] group hover:bg-red-100 flex items-center justify-center bg-[#66777929] rounded-full"
                    @click="removeTag(so?.id)"
                  >
                    <i
                      class="icon-close text-gray-200 text-[6px] group-hover:text-red transition-300"
                    />
                  </div>
                </div>

                <div
                  v-if="selectedValues.length > 2"
                  :class="{ '!bg-white': !onToggleUser }"
                  class="flex items-center rounded-[4px] bg-gray px-2 py-1.5 gap-1"
                >
                  <p class="text-xs font-medium">
                    +{{ selectedValues.length - 2 }}
                  </p>
                </div>
              </div>
            </template>
          </FSelectMultiple>
        </FGroup>
        <FCheckbox
          :checked="form.values?.is_available_for_all_users"
          :label="$t('for_all_users')"
          @change="
            ($event) => (form.values.is_available_for_all_users = $event)
          "
        />
        <div class="flex-y-center space-x-5">
          <FGroup :label="$t('price_booking')">
            <FInput
              v-model="form.values.price"
              :error="form.$v.value.price?.$error"
              v-maska="moneyMask()"
              placeholder="0"
            >
              <template #suffix>
                <span class="text-sm font-normal text-gray-200">UZS</span>
              </template>
            </FInput>
          </FGroup>
          <FGroup :label="$t(`free_minute`)">
            <FInput
              v-model="form.values.time"
              v-maska="`## ${$t('min')}`"
              :error="form.$v.value.time?.$error"
              input-class="!px-1.5"
              placeholder="5 мин"
            >
              <template #suffix>
                <div class="flex-y-center space-x-2">
                  <div
                    class="bg-gray-300/25 w-7 text-gray-300 leading-none text-xl flex-none rounded-md flex-y-center justify-center p-1 cursor-pointer"
                    @click="
                      form.values.time > 0
                        ? form.values.time--
                        : (form.values.time = 0)
                    "
                  >
                    -
                  </div>
                  <div
                    class="bg-primary/25 text-primary w-7 leading-none text-xl flex-none rounded-md flex-y-center justify-center p-1 cursor-pointer"
                    @click="form.values.time++"
                  >
                    +
                  </div>
                </div>
              </template>
            </FInput>
          </FGroup>
        </div>
      </div>
    </Transition>
    <div class="space-x-4 mt-5 flex items-center justify-end">
      <CButton :text="$t('cancel')" variant="info" @click="emit('close')" />
      <CButton
        :disabled="form.$v.value.$invalid || loading"
        :loading="loading"
        :text="isEdit ? $t('save') : $t('add')"
        variant="primary"
        @click="isEdit ? edit() : save()"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { tabListLanguage } from "@/modules/Station/data";
import CTabLang from "@/components/Tab/CTabLang.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FGroup from "@/components/Form/FGroup.vue";
import CButton from "@/components/Common/CButton.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import FSelectMultiple from "@/components/Form/Select/FSelectMultiple.vue";
import CProfile from "@/components/Common/CProfile.vue";
import { moneyMask } from "@/utils";
import { useStationStore } from "@/modules/Station/store";
import ApiService from "@/services/ApiService";
import apiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useRoute } from "vue-router";
import { useHandleError } from "@/composables/useHandleError";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CSelectLoading from "@/components/CSelectLoading.vue"

const emit = defineEmits(["close", "fetch"]);
const props = defineProps<{
  isEdit?: boolean;
  stationId?: number;
  column?: { id: number; name: string };
}>();
const { t } = useI18n();
const stationStore = useStationStore();
const loading = ref(false);
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const route = useRoute();

const nameValue = ref("uz");
const onToggleOwner = ref(false);
const onToggleUser = ref(false);
const options = ref<
  {
    id: number;
    title: string;
    phone: string;
    image: string;
    job: string;
  }[]
>([]);

const form = useForm(
  {
    name_uz: "",
    name_en: "",
    name_ru: "",
    owner: "",
    charging_access: "",
    is_available_for_all_users: false,
    time: null,
    price: null,
    withoutDiscount: null,
    withDiscount: null,
  },
  {
    name_uz: { required },
    name_en: { required },
    name_ru: { required },
    charging_access: {},
    owner: {},
    time: { required },
    price: { required },
  }
);

//fetch user's list
stationStore.fetchUserSelectors();

watch(
  () => stationStore.userSelectors,
  (val) => {
    val.map((item) => {
      options.value.push({
        id: item.id,
        title: item.full_name,
        phone: item.phone,
        image: item.avatar_url,
        job: item.full_name,
      });
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

const save = () => {
  form.$v.value.$touch();

  if (form.$v.value.$invalid) return;

  loading.value = true;
  const formData = {
    name_uz: form.values.name_uz,
    name_en: form.values.name_en,
    name_ru: form.values.name_ru,
    is_available_for_all_users: form.values.is_available_for_all_users,
    users: form.values.owner,
    available_for_users: form.values.charging_access,
    booking_price: Number(form.values.price?.replaceAll(" ", "")),
    free_booking_minute: form.values.time?.slice(0, 1),
    address: route.params?.id,
  };

  ApiService.post("/charge-points/", formData)
    .then((res) => {
      if (res) {
        showToast(t("success_adding_column"), "success");
        emit("fetch");
        emit("close");
      }
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (loading.value = false));
};

watch(
  () => props.isEdit,
  (val) => {
    if (val) {
      apiService.get("/address/column/" + props.column.id).then((res) => {
        form.values.name_uz = res.data.name_uz;
        form.values.name_en = res.data.name_en;
        form.values.name_ru = res.data.name_ru;
        form.values.is_available_for_all_users =
          res.data.is_available_for_all_users;
        form.values.owner = res.data.owners;
        form.values.charging_access = res.data.available_for_users;
        form.values.price = res.data.booking_price;
        form.values.time = res.data.free_booking_minute;
      });
    }
  },
  { immediate: true }
);
const edit = () => {
  form.$v.value.$touch();

  if (form.$v.value.$invalid) return;

  const formData = {
    name_uz: form.values.name_uz,
    name_en: form.values.name_en,
    name_ru: form.values.name_ru,
    is_available_for_all_users: form.values.is_available_for_all_users,
    users: form.values.owner?.map((item: any) =>
      Object.keys(item).length ? item.id : item
    ),
    available_for_users: form.values.charging_access?.map((item: any) =>
      Object.keys(item).length ? item.id : item
    ),
    booking_price: Number(form.values.price?.replaceAll(" ", "")),
    free_booking_minute: form.values.time?.slice(0, 1),
    address: route.params?.id,
  };
  ApiService.put(`/charge-point/${props?.column?.id}/`, formData).then(
    (res) => {
      if (res) {
        showToast(t("success_updated_column"), "success");
        emit("fetch");
        emit("close");
      }
    }
  );
};
</script>
