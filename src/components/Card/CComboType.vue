<script setup lang="ts">
const props = defineProps<{
  type: "default" | "busy" | "free" | "off";
}>();

const getStyle = () => {
  switch (props.type) {
    case "default":
      return "bg-gray text-gray-200";
    case "busy":
      return "bg-[#C6CECB80] text-gray-600";
    case "free":
      return "bg-[#1CB57A29] text-green-100";
    case "off":
      return "bg-[#F0233C29] text-red-200";
  }
};
</script>

<template>
  <div
    :class="getStyle()"
    class="h-9 w-9 flex items-center justify-center rounded-lg"
  >
    <i class="icon-charger-off" :class="getStyle" />
  </div>
</template>

<style scoped></style>
