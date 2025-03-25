<template>
  <div>
    <button class="flex-y-center gap-2 group" @click="$emit('back')">
      <i
        class="icon-chevron-left text-base block font-thin text-dark transition group-hover:-translate-x-1"
      />
      <span class="text-[28px] leading-130 font-semibold text-dark">
        {{ $t("enter_code") }}
      </span>
    </button>
    <p class="text-sm leading-130 font-normal text-gray-300 mt-4">
      {{ $t("we_send_code") }}
    </p>
    <button
      class="flex-y-center px-2 py-1.5 gap-2.5 rounded bg-gray group mt-2 group hover:bg-gray-100/40 transition-300"
      @click="$emit('back')"
    >
      <span
        class="text-sm leading-130 font-normal text-dark-100 group-hover:text-dark transition-300"
      >
        {{ hashPhoneNumber(store.loginResponse?.phone_number ?? "") }}
      </span>
      <i
        class="icon-edit-square text-gray-300 group-hover:text-dark transition-300"
      ></i>
    </button>

    <SFormGroup
      :label="$t('confirm_code')"
      class="my-8"
      label-class="font-medium !text-gray-300"
    >
      <COtp
        :key="resend + ''"
        v-model="form.values.code"
        :error="form.$v.value.code?.$error || otpError"
      />
    </SFormGroup>
    <div
      v-if="!resend"
      :key="resend + ''"
      class="flex items-center justify-center gap-2 mt-4 mb-8"
    >
      <span class="text-sm text-gray-300">{{ $t("resend_code") }}:</span>
      <CTimer seconds="60" @timeout="timeout" />
    </div>
    <div
      v-else
      class="flex items-center justify-center gap-2 mt-4 mb-8 cursor-pointer"
      @click="onResend"
    >
      <span class="text-sm text-gray-300">{{ $t("resend_code") }}: </span>
      <img alt="" src="/images/svg/refresh.svg" />
    </div>
    <SButton
      :loading="loading"
      :text="$t('confirm')"
      class="w-full"
      v-bind="{ disabled: disabled || loading }"
      @click="submit"
    />
  </div>
</template>

<script lang="ts" setup>
import SFormGroup from "@/components/Form/FGroup.vue";
import COtp from "@/components/Form/FOtp.vue";
import { ref, watch } from "vue";
import { useForm } from "@/composables/useForm";
import { minLength, required } from "@vuelidate/validators";
import SButton from "@/components/Common/CButton.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
import CTimer from "@/components/CTimer.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import { hashPhoneNumber } from "@/utils/changeNumberFormat";
import { useHandleError } from "@/composables/useHandleError";

interface Props {
  phone?: string;
}

defineProps<Props>();

const emit = defineEmits(["submit", "back", "on-resend", "on-block"]);

const { showToast } = useCustomToast();
const store = useAuthStore();
const { t } = useI18n();
const { handleError } = useHandleError();

const disabled = ref(true);
const resend = ref(false);
const otpError = ref(false);
const loading = ref(false);
const form = useForm(
  {
    code: "",
  },
  {
    code: { required, minLength: minLength(6) },
  }
);

function onResend() {
  resend.value = false;
  form.values.code = "";
  form.$v.value.$reset();
  emit("on-resend");
}

function timeout() {
  resend.value = true;
  form.values.code = "";
  form.$v.value.$reset();
}

watch(
  () => form.values.code,
  () => {
    otpError.value = false;
  }
);

async function submit() {
  form.$v.value.$touch();

  if (!form.$v.value.$invalid) {
    loading.value = true;
    try {
      await store.verifyOtp(form.values.code).then((res: any) => {
        emit("submit", res?.data);
      });
      showToast(t("successfully_entered"), "success");
    } catch (err) {
      if (err?.response?.status === 429) {
        emit("on-block");
        store.blockedTime = +err?.response?.headers["retry-after"];
      }
      handleError(err);
      otpError.value = true;
    } finally {
      loading.value = false;
    }
  } else {
    showToast(t("fill_code"), "error");
  }
}

watch(
  () => form.values.code,
  (val: string) => {
    otpError.value = false;
    form.$v.value.$reset();
    disabled.value = val?.length !== 6;
  }
);
</script>
