<template>
  <div
    class="bg-gray text-gray-300 px-1 py-0.5 rounded max-w-fit flex items-center space-x-0.5"
  >
    <span class="text-xs font-medium text-dark">{{ quantity }}</span>
  </div>
</template>
<script setup lang="ts">
interface Props {
  quantity: number;
}

defineProps<Props>();
</script>
<style></style>
