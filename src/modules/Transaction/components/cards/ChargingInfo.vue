<script setup lang="ts">
defineProps<{
  card: {
    icon1?: string;
    icon2?: string;
    title1: string;
    value1: string;
    title2: string;
    value2: string;
  };
}>();
</script>

<template>
  <div class="card grid grid-cols-2">
    <div
      class="flex items-center gap-3 border-r border-[rgba(148, 168, 170, 0.4)"
    >
      <div v-if="card?.icon1" class="flex items-center">
        <i :class="card?.icon1"></i>
      </div>
      <div>
        <h5 class="mb-0.5 text-gray-100 text-xs font-normal">
          {{ card?.title1 }}
        </h5>
        <p class="text-base font-semibold text-dark leading-130">
          {{ card?.value1 }}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-3 pl-4">
      <div v-if="card?.icon2" class="flex items-center">
        <i :class="card?.icon2"></i>
      </div>
      <div class="flex flex-col">
        <h5 class="mb-0.5 text-gray-100 text-xs font-normal">
          {{ card?.title2 }}
        </h5>
        <p class="text-base font-semibold text-dark leading-130">
          {{ card?.value2 }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(237, 240, 242, 0.5);
}

.card > div:first-child {
  border-color: rgba(148, 168, 170, 0.4);
}
</style>
