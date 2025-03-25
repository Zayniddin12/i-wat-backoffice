<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="p-6 bg-white rounded-xl">
    <h3 class="text-xl font-bold text-dark border-b border-gray-400 pb-5">
      {{ $t("title_add_notification") }}
    </h3>
    <div class="w-full pt-6 bg-white rounded-xl space-y-4">
      <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
      <Transition name="fade" mode="out-in">
        <div :key="nameValue" class="mt-6 gap-6 flex flex-col">
          <FGroup :label="$t('notification_name')">
            <FInput
              :placeholder="$t('enter_name')"
              :maxlength="256"
              v-model="form.values[`title_${nameValue}`]"
              :error="form.$v.value[`title_${nameValue}`]?.$error"
            />
          </FGroup>
          <FGroup :label="$t('notification_heading')">
            <FInput
              :placeholder="$t('enter_title')"
              :maxlength="512"
              v-model="form.values[`message_${nameValue}`]"
              :error="form.$v.value[`message_${nameValue}`]?.$error"
            />
          </FGroup>
          <div class="flex items-stretch gap-6 max-lg:flex-col">
            <FGroup :label="$t('text')" class="basis-9/12">
              <CQuilEditor
                v-if="nameValue === 'ru'"
                :content="form.values.text_ru"
                @get-content="(val) => (form.values.text_ru = val)"
                :error="form.$v.value.text_ru.$error"
                class="w-full"
              />
              <CQuilEditor
                v-if="nameValue === 'uz'"
                :content="form.values.text_uz"
                @get-content="(val) => (form.values.text_uz = val)"
                :error="form.$v.value.text_uz.$error"
                class="w-full"
              />
              <CQuilEditor
                v-if="nameValue === 'en'"
                :content="form.values.text_en"
                @get-content="(val) => (form.values.text_en = val)"
                :error="form.$v.value.text_en.$error"
                class="w-full"
              />
            </FGroup>
            <FGroup :label="$t('add_photo')" class="basis-3/12">
              <MultipleFileUploader v-model="form.values.photo" />
            </FGroup>
          </div>
          <FGroup :label="$t('release_time')">
            <label
              class="relative my-4 inline-flex items-center cursor-pointer max-w-[166px]"
            >
              <input
                type="checkbox"
                v-model="isDisabled"
                class="sr-only peer"
              />
              <span
                class="w-11 block h-6 bg-gray-300 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"
              />
              <span class="ms-3 text-sm font-medium text-dark">{{
                $t("schedule")
              }}</span>
            </label>
            <div class="flex items-center gap-5">
              <FDatePicker
                class="min-w-[240px]"
                v-model="form.values.datePicker"
                :disabled="!isDisabled"
              />
              <FTimePicker
                :key="nameValue"
                v-model="form.values.dateTimePicker"
                class="time-list"
                :disabled="!isDisabled"
                @startTime="form.values.dateTimePicker = $event"
                placeholder="24:00"
                is-custom="time-list-select"
              />
            </div>
          </FGroup>
        </div>
      </Transition>
      <div
        v-if="!route?.params?.categoryId"
        class="space-x-4 flex items-center justify-end"
      >
        <CButton
          variant="info"
          :text="$t('cancel')"
          @click="router.push({ name: 'PNotification' })"
        />
        <CButton
          variant="primary"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          :text="$t('publish')"
          @click="createCategory"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMounted } from "@/composables/useMounted";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "@/composables/useForm";
import { maxLength, required } from "@vuelidate/validators";
import CButton from "@/components/Common/CButton.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CTabLang from "@/components/Tab/CTabLang.vue";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import CQuilEditor from "@/components/CQuilEditor.vue";
import FRadio from "@/components/Form/Radio/FRadio.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import FTimePicker from "@/components/Form/Date/FTimePicker.vue";
import { tabListLanguage } from "@/modules/Notification/data";
import { convertToISOString } from "@/utils/changeNumberFormat";
import { INotification } from "@/modules/Notification/types";
import { useHandleError } from "@/composables/useHandleError";
const { showToast } = useCustomToast();

const { t } = useI18n();
const { mounted } = useMounted();
const { handleError } = useHandleError();
const router = useRouter();
const route = useRoute();
const routes = computed(() => [
  {
    name: t("notification"),
    route: "/notification",
  },
  {
    name: t("add"),
    route: "/notification/add",
  },
]);

const isDisabled = ref(false);

const buttonLoading = ref(false);
const nameValue = ref<string>("uz");

const form = useForm(
  {
    message_uz: "",
    message_ru: "",
    message_en: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    text_en: "",
    text_ru: "",
    text_uz: "",
    datePicker: "",
    dateTimePicker: "",
    photo: "",
  },
  {
    message_uz: {
      required,
    },
    message_ru: {
      required,
    },
    message_en: {
      required,
    },
    title_uz: {
      required,
      maxLength: maxLength(256),
    },
    title_ru: {
      required,
      maxLength: maxLength(256),
    },
    title_en: {
      required,
      maxLength: maxLength(256),
    },
    text_en: {
      required,
    },
    text_ru: {
      required,
    },
    text_uz: {
      required,
    },
  }
);

function createCategory() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) {
    showToast(t("fill_all_fields"), "error");
    console.log(form.$v.value.message_uz);
    if (
      nameValue.value === "uz" &&
      !form.$v.value.title_uz.$invalid &&
      !form.$v.value.message_uz.$invalid &&
      !form.$v.value.text_uz.$invalid
    ) {
      if (
        form.$v.value.title_en.$invalid ||
        form.$v.value.message_en.$invalid ||
        form.$v.value.text_en.$invalid
      ) {
        nameValue.value = "en";
      } else if (
        form.$v.value.title_ru.$invalid ||
        form.$v.value.message_ru.$invalid ||
        form.$v.value.text_ru.$invalid
      ) {
        nameValue.value = "ru";
      } else {
        createCategotyData();
      }
    } else if (
      nameValue.value === "en" &&
      !form.$v.value.title_en.$invalid &&
      !form.$v.value.message_en.$invalid &&
      !form.$v.value.text_en.$invalid
    ) {
      if (
        form.$v.value.title_ru.$invalid ||
        form.$v.value.message_ru.$invalid ||
        form.$v.value.text_ru.$invalid
      ) {
        nameValue.value = "ru";
      } else if (
        form.$v.value.title_uz.$invalid ||
        form.$v.value.message_uz.$invalid ||
        form.$v.value.text_uz.$invalid
      ) {
        nameValue.value = "uz";
      } else {
        createCategotyData();
      }
    } else if (
      nameValue.value === "ru" &&
      !form.$v.value.title_ru.$invalid &&
      !form.$v.value.message_ru.$invalid &&
      !form.$v.value.text_ru.$invalid
    ) {
      if (
        form.$v.value.title_uz.$invalid ||
        form.$v.value.message_uz.$invalid ||
        form.$v.value.text_uz.$invalid
      ) {
        nameValue.value = "uz";
      } else if (
        form.$v.value.title_en.$invalid ||
        form.$v.value.message_en.$invalid ||
        form.$v.value.text_en.$invalid
      ) {
        nameValue.value = "en";
      } else {
        createCategotyData();
      }
    }
  } else {
    createCategotyData();
  }
}

function createCategotyData() {
  console.log("salomlarnot");
  let data: INotification = form.values;
  data.scheduled_time = convertToISOString(
    data.datePicker,
    data.dateTimePicker
  );
  if (data.scheduled_time) data.is_scheduled = true;

  buttonLoading.value = true;
  ApiService.post("notifications/NotificationCreate/", data)
    .then(() => {
      buttonLoading.value = false;
      showToast(t("success_messages.successfully_added"), "success");
      router.push({ name: "PNotification" });
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (buttonLoading.value = false));
}
</script>

<style lang="scss">
.time-list-select li {
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-list-select::-webkit-scrollbar {
  width: 0;
  display: none;
}

.time-list-select::-webkit-scrollbar-thumb {
  width: 0;
  background-color: transparent;
}
</style>
