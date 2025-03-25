<template>
  <div
    class="phone-input transition-200 relative bg-gray-500 rounded-lg border border-transparent"
    :class="
      error
        ? '!border-red !focus-within:border-red'
        : 'focus-within:border-violet'
    "
    ref="inputWrapper"
  >
    <VueTelInput
      ref="phoneInput"
      v-model="phone"
      disabled-fetching-country
      :input-options="{
        placeholder,
        maxlength: 20,
        id: 'phone-input',
        name: 'phone-input',
      }"
      :dropdown-options="{
        showSearchBox: false,
        showFlags: false,
      }"
      valid-characters-only
      :auto-default-country="false"
      class="caret-violet text-[15px] leading-[133%]"
      :class="{ invalid: !valid }"
      @validate="handleValidatedPhone"
      @country-changed="countryChanged"
      @open="onOpen"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

interface Props {
  error?: boolean;
  modelValue?: string;
  placeholder?: string;
  loading?: boolean;
  readonly?: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (event: "update:modelValue", value: string): void;
  (event: "validate", value: boolean): void;
  (event: "blur", value: string): void;
  (event: "reset-validation"): void;
}
const emit = defineEmits<Emits>();

const { t } = useI18n();

const valid = ref(false);
const invalidError = ref(false);
const phone = ref("");

const phoneInput = ref<HTMLElement>();
const inputWrapper = ref<HTMLElement>();

useEventListener(phoneInput, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Backspace" && phone.value === "+") {
    e.preventDefault();
  }
});

watch(
  () => phone.value,
  (value) => {
    emit("update:modelValue", value);
  }
);

watch(
  () => props.modelValue,
  () => {
    phone.value = props.modelValue ?? "";
  },
  { immediate: true }
);

const onFocus = () => {
  if (phone.value?.length === 0) {
    emit("update:modelValue", "+");
  }
};

const onBlur = () => {
  if (phone.value?.length === 1) {
    phone.value = "";
    setTimeout(() => {
      emit("reset-validation");
    }, 10);
  }

  // On change tab validation touch method fires immediately. So we need to wait
  setTimeout(() => emit("blur", phone.value), 500);
};

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault();

  const pastedText = e.clipboardData?.getData("text/plain") ?? "";

  const hasDefaultPlus = phone.value.startsWith("+");
  const hasPastedPlus = pastedText?.startsWith("+");

  if (hasDefaultPlus && hasPastedPlus) {
    phone.value = pastedText;
  } else if (hasDefaultPlus && !hasPastedPlus) {
    phone.value = `+${pastedText}`;
  } else if (!hasDefaultPlus && hasPastedPlus) {
    phone.value = pastedText;
  } else if (!hasDefaultPlus && !hasPastedPlus) {
    phone.value = `+${pastedText}`;
  }
};

onMounted(() => {
  const phoneInputEl = inputWrapper.value?.querySelector(
    ".phone-input input"
  ) as HTMLInputElement;

  phoneInputEl.onblur = onBlur;
  phoneInputEl.onfocus = onFocus;
  phoneInputEl.onpaste = onPaste;

  phoneInputEl.focus();

  if (props.modelValue) {
    phone.value = props.modelValue;
  }

  phoneInput.value?.choose({ iso2: "UZ" });
});

interface IValidateOptions {
  country: {
    dialCode: string;
    iso2: string;
    name: string;
  };
  countryCode: string | undefined;
  formatted: string | "";
  valid: boolean | undefined;
  countryCallingCode?: string;
  nationalNumber?: string;
  number?: string;
}

function handleValidatedPhone(options: IValidateOptions) {
  valid.value = !!options?.countryCode ?? false;
  invalidError.value =
    !options.valid &&
    !!options?.countryCode &&
    options.formatted.length > String(options.number)?.length;
  emit("validate", invalidError.value);
}

const countryChanged = (e: { dialCode: string }) => {
  phone.value = `+${e.dialCode}`;
};

const onOpen = () => {
  setTimeout(() => {
    const searchInput = document.querySelector(
      ".vti__search_box"
    ) as HTMLInputElement;

    searchInput.placeholder = t("search");
  }, 0);
};
</script>
<style>
.vue-tel-input {
  height: 44px !important;
  border: none !important;
  background: #f3f2f5 !important;
  border-radius: 8px !important;
}
.vti__input {
  border-radius: 8px !important;
  background: #f3f2f5 !important;
}
.vue-tel-input:focus-within {
  box-shadow: none !important;
}
.vti__dropdown {
  visibility: hidden;
}
</style>
