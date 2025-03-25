<script setup lang="ts">
// import { Connector } from "@/types/components/connector";

defineProps<{
  charging_type: any[];
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      v-if="charging_type.length"
      class="p-1.5 px-2 bg-gray rounded-lg flex items-center gap-1"
    >
      <img
        v-if="charging_type[0]?.icon"
        :src="charging_type[0]?.icon"
        alt="icon"
        class="w-[14px] object-cover"
      />
      <p class="text-[#141414] font-medium text-xxs">
        {{ charging_type[0]?.name }}
      </p>
    </div>
    <div
      v-if="charging_type.length > 1"
      class="p-1.5 px-2 bg-gray rounded-lg flex items-center gap-1"
    >
      <p class="text-[#141414] font-medium text-xxs">
        +{{ charging_type.length - 1 }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
