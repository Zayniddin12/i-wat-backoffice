<template>
  <div
    :class="[
      props.show
        ? 'visible opacity-100 !-translate-y-1/4 z-1'
        : 'invisible opacity-0',
      classStyle,
    ]"
    class="absolute w-max tooltip shadow-custom bg-dark flex items-center z-20 bottom-full translate-y-0 left-1/2 -translate-x-1/2 group-hover:-translate-y-1/3 px-4 py-2 text-white text-sm leading-130 rounded-lg border border-dark text-center transition-all duration-300 group-hover:visible group-hover:md:opacity-100 max-w-[278px]"
  >
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script setup lang="ts">
export interface Props {
  show?: boolean;
  classStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  classStyle: "",
});
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
}
.tooltip {
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -16px;
    transform: translateX(-50%) rotate(180deg);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent #1e1e1e transparent;
  }
}
.tooltip * {
  font-family: Roboto, sans-serif;
}
</style>
