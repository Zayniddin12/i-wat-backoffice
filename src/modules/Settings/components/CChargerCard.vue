<template>
  <div class="flex items-center space-x-3">
    <div
      :class="[card.iconClass, style[card.status]?.bg]"
      class="rounded-lg bg-gray w-7 h-7 flex-center"
    >
      <inline-svg
        class="inline-svg"
        :class="style[card.status]?.class"
        v-if="card.marc_icon"
        :src="card?.marc_icon"
      />
      <i
        v-else
        :class="style[card.status]?.icon"
        class="text-sm icon-chademo2 text-gray-200 leading-none"
      ></i>
    </div>

    <div class="cursor-pointer hover:text-primary transition-300">
      <p class="text-xs font-bold leading-none">{{ card?.title }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import InlineSvg from "vue-inline-svg";
import { ConnectorState } from "@/types/enums";
interface Props {
  card: {
    id?: string;
    title: string;
    status: string;
    marc_icon?: string;
    iconClass?: string;
  };
}

defineProps<Props>();

const style: Record<ConnectorState, object> = {
  [ConnectorState.AVAILABLE]: {
    icon: "text-green-100",
    bg: "!bg-green-100/[16%]",
    class: "available",
  },
  [ConnectorState.PREPARING]: {
    icon: "text-green-100",
    bg: "!bg-green-100/[16%] ",
    class: "preparing",
  },
  [ConnectorState.CHARGING]: {
    icon: "text-gray-600",
    bg: "!bg-[#C6CECB]/50",
    class: "charging",
  },
  [ConnectorState.UNAVAILABLE]: {
    icon: "text-red-200",
    bg: "!bg-[#F0233C]/[16%]",
    class: "unavailable",
  },
  [ConnectorState.FINISHING]: {
    icon: "text-green-100",
    bg: "!bg-green-100/[16%]",
    class: "finishing",
  },
  [ConnectorState.FAULTED]: {
    icon: "text-red-200",
    bg: "!bg-[#F0233C]/[16%]",
    class: "faulted",
  },
};
</script>
<style>
.inline-svg {
  width: 18px;
  height: 18px;
}
.inline-svg.available path,
.inline-svg.preparing path,
.inline-svg.finishing path {
  stroke: #1cb57a;
}
.inline-svg.charging path {
  stroke: #74807b;
}
.inline-svg.unavailable path,
.inline-svg.faulted path {
  stroke: #e93b50;
}
</style>
