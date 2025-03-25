<template>
  <div class="c-date-time-picker relative">
    <!-- Date and Time Picker -->
    <VueDatePicker
      v-bind="{ range, yearRange, formatLocale }"
      :min-date="minDate"
      ref="dateTimePicker"
      auto-apply
      :disabled="disabled"
      :readonly="disabled"
      enable-time-picker
      time-picker-inline
      :month-change-on-scroll="false"
      text-input
      :text-input-options="{
        enterSubmit: true,
        openMenu: false,
        format: 'dd.MM.yyyy HH:mm',
      }"
      :hide-navigation="[
        'month',
        'year',
        'calendar',
        'time',
        'minutes',
        'hours',
        'seconds',
      ]"
      :model-value="pickerValue"
      format="dd.MM.yyyy HH:mm"
      @update:modelValue="onChangeValue"
    >
      <template #dp-input>
        <!-- Custom Input Field -->
        <FInput
          v-bind="{ error }"
          :mask="inputMask"
          :model-value="value"
          :disabled="disabled"
          :placeholder="inputPlaceholder"
          @update:modelValue="value = $event"
          :input-class="customClass"
          @blur="emit('blur')"
        />
      </template>
    </VueDatePicker>

    <!-- Clear and Toggle Buttons -->
    <div class="flex-center absolute-y right-0">
      <button
        :disabled="disabled"
        v-if="pickerValue"
        class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red"
        @click="clearDateFilter"
      >
        <span
          class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
        />
      </button>

      <button class="flex-center group px-3" type="button" @click="toggleMenu">
        <i
          class="icon-calendar-year transition-200 text-[18px] text-gray-200 group group-hover:text-blue"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import { enUS, ru, uz } from "date-fns/locale";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import FInput from "@/components/Form/Input/FInput.vue";
import { parseCustomDate } from "@/utils";

interface Props {
  modelValue: string;
  error?: boolean;
  range?: boolean;
  minDate?: string;
  disabled?: boolean;
  customClass?: string;
}
const props = defineProps<Props>();

interface Emits {
  (event: "blur"): void;
  (event: "update:modelValue", value: string): void;
}
const emit = defineEmits<Emits>();

const { locale, t } = useI18n();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// Adjusted year range to support date-time picker
const yearRange = [
  new Date().getFullYear() - 100,
  new Date().getFullYear() + 4,
];

const formatLocale = computed(() => {
  const locales = {
    uz: uz,
    ru: ru,
    en: enUS,
  };

  return locales[locale.value as keyof typeof locales];
});

const dateTimePicker = ref();

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value
    ? dateTimePicker.value?.closeMenu()
    : dateTimePicker.value?.openMenu();
  showMenu.value = !showMenu.value;
};

// Adjusted input mask and placeholder to include time
const inputMask = computed(() =>
  props.range ? "##.##.#### ##:## - ##.##.#### ##:##" : "##.##.#### ##:##"
);

const inputPlaceholder = computed(() =>
  props.range
    ? `${t("dd_mm_yyyy_hh_mm")} - ${t("dd_mm_yyyy_hh_mm")}`
    : `${t("dd_mm_yyyy_hh_mm")}`
);

const clearDateFilter = () => {
  value.value = "";
};

const onChangeValue = (val: string) => {
  value.value = dayjs(val).format("DD.MM.YYYY HH:mm");
  showMenu.value = false;
};

// Adjusted pickerValue to handle date and time
const pickerValue = computed(() => {
  if (!props.modelValue) return undefined;

  if (props.range) {
    const [start, end] = props.modelValue.split(" - ");
    const formattedStart = dayjs(start?.split(".").reverse().join("-")).format(
      "YYYY-MM-DD HH:mm"
    );
    const formattedEnd = dayjs(end.split(".").reverse().join("-")).format(
      "YYYY-MM-DD HH:mm"
    );
    return [new Date(formattedStart), new Date(formattedEnd)];
  } else {
    const formattedDate = dayjs(parseCustomDate(props.modelValue)).format(
      "YYYY-MM-DD HH:mm"
    );
    return new Date(formattedDate);
  }
});
</script>

<style>
.c-date-time-picker .dp__overlay_container {
  height: 288px !important;
}

.c-date-time-picker .dp__input {
  padding: 8px 12px !important;
}

.c-date-time-picker .dp__input_wrap svg {
  display: none !important;
}
</style>
