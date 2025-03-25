<template>
  <CCard class="flex-shrink-0 h-auto">
    <h4 class="text-xl text-dark font-semibold px-6 pt-6 mb-5">
      {{ $t("dashboard.charts.sort_title") }}
    </h4>
    <div v-if="data?.length">
      <div class="flex px-6 w-full">
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="{ 'mr-[3px]': item?.amount && index !== data.length - 1 }"
          :style="{
            backgroundColor: item?.color,
            width: getPercent(Number(item?.amount)) + '%',
          }"
          class="h-10 rounded-sm mb-4"
        ></div>
      </div>
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="{ 'border-b border-b-gray': index !== data.length - 1 }"
        class="h-[56px] grid items-center relative mx-6"
      >
        <div class="grid grid-cols-3">
          <div class="flex items-center gap-2">
            <div v-if="item.image" class="absolute -top-2 -left-5">
              <img :alt="item.label + ' image'" :src="item.image" />
            </div>
            <div
              v-else
              :style="{
                backgroundColor: item?.color,
              }"
              class="w-3 h-3 rounded-[3px]"
            ></div>

            <p class="text-[#94A8AA] text-xs !leading-normal font-medium">
              {{ $t(item?.label) }}
            </p>
          </div>

          <div class="text-center">
            <span
              class="text-center text-dark text-sm font-medium leading-130 px-1 border-l border-l-gray border-r border-r-gray"
            >
              {{ getPercent(Number(item?.amount)) }}%
            </span>
          </div>

          <div class="ml-auto text-right">
            <h5
              class="mb-1 text-sm !leading-normal text-dark-100 font-semibold truncate"
            >
              {{ changeNumberFormat(item.amount) }}
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center h-min">
      <NoData
        :subtitle="$t('no_data_age_stats_subtitle')"
        :title="$t('no_data_age_stats_title')"
        class="mt-8 px-6 !py-10"
        image="/images/svg/no-data/42.svg"
      />
    </div>
  </CCard>
</template>
<script lang="ts" setup>
import { computed } from "vue";

import CCard from "@/components/Card/CCard.vue";

import { IBarChartData } from "@/types/components/chart";
import { changeNumberFormat } from "@/utils/changeNumberFormat";
import NoData from "@/components/Common/NoData/NoData.vue";

interface Props {
  data: IBarChartData[];
  disabled?: boolean;
  check?: boolean;
}

const props = defineProps<Props>();

const total = computed(() => {
  return props.data.reduce((acc, item) => acc + item.amount, 0);
});

function getPercent(amount: number) {
  return ((amount / total?.value) * 100).toFixed(2);
}
</script>
<style>
.grid-cols-1-max-1 {
  grid-template-columns: 1fr max-content 1fr;
}
</style>
