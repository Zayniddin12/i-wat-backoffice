<template>
  <div class="flex items-center space-x-[6px]">
    <Select
        selected-option-styles="!py-2 !bg-gray flex gap-20"
        inputClasses="!text-dark text-sm font-normal leading-130"
        :options="startOptions"
        value-key="id"
        :disabled="disabled"
        label-key="title"
        :model-value="startTime"
        @update:model-value="handleUpdateStart"
        :placeholder="placeholder"
        :is-custom="isCustom"
    ><template #chevron
    ><span class="icon-icon-clock text-gray-100" /></template
    ></Select>
  </div>
</template>

<script lang="ts" setup>
import Select from "@/components/Form/Select/FSelect.vue";
import { ref, watch } from "vue";

interface Props {
  disabled: boolean;
  selectedOptionStyles?: string;
  placeholder: string;
  isCustom?: string;
  modelValue?: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "startTime", value: string | number): void;
}>();

const startOptions = ref(generateTime());

const startTime = ref(startOptions.value[0]);

watch(
    () => props.modelValue,
    () => {
      if (!props.modelValue) return;
      startTime.value = startOptions.value.find(
          (item) => item.id === props.modelValue
      );
    },
    { deep: true, immediate: true }
);

function generateTime() {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    const title = `${hour}:00`;
    const id = `${hour}:00:00`;
    times.push({ title, id });
  }
  return times;
}
const handleUpdateStart = (value: string | number) => {
  emit("startTime", value);
};
watch(
    () => startTime.value,
    (value) => {
      emit("startTime", value?.id);
    },
    { deep: true }
);
</script>

<style scoped></style>
