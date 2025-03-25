<script lang="ts" setup>
import dayjs from "dayjs";

defineProps<{
  date: string;
}>();
</script>

<template>
  <div v-if="date">
    <h5 class="text-xs font-normal">
      {{ dayjs(date)?.format("DD.MM.YYYY") }}
    </h5>
    <p class="text-xs font-normal text-gray-300">
      {{ dayjs(date)?.format("HH:mm") }}
    </p>
  </div>
  <div v-else class="ml-6">-</div>
</template>

<style scoped></style>
