<script lang="ts" setup>
import { ConnectorState } from "@/modules/Station/data";

interface Props {
  status: string;
  text: string;
}

defineProps<Props>();

const getStatusStyle = (status: string) => {
  switch (status) {
    case ConnectorState.available:
      return "text-green bg-green/[8%] border border-green/10";
    case ConnectorState.preparing:
      return "text-yellow bg-yellow/[8%] border border-yellow/10";
    case ConnectorState.charging:
      return "text-gray-600 bg-gray-600/[8%] border border-gray-600/10";
    case ConnectorState.unavailable:
      return "text-red bg-red/[8%] border border-red/10";
    case ConnectorState.finishing:
      return "text-green bg-green/[8%] border border-green/10";
    case ConnectorState.faulted:
      return "text-red bg-red/[8%] border border-red/10";
  }
};
</script>

<template>
  <div
    :class="getStatusStyle(status)"
    class="inline-flex items-center justify-center px-3 py-1 rounded-[25px] text-xs font-semibold leading-130"
  >
    {{ text }}
  </div>
</template>

<style scoped></style>
