<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="p-6 bg-white rounded-xl">
    <h3 class="text-xl font-bold text-dark border-b border-gray-400 pb-5">
      {{ $t("title_edit_notification") }}
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
          <FGroup :label="$t('text')">
            <CQuilEditor
              v-if="nameValue === 'ru'"
              :content="form.values.text_ru"
              @get-content="(val) => (form.values.text_ru = val)"
              :error="form.$v.value.text_ru.$error"
            />
            <CQuilEditor
              v-if="nameValue === 'uz'"
              :content="form.values.text_uz"
              @get-content="(val) => (form.values.text_uz = val)"
              :error="form.$v.value.text_uz.$error"
            />
            <CQuilEditor
              v-if="nameValue === 'en'"
              :content="form.values.text_en"
              @get-content="(val) => (form.values.text_en = val)"
              :error="form.$v.value.text_en.$error"
            />
          </FGroup>
          <FGroup v-if="false" :label="$t('platform')">
            <FRadio
              v-model="form.values.platformChecked"
              :label="$t('mobile_app')"
              class="flex-row-reverse bg-transparent !border gap-2 !border-gray rounded-lg max-w-max"
              label-styles="text-sm text-dark"
            />
          </FGroup>
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
                class="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"
              ></span>
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
                v-model="form.values.dateTimePicker"
                class="time-list"
                :disabled="!isDisabled"
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
          @click="editNotification"
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
import {
  convertToISOString,
  separateDateAndTime,
} from "@/utils/changeNumberFormat";
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
    name: t("edit"),
    route: "/notification/edit",
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
    platformChecked: "",
    datePicker: "",
    dateTimePicker: "",
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

function getSingleCategory() {
  let id = route?.params?.id || route?.params?.categoryId;
  if (id) {
    ApiService.get(`/notification/${id}`)
      .then((res) => {
        let title = ["title_", "message_", "text_"];
        let lang = ["uz", "en", "ru"];
        for (let item in title) {
          for (let item2 in lang) {
            form.values[`${title[item]}${lang[item2]}`] =
              res?.data?.[`${title[item]}${lang[item2]}`];
          }
        }
        isDisabled.value = res?.data?.is_scheduled;
        form.values.datePicker = separateDateAndTime(
          res?.data?.scheduled_time
        ).date;
        form.values.dateTimePicker = separateDateAndTime(
          res?.data?.scheduled_time
        ).time;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}

getSingleCategory();

function editNotification() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) {
    showToast(t("fill_all_fields"), "error");
  } else {
    buttonLoading.value = true;
    const formData = new FormData();
    let lang = ["uz", "ru", "en"];
    let title = ["message_", "title_", "text_"];
    for (let key of title) {
      for (let item of lang) {
        if (key === "cover_image_") {
          formData.append(
            `${key}${item}`,
            String(form.values[`${key}${item}`]?.id)
          );
          continue;
        }
        formData.append(`${key}${item}`, String(form.values[`${key}${item}`]));
      }
    }
    let time =
      convertToISOString(form.values.datePicker, form.values.dateTimePicker) ??
      "";
    formData.append("scheduled_time", String(time));
    formData.append("is_scheduled", !!time);
    buttonLoading.value = true;
    ApiService.put(`notification/${route.params?.id}/`, formData)
      .then(() => {
        buttonLoading.value = false;
        showToast(t("success_messages.successfully_edited"), "success");
        router.push({ name: "PNotification" });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => (buttonLoading.value = false));
  }
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
