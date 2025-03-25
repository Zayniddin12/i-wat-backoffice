<template>
  <label
    class="group inline-flex items-center relative select-none min-h-6"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <input
      v-bind="{ disabled }"
      type="radio"
      class="absolute opacity-0 invisible h-0 w-0 peer"
      :checked="checked"
      :value="value"
      :name="name"
      @change="handleChange"
    />
    <span
      :class="[
        'duration-200 ease-in-out flex items-center justify-center h-5 w-5 rounded-full border-2 border-green peer-checked:bg-green-100 peer-checked:after:bg-green peer-checked:after:opacity-100 after:transition-all after:duration-200 after:absolute after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent after:opacity-0',
        {
          'border-gray-300': !checked,
          'peer-checked:bg-white peer-checked:border-green': checked,
          'peer-disabled:border-gray-100': disabled,
          'peer-checked:after:opacity-100': checked,
        },
      ]"
      class="shrink-0"
    >
    </span>
    <span v-if="label" class="ml-2">
      <slot name="label">
        <span
          :class="['leading-130 text-dark text-xs font-medium', labelStyles]"
        >
          {{ label }}
        </span>
      </slot>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | boolean;
  label?: string;
  name?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  error?: boolean;
  labelStyles?: string;
  checked: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "change", value: boolean): void;
}>();
const handleChange = (e: Event) => {
  emit("change", !props.checked);
};
</script>
