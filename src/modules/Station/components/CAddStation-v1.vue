<template>
  <div class="px-5">
    <div class="flex divide-x divide-gray space-x-5">
      <div class="bg-white rounded-xl py-5 basis-[25%]">
        <SFormSteps v-bind="{ step, steps }" />
      </div>

      <Transition class="basis-[75%]" mode="out-in" name="fade">
        <div :key="step" class="py-5">
          <SStepInfo
            v-if="step === 1"
            :form="form"
            :is-edit="isEdit"
            @next="step = 2"
            @close="emits('close')"
          />
          <SStepAddress
            v-if="step === 2"
            :form="addressForm"
            :is-edit="isEdit"
            @back="back()"
            @submit="isEdit ? edit() : save()"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useCustomToast } from "@/composables/useCustomToast";
import { useForm } from "@/composables/useForm";
import SFormSteps from "@/modules/Station/components/SFormSteps.vue";
import SStepAddress from "@/modules/Station/components/SStepAddress.vue";
import SStepInfo from "@/modules/Station/components/SStepInfo.vue";
import { IStation } from "@/modules/Station/types/interface";
import ApiService from "@/services/ApiService";
import { handleError } from "@/utils";
import { maxLength, required } from "@vuelidate/validators";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

interface IProps {
  data?: IStation;
  isEdit?: boolean;
}

const props = defineProps<IProps>();
const emits = defineEmits<{
  (e: "close"): void;
  (e: "edited"): void;
}>();

const { t } = useI18n();
const { showToast } = useCustomToast();
const router = useRouter();
const route = useRoute();

const form = useForm(
  {
    name_uz: "",
    name_en: "",
    name_ru: "",
    price_parking: null,
  },
  {
    name_uz: { required, maxlength: maxLength(50) },
    name_en: { required, maxlength: maxLength(50) },
    name_ru: { required, maxlength: maxLength(50) },
    price_parking: { required },
  }
);

const addressForm = useForm(
  {
    region: "",
    district: "",
    address_uz: "",
    address_en: "",
    address_ru: "",
    landmark_uz: "",
    landmark_en: "",
    landmark_ru: "",
    longitude: null,
    latitude: null,
  },
  {
    region: { required },
    district: { required },
    address_uz: { required },
    address_en: { required },
    address_ru: { required },
    landmark_uz: { required },
    landmark_en: { required },
    landmark_ru: { required },
  }
);

const step = ref(1);
const steps = [
  {
    id: 1,
    title: t("general_information"),
    subtitle: t("about_general_information"),
  },
  {
    id: 2,
    title: t("address"),
    subtitle: t("station_address"),
  },
];

function back() {
  step.value = 1;
}

const save = () => {
  ApiService.post("/address/", {
    name_ru: form.values.name_ru,
    name_en: form.values.name_en,
    name_uz: form.values.name_uz,
    price_parking: form.values?.price_parking?.replace(/\s+/g, ""),
    ...addressForm.values,
  })
    .then(() => {
      //reset form
      form.values = {
        name_uz: "",
        name_en: "",
        name_ru: "",
        price_parking: null,
      };
      addressForm.values = {
        region: "",
        district: "",
        address_uz: "",
        address_en: "",
        address_ru: "",
        land_mark_uz: "",
        land_mark_en: "",
        land_mark_ru: "",
        longitude: null,
        latitude: null,
      };

      showToast(t("success_messages.successfully_added_station"), "success");
      emits("close");
    })
    .catch((e) => {
      handleError(e);
    });
};

//edit station
watch(
  () => props.isEdit,
  (val) => {
    if (val) {
      form.values.name_en = props.data?.name_en;
      form.values.name_uz = props.data?.name_uz;
      form.values.name_ru = props.data?.name_ru;
      form.values.price_parking = props.data.price_parking ?? 0;

      addressForm.values.region = props.data?.region;
      addressForm.values.district = props.data?.district;
      addressForm.values.address_uz = props.data?.address_uz;
      addressForm.values.address_en = props.data?.address_en;
      addressForm.values.address_ru = props.data?.address_ru;
      addressForm.values.landmark_uz = props.data?.landmark_uz;
      addressForm.values.landmark_en = props.data?.landmark_en;
      addressForm.values.landmark_ru = props.data?.landmark_ru;
      addressForm.values.longitude = props.data?.longitude;
      addressForm.values.latitude = props.data?.latitude;
    }
  },
  { deep: true, immediate: true }
);
const edit = () => {
  ApiService.put(`/address/${route.params?.id}/`, {
    name_ru: form.values.name_ru,
    name_en: form.values.name_en,
    name_uz: form.values.name_uz,
    price_parking: form.values?.price_parking?.replace(/\s+/g, ""),
    ...addressForm.values,
  })
    .then(() => {
      showToast(t("success_messages.successfully_edited_station"), "success");
      emits("edited");
    })
    .catch((e) => {
      handleError(e);
    });
};
</script>
<style></style>
