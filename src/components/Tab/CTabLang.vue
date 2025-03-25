<template>
  <div
    class="main-tab w-full space-x-2 border-gray relative bg-white/12 flex transition-all duration-200 border-b border-solid"
  >
    <div
      :class="[
        'absolute w-auto -bottom-px transition-all duration-200',
        'h-full bg-white rounded-none rounded-t-lg border-t border-x border-gray top-px',
        activeClass,
      ]"
      :style="{ width: `${active.width}`, left: `${active.left}px` }"
    ></div>
    <button
      v-for="(tab, idx) in list"
      :id="`item_${tab.value}`"
      :key="idx"
      :class="[
        'flex items-center justify-center !w-auto px-5 py-3 text-base font-medium',
        itemClass,
        modelValue === tab.value ? 'text-primary' : 'text-dark',
      ]"
      class="tabs py-3 transition-all duration-200 w-full z-0 font-medium tabs"
      @click="pick(tab.value, $event)"
    >
      <img
        :src="tab?.icon"
        alt="flags"
        @click.stop
        v-if="withIcon"
        class="w-5 h-5 mr-2 pointer-events-none"
      />
      {{ $t(tab.label) }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

interface Props {
  modelValue: string | number;
  list: any[];
  itemClass?: string;
  activeClass?: string;
  withIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "complain",
  list: () => [
    {
      label: "Жалобы",
      value: "complain",
    },
    {
      label: "Заявки",
      value: "review",
    },
  ],
  withIcon: false,
});

interface Emits {
  (e: "update:modelValue", value: string | number): void;
}

const $emit = defineEmits<Emits>();

const active = ref({ left: 0, width: "0px" });
const pick = (tab: string | number, e?: { target: HTMLButtonElement }) => {
  const target = e.target as HTMLButtonElement;
  active.value = {
    left: target?.offsetLeft,
    width: target?.offsetWidth + "px",
  };
  $emit("update:modelValue", tab);
};

onMounted(() => {
  const item = document.getElementById(
    `item_${props.modelValue}`
  ) as HTMLButtonElement;
  setTimeout(() => {
    pick(props.modelValue, { target: item });
  }, 10);
});

watch(
  () => props.modelValue,
  () => {
    const item = document.getElementById(
      `item_${props.modelValue}`
    ) as HTMLButtonElement;
    setTimeout(() => {
      pick(props.modelValue, { target: item });
    }, 10);
  }
);
</script>
<style scoped>
.tabs:first-of-type {
  margin: 0 !important;
}
</style>
