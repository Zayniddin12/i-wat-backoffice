<template>
  <div class="relative" ref="select">
    <div
      class="transition-200 px-3 h-10 py-[9px] bg-gray-50 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg w-full"
      tabindex="1"
      :class="[
        selectedOptionStyles,
        error ? '!border-red bg-red-100' : '',
        { 'focus-within:border-gray-100': disabled },
        headStyles,
        { 'border !border-primary !bg-transparent': showOptions },
      ]"
      @click="toggleSelect(!showOptions)"
    >
<!--      <span class="text-gray-900 font-medium">Активность</span>-->
      <slot name="selectedOption" :value="value">
        <div class="flex items-center justify-between">
          <div
            v-if="!value"
            tabindex="1"
            class="flex items-center text-gray-200 font-medium select-none text-sm leading-140 mr-4"
            :class="[{ '!text-gray': disabled }, placeholderClasses]"
          >
            {{ placeholder ?? $t("select") }}
          </div>
        </div>
    
        <slot name="chevron">
          <div
            class="flex-y-center gap-1.5"
            :class="{ 'justify-between w-full': value }"
          >
            <p
              v-if="value"
              class="font-normal select-none text-sm text-dark leading-140"
              tabindex="1"
              :class="[{ '!text-dark': disabled }, selectedStyles]"
            >
              {{ value[labelKey] || value }}
            </p>
            <span
              class="icon-chevron flex-center h-4 transition-200 text-base text-gray-700 block shrink-0"
              :class="{ '!rotate-180': showOptions }"
            >
            </span>
          </div>
        </slot>
      </slot>
    </div>
    
    <!-- OPTIONS -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="fromTop ? 'bottom-[65px]' : 'top-full'"
        class="absolute w-full bg-white pb-1 px-3 divide-gray/40 divide-y z-10 translate-y-3 overflow-hidden max-h-[334px] overflow-y-scroll text-white rounded-xl shadow-custom_select"
      >
        <li class="my-3 relative">
          <span
            class="absolute z-10 text-dark top-1/2 -translate-y-1/2 left-2"
          ></span>
          <FInput
            :placeholder="$t('search')"
            v-model="search"
            class="pl-2.5 rounded-md bg-gray"
            input-class="placeholder:font-medium"
          >
            <template #prefix>
              <i
                v-show="isSearchIcon"
                class="icon-search inline-block mr-2.5 text-xl text-gray-200"
              />
            </template>
          </FInput>
        </li>
        <li v-if="!filteredOptions?.length && search">
          <NoData
            :subtitle="$t('no_data_gender_subtitle')"
            :title="$t('no_data_gender_title')"
            class="p-0"
            image="/images/svg/no-data/default_no_data.svg"
          />
        </li>
        <slot name="options">
          <li
            v-for="(option, idx) in filteredOptions"
            :key="idx"
            class="transition-300 cursor-pointer group hover:bg-gray rounded-md first:border-none"
            @click="onSelect(option)"
          >
            <slot name="option" :option="option" :selected="value" :index="idx">
              <p
                class="flex-y-center space-x-1.5 p-3"
                :class="{
                  'first:border-none border-b border-gray':
                    idx !== filteredOptions.length - 1,
                }"
              >
                <span
                  class="text-dark text-[13px]"
                  :class="{ 'font-medium': isActive(option) }"
                >
                  {{ option[labelKey] }}
                </span>
                <i
                  v-if="isActive(option)"
                  class="icon-tick text-base text-dark"
                ></i>
              </p>
            </slot>
          </li>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { TClassName } from "@/types/common";
import FInput from "@/components/Form/Input/FInput.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
type TOption = string | number | { [key: string]: string | number };

export interface Props {
  modelValue?: TOption;
  options?: TOption[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  selectedOptionStyles?: TClassName;
  selectedStyles?: TClassName;
  headStyles?: TClassName;
  dark?: boolean;
  error?: boolean;
  disabled?: boolean;
  isSearchIcon?: boolean;
  placeholderClasses?: TClassName;
  filterKey?: string;
}
const props = withDefaults(defineProps<Props>(), {
  labelKey: "name",
  valueKey: "id",
  filterKey: "title",
});

const emit = defineEmits<{
  (e: "on-toggle", value: boolean): void;
  (e: "update:modelValue", value: boolean): void;
  (e: "load"): void;
  (e: "on-select", value: TOption): void;
}>();

const showOptions = ref(false);
const fromTop = ref(false);

const search = ref("");
const list = computed(() => props.options);

const filteredOptions = computed(() =>
  list.value?.filter((o) =>
    o[props.filterKey]?.toLowerCase().includes(search.value.toLowerCase())
  )
);

function toggleSelect(newValue = showOptions.value) {
  showOptions.value = newValue;
  emit("on-toggle", showOptions.value);
}

function findOption(option: TOption) {
  return filteredOptions.value?.find(
    (o) => o === option || o[props.valueKey] === option
  );
}

const value = ref(findOption(props.modelValue));
function onSelect(option: TOption) {
  value.value = option;
  toggleSelect(false);
  emit("update:modelValue", option[props.valueKey] || option);
  emit("on-select", option);
}

const select = ref();
onClickOutside(select, () => toggleSelect(false));

function isActive(option: TOption) {
  return (
    option === value.value ||
    option[props.valueKey as keyof typeof option] === value.value ||
    (typeof value.value === "object" &&
      option[props.valueKey as keyof typeof option] ===
      value.value[props.valueKey])
  );
}

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = findOption(newValue);
  },
  { immediate: true }
);
function checkTop() {
  const bounds = select.value.getBoundingClientRect();
  const distanceToBottom = window.innerHeight - bounds.bottom;
  const threshold = 300;
  fromTop.value = distanceToBottom < threshold;
}
onMounted(() => {
  nextTick(() => {
    checkTop();
  });
});
</script>

