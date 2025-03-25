<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  amount: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "—", // Default subtitle when not provided
  },
  isPositive: {
    type: Boolean,
    required: true, // Determines if it's income (true) or expense (false)
  },
});

// Determine the gradient class based on `isPositive`
const gradientClass = computed(() =>
  props.isPositive
    ? "bg-gradient-to-r from-green to-green-200"
    : "bg-gradient-to-r from-red to-red-300"
);
</script>

<template>
  <div
    class="max-h-10 relative min-h-10 overflow-hidden flex flex-col min-w-[152px] px-2 py-1.5 border-[1.5px] rounded-md border-white/[24%]"
    :class="gradientClass"
  >
    <span class="text-white text-xs font-medium truncate">{{ amount }}</span>
    <span class="text-white/80 text-xs font-normal truncate">{{
      subtitle
    }}</span>

    <!-- SVG based on isPositive -->
    <span class="absolute top-0 right-0">
      <svg
        v-if="isPositive"
        xmlns="http://www.w3.org/2000/svg"
        width="51"
        height="40"
        viewBox="0 0 51 40"
        fill="none"
      >
        <g opacity="0.16">
          <path
            d="M17.5 15.5L30 28L42.5 15.5M17.5 -2L30 10.5L42.5 -2"
            stroke="white"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="51"
        height="40"
        viewBox="0 0 51 40"
        fill="none"
      >
        <g opacity="0.16">
          <path
            d="M42.5 28L30 15.5L17.5 28M42.5 10.5L30 -2L17.5 10.5"
            stroke="white"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </span>
  </div>
</template>
