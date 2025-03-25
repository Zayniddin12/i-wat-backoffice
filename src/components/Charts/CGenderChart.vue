<template>
  <CCard class="py-6 px-0 flex-shrink-0">
    <h4 class="text-xl text-dark font-semibold mb-5 px-6">
      {{ $t("by_gender") }}
    </h4>
    <div
      v-if="checkChartData"
      class="flex justify-center overflow-hidden w-full !max-h-[140px] pb-4"
    >
      <div class="relative">
        <div class="relative gender-chart mb-5">
          <Doughnut
            :data="data"
            :options="chart_options"
            class="!h-[130px] !rounded-full"
          />
        </div>
        <div
          class="absolute z-100 bottom-1 left-1/2 -translate-x-1/2 text-center"
        >
          <h3 class="text-sm text-[#667779] text-center mb-1">
            {{ $t("all_users") }}
          </h3>
          <p class="font-medium text-base text-dark text-center">
            {{ formatMoneyDecimal(totalCount) }}
          </p>
        </div>
      </div>
    </div>
    <NoData
      v-else
      :subtitle="$t('no_data_gender_subtitle')"
      :title="$t('no_data_gender_title')"
      class="mt-8 px-6"
      image="/images/svg/no-data/default_no_data.svg"
    />
    <div class="bg-[#EDF0F2] h-[1px] w-full mt-4" />
    <div v-if="checkChartData" class="px-6 mt-6">
      <div
        v-for="(el, i) of genderContent"
        :key="i"
        class="custom-border flex items-center space-x-3 py-3"
      >
        <div :class="el?.color" class="w-3 h-3 rounded" />
        <div>
          <p class="text-[#667779] text-sm font-normal leading-normal">
            {{ $t(el?.gender) }}
          </p>
          <p class="text-base text-dark font-medium leading-130">
            <span>{{ Math.floor(el?.percentage) }}% </span>
            <span>({{ formatMoneyDecimal(el?.count) }})</span>
          </p>
        </div>
      </div>
    </div>
  </CCard>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import { Doughnut } from "vue-chartjs";
import { computed } from "vue";
import { formatMoneyDecimal } from "@/utils";
import CCard from "@/components/Card/CCard.vue";

import { useI18n } from "vue-i18n";
import { IMainGenderStatisticsResponse } from "@/types/common";
import NoData from "@/components/Common/NoData/NoData.vue";

interface Props {
  disabled?: boolean;
  data: IMainGenderStatisticsResponse[];
}

const props = defineProps<Props>();

const { t } = useI18n();

const data = computed(() => {
  return {
    type: "doughnut",
    line: {
      backgroundColor: "#51B0F5",
    },
    backgroundColor: "#F55152",
    datasets: [
      {
        backgroundColor: ["#F55152", "#51B0F5"],
        data: [props.data[0]?.count, props.data[1]?.count],
        cutout: "75%",
        circumference: 180,
        rotation: 270,
        borderColor: "transparent",
        borderRadius: 50,
        spacing: -0,
        offset: [0, 0, 0],
      },
    ],
    chartOptions: [{ circumference: 20, spacing: -10 }],
  };
});

const chart_options = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
  };
});

const genderContent = computed(() => [
  {
    gender: "women",
    color: "bg-[#F55152]",
    count: props.data[0]?.count,
    percentage: props.data[0]?.percentage,
  },
  {
    gender: "men",
    color: "bg-[#51B0F5]",
    count: props.data[1]?.count,
    percentage: props.data[1]?.percentage,
  },
]);

const totalCount = computed(() => {
  return props.data[0]?.count + props.data[1]?.count;
});

const checkChartData = computed(() => {
  return props.data[0]?.count > 0 || props.data[1]?.count > 0;
});
</script>
<style>
.custom-border:not(:last-child) {
  border-bottom: 1px solid #f3f0fe;
}

.gender-chart > * {
  width: 350px !important;
}
</style>
