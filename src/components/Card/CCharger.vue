<script setup lang="ts">
interface Props {
  isActive: boolean;
  name: string;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
});
</script>

<template>
  <div class="flex items-center space-x-3 max-w-[160px]">
    <div
      class="h-7 w-7 flex items-center justify-center p-1 border border-gray-300 rounded-lg"
      :class="{ '!border-primary': isActive }"
    >
      <i
        class="icon-ring-location text-xl text-gray-300"
        :class="{ '!text-primary': isActive }"
      ></i>
    </div>

    <p class="text-xs font-bold leading-130">{{ name }}</p>
  </div>
</template>

<style scoped></style>
