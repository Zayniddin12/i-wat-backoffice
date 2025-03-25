<template>
  <div class="flex flex-col gap-2">
    <template v-for="(item, index) in steps" :key="index">
      <div class="flex-y-center gap-3">
        <div
          class="w-10 h-10 flex-center flex-none bg-gray-400 rounded-lg transition-300"
          :class="[
            { '!bg-primary': step === item?.id },
            { '!bg-white-700': step > item?.id },
          ]"
        >
          <p
            class="text-gray-700 leading-5 text-base font-bold transition-300"
            :class="[
              { '!text-white': step === item?.id },
              { 'text-gray-200 icon-checked': step > item?.id },
            ]"
          >
            {{ step > item?.id ? "" : item?.id }}
          </p>
        </div>
        <div>
          <p class="text-sm leading-130 font-semibold text-dark">
            {{ item?.title }}
          </p>
          <p class="text-xs leading-130 text-gray-200 mt-0.5">
            {{ item?.subtitle }}
          </p>
        </div>
      </div>
      <div
        v-if="index !== steps?.length - 1"
        class="w-px h-5 bg-gray-400 ml-5 transition-300"
        :class="{ '!bg-primary opacity-20': step >= item?.id }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  step: number;
  steps: {
    title: string;
    subtitle: string;
    id: number;
  }[];
}

defineProps<Props>();
</script>
