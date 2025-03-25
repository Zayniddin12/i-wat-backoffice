<template>
  <CCard class="flex-shrink-0 p-6">
    <div class="flex justify-between mb-5">
      <div>
        <h4 class="text-xl text-dark font-semibold mb-1">
          {{ $t("attendance") }}
        </h4>
        <p class="text-gray-300 text-xs font-normal leading-130">
          {{ $t("graphic_attendance") }}
        </p>
      </div>

      <Tab
        :list="tabList"
        :model-value="tabValue"
        class="space-x-3 border-none"
        item-class="!pt-0 whitespace-nowrap"
        @update:model-value="handleUpdateTab"
      />
    </div>
    <div v-if="!loading">
      <Transition mode="out-in" name="fade">
        <div :key="tabValue" class="h-[280px]">
          <template v-if="tabValue === 'today'">
            <ApexChart
              :options="options"
              :series="seriesToday"
              height="280px"
            />
          </template>
          <template v-if="tabValue === 'all'">
            <ApexChart :options="options" :series="seriesAll" height="280px" />
          </template>
        </div>
      </Transition>
    </div>
    <div
      v-if="
        loading && (seriesToday[0]?.data?.length || seriesAll[0]?.data?.length)
      "
    >
      <NoData
        :title="$t('empty_data')"
        class="mt-8"
        image="/svg/empty-state.svg"
      />
    </div>
  </CCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import ApexChart from "vue3-apexcharts";
import CCard from "@/components/Card/CCard.vue";
import Tab from "@/components/Tab/CTab.vue";
import { useI18n } from "vue-i18n";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn.js";
import NoData from "@/components/Common/NoData/NoData.vue";
import { useDashboardStore } from "@/modules/Dashboard/store";

interface Props {
  disabled?: boolean;
  data?: object;
}

defineProps<Props>();
const mainStore = useDashboardStore();

const { t, locale } = useI18n();
dayjs.locale(locale.value === "uz" ? "uz-latn" : locale.value);
const loading = ref(true);

const tabList = reactive([
  {
    label: t("for_today"),
    value: "today",
  },
  {
    label: t("for_all_time"),
    value: "all",
  },
]);
const tabValue = ref("today");

const handleUpdateTab = (value: string) => {
  tabValue.value = value;
};
const options = reactive({
  chart: {
    type: "area",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
    },
    stacked: true,
    foreColor: "#090E14",
    toolbar: {
      show: false,
      tools: {
        selection: true,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
    width: 591,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
    },
    radialBar: {
      hollow: {
        background: "#fff",
      },
      dataLabels: {
        name: {},
        value: {},
        total: {},
      },
    },
    pie: {
      donut: {
        labels: {
          name: {},
          value: {},
          total: {},
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontWeight: 700,
    },
  },
  fill: {
    type: "gradient",
    colors: ["#0EDCFE"],
    gradient: {
      opacityFrom: 0.8,
      opacityTo: 0.2,
    },
  },
  grid: {
    borderColor: "#ECF3FA",
    strokeDashArray: 5,
    padding: {
      top: -10,
      right: 20,
      left: 15,
    },
  },
  legend: {
    show: false,
    horizontalAlign: "left",
    fontWeight: 500,
    offsetX: -35,
    offsetY: 2,
    markers: {
      width: 16,
      height: 16,
      radius: 3,
    },
    itemMargin: {
      horizontal: 16,
      vertical: 16,
    },
  },
  markers: {
    hover: {
      size: 0,
      sizeOffset: 6,
    },
  },
  stroke: {
    curve: "smooth",
    colors: ["#0EDCFE", "#0EDCFE"],
  },
  xaxis: {
    offsetY: -3,
    offsetX: 8,
    tooltip: {
      enabled: false,
    },

    labels: {
      show: true,
      rotateAlways: false,
      hideOverlappingLabels: true,
      showDuplicates: false,
      trim: false,
      minHeight: undefined,
      maxHeight: 120,
      style: {
        colors: ["#121C25"],
        fontSize: "12px",
        fontFamily: "Roboto, sans-serif",
        fontWeight: 400,
        cssClass: "apexcharts-xaxis-label",
      },
      offsetX: 0,
      offsetY: 0,
      format: undefined,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    tickAmount: 5,
    title: {
      text: "",
      style: {
        fontWeight: 700,
      },
    },
  },
  tooltip: {
    enabled: false,
    style: {
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
    },
    marker: {
      width: 8,
      height: 8,
      strokeWidth: 0,
      strokeColor: "#0EDCFE",
      fillColors: ["#0EDCFE"],
      radius: 12,
    },
  },
});

function changeKeysInArray(arr: object[], keyMap: object) {
  return arr?.map((obj) => {
    const newObj = {};
    for (const oldKey in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (keyMap?.hasOwnProperty(oldKey)) {
        newObj[keyMap[oldKey]] = obj[oldKey] ? obj[oldKey] : 0;
      } else {
        newObj[oldKey] = obj[oldKey] ? obj[oldKey] : 0;
      }
    }
    return newObj;
  });
}

const hourKeyMap = {
  hour: "x",
  count: "y",
};
const monthKeyMapHour = {
  month: "x",
  count: "y",
};
const monthNames = [
  t("january_short"),
  t("february_short"),
  t("march_short"),
  t("april_short"),
  t("may_short"),
  t("june_short"),
  t("july_short"),
  t("august_short"),
  t("september_short"),
  t("october_short"),
  t("november_short"),
  t("december_short"),
];
const seriesToday = computed(() => {
  return [
    {
      name: "hour",
      data: changeKeysInArray(
        mainStore?.appUsageStats?.daily_statistics,
        hourKeyMap
      ),
    },
  ];
});
const seriesAll = computed(() => {
  return [
    {
      name: "month",
      data: changeKeysInArray(
        mainStore?.appUsageStats?.yearly_statistics,
        monthKeyMapHour
      )?.map((item) => ({
        x: monthNames[item?.x - 1], // Subtract 1 to match the array index
        y: item?.y,
      })),
    },
  ];
});
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 100);
});
</script>

<style>
.apexcharts-canvas {
  width: 100% !important;
  height: 100% !important;
}

.apexcharts-legend-series {
  display: flex !important;
  align-items: center !important;
}

.apexcharts-legend-marker {
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 14px !important;
  margin-right: 6px !important;
}

.apexcharts-legend-text {
  font-family: Roboto, sans-serif !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 14px !important;
  color: #8e9ba8 !important;
}

.apexcharts-legend-series:nth-child(1) ~ .apexcharts-legend-marker {
  background: red !important;
}
</style>
