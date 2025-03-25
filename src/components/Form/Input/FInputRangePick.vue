<template>
  <div class="w-full">
    <div class="w-full">
      <div class="relative">
        <VueDatePicker
          v-model="computedDateRange"
          :inputClassName="
            activePick
              ? 'placeholder:!text-dark !w-[260px] !overflow-visible !border-white !text-dark !font-medium !text-xs !bg-white'
              : 'placeholder:!text-dark !w-[260px] !overflow-visible !border-gray !text-dark !font-medium !text-xs !bg-gray'
          "
          class="w-full"
          range
          :format="dateFormat"
          :enable-time-picker="false"
          :clearable="false"
          :placeholder="placeholder"
          auto-apply
          v-bind="{ formatLocale }"
          @update:model-value="updateDateRange"
          @open="isActive = true"
          @closed="isActive = false"
        >
          <template #input-icon></template>
        </VueDatePicker>
        <span
          class="icon-chevron absolute-y right-3 text-dark transition-300"
          :class="{ 'rotate-90': isActive }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import enUS from "date-fns/locale/en-US/index.js";
import ru from "date-fns/locale/ru/index.js";
import uz from "date-fns/locale/uz/index.js";
import { useI18n } from "vue-i18n";

interface Props {
  startValue: number;
  endValue: number;
  isClear: boolean;
  placeholder: string;
  isActive: boolean;
}

const { t, locale } = useI18n();
const isActive = ref(false);
const props = defineProps<Props>();
const selectedDateRange = ref([props?.endValue, props?.startValue]);
const emit = defineEmits<{
  (e: "update:modelValue", value: [number, number]): void;
}>();

// Computed date range that handles [0, 0] by setting an empty array
const computedDateRange = computed({
  get() {
    return selectedDateRange.value[0] === 0 && selectedDateRange.value[1] === 0
      ? []
      : selectedDateRange.value;
  },
  set(value) {
    selectedDateRange.value = value;
  },
});

function updateDateRange() {
  emit("update:modelValue", selectedDateRange.value);
}

// Locale-dependent format locale mapping
const formatLocale = computed(() => {
  const locales = {
    uz,
    ru,
    en: enUS,
  };
  return locales[locale.value as keyof typeof locales];
});

// Locale-dependent date format
const dateFormat = computed(() => {
  return locale.value === "ru" ? "d MMMM yyyy г." : "d MMMM yyyy";
});
const activePick = ref(false);
watch(
  props,
  () => {
    activePick.value = props.isActive;
    if (props.isClear) {
      selectedDateRange.value = [];
    }
  },
  { deep: true, immediate: true }
);
</script>

<style>
:root {
  --dp-input-icon-padding: 10px;
}
.dp__input {
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #ececec;
  @apply: transition-300;
}
.dp__input:focus-within {
  border: #3a8033;
}
.dp__input:hover {
  border: 1px solid #ffffff;
}
</style>
