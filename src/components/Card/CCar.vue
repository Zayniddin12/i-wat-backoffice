<script setup lang="ts">
import Tooltip from "@/components/Common/Dropdown/Tooltip.vue";
import { ref } from "vue";

interface Props {
  car: {
    image: string;
    name?: string;
    model?: string;
    user_defined?: boolean;
    status?: string;
  };
}

defineProps<Props>();

const showTooltip = ref(false);
</script>

<template>
  <div
    v-if="Object.values(car).filter((el) => el).length"
    class="flex items-center space-x-3"
  >
    <div class="flex items-center justify-between">
      <div
        v-if="car.status"
        style="border-color: rgba(6, 16, 24, 0.2)"
        class="flex items-center justify-center font-medium px-1 h-[24px] bg-red border-[2px] text-white text-xs rounded-[5px] mr-[17px]"
      >
        10%
      </div>
      <img
        v-if="car.image"
        :src="car.image"
        :alt="'car image of ' + car?.name"
        class="w-[30px] h-[30px] inline-block p-1 object-cover border border-gray rounded-lg"
      />

      <img
        v-else
        src="/public/images/svg/car.svg"
        alt="default car image"
        class="w-[30px] h-[30px]"
      />
    </div>
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-1">
        <h1 v-if="car?.name" class="text-dark text-xs font-bold leading-[14px]">
          {{ car?.name }}
        </h1>
        <span
          v-if="car.user_defined"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          class="icon-info-circle relative text-yellow text-center cursor-pointer"
        >
          <Tooltip :show="showTooltip">
            <p class="text-sm text-white">{{ $t("car_added_by") }}</p>
          </Tooltip>
        </span>
      </div>
      <p
        v-if="car?.model"
        class="text-gray-100 text-xs font-normal leading-[14px]"
      >
        {{ car?.model }}
      </p>
    </div>
  </div>
  <span v-else class="flex items-center ml-10">-</span>
</template>

<style scoped></style>
