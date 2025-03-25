<template>
  <div ref="select" class="relative">
    <!--  SELECTED OPTION  -->
    <div
      :class="[
        selectedOptionStyles,
        error ? '!border-red bg-red-100' : '',
        { 'focus-within:border-gray-100': disabled },
        { '!border-primary !bg-transparent': showOptions },
        headStyles,
      ]"
      class="transition-200 px-3 h-10 py-[9px] bg-gray-50 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg w-full"
      tabindex="1"
      @click="toggleSelect(!showOptions)"
    >
      <slot
        :remove="(id) => removeTag(id)"
        :value="value"
        name="selectedOption"
      >
        <p
          v-if="!value"
          :class="{ '!text-gray': disabled }"
          class="text-gray select-none text-sm leading-140 mr-4"
          tabindex="1"
        >
          {{ placeholder ?? $t("select") }}
        </p>
        <slot name="chevron">
          <div
            :class="{ 'justify-between w-full': value }"
            class="flex-y-center gap-1.5"
          >
            <p
              v-if="value"
              :class="[{ '!text-dark': disabled }, selectedStyles]"
              class="font-normal select-none text-sm text-dark leading-140"
              tabindex="1"
            >
              {{ value[labelKey] || value }}
            </p>
            <span
              :class="{ '!rotate-180': showOptions }"
              class="icon-chevron flex-center h-4 transition-200 text-base text-gray-700 block shrink-0"
            >
            </span>
          </div>
        </slot>
      </slot>
    </div>
    <!--  OPTIONS  -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="fromTop ? 'bottom-[65px]' : 'top-full'"
        class="absolute w-full bg-white pl-3 divide-gray/40 divide-y shadow-custom_select z-10 translate-y-3 overflow-hidden max-h-[334px] overflow-y-scroll text-white rounded-md"
      >
        <li class="pr-2 my-3 relative">
          <FInput
            v-model="search"
            :placeholder="$t('search')"
            class="pl-2.5 rounded-md bg-gray"
            input-class="placeholder:font-medium"
          >
            <template #prefix>
              <i
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
        <slot v-else name="options">
          <li
            v-for="(option, idx) in filteredOptions"
            :key="idx"
            class="transition-300 cursor-pointer hover:bg-gray rounded-md"
            @click="onSelect(option)"
          >
            <slot
              :index="idx"
              :option="option"
              :selectedList="selectedList"
              name="option"
            >
              <p
                :class="{
                  'border-b border-white-100':
                    idx !== filteredOptions?.length - 1,
                }"
                class="flex-y-center space-x-1.5 p-3"
              >
                <span
                  :class="{ 'font-medium': isActive(option) }"
                  class="text-dark text-[13px]"
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

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { TClassName } from "@/types/common";
import FInput from "@/components/Form/Input/FInput.vue";
import NoData from "@/components/Common/NoData/NoData.vue";

type TOption = string | number | { [key: string]: string | number };

export interface Props {
  modelValue?: TOption | Array<any | string>;
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
  loading?: boolean;
  filterKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: "name",
  valueKey: "id",
  loading: true
});

const emit = defineEmits<{
  (e: "on-toggle", value: boolean): void;
  (e: "update:modelValue", value: number[]): void;
  (e: "load"): void;
  (e: "on-select", value: TOption): void;
}>();

const showOptions = ref(false);
const fromTop = ref(false);

const search = ref("");
const list = computed(() => props.options);

const removeTag = (id: any) => {
  value.value = value.value?.filter((sOption) => sOption?.id !== id);
  selectedList.value = selectedList.value?.filter((sOption) => sOption !== id);
  emit("update:modelValue", selectedList.value || []);
};

const filteredOptions = computed(() =>
  list.value?.filter((o) =>
    o[props.filterKey]?.toLowerCase().includes(search.value.toLowerCase())
  )
);

function toggleSelect(newValue = showOptions.value) {
  showOptions.value = newValue;
  emit("on-toggle", showOptions.value);
}

const value = ref<TOption[]>([]);

const selectedList = ref<number[]>([]);

function onSelect(option: TOption) {
  let key = option[props.valueKey];
  if (selectedList.value?.includes(key)) {
    value.value = value.value?.filter((sOption) => sOption?.id !== key);
    selectedList.value = selectedList.value?.filter(
      (sOption) => sOption !== key
    );
  } else {
    value.value?.push(option);
    selectedList.value?.push(key);
  }
  // toggleSelect(false);
  emit("update:modelValue", selectedList.value || []);
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

function checkTop() {
  const bounds = select.value.getBoundingClientRect();
  const distanceToBottom = window.innerHeight - bounds.bottom;
  const threshold = 300;
  fromTop.value = distanceToBottom < threshold;
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && Array.isArray(val)) {
      val.forEach((item) => {
        if (Object.keys(item).length) {
          value.value?.push(item);
          selectedList.value?.push(item[props.valueKey]);
        }
      });

      props.options?.forEach((option) => {
        val.forEach((v) => {
          if (option[props.valueKey] == v) {
            //check option exist in value.value
            if (selectedList.value?.includes(v)) return;
            value.value?.push(option);
            selectedList.value?.push(v);
          }
        });
      });
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  nextTick(() => {
    checkTop();
  });
});
</script>
