<script lang="ts" setup>
import Tooltip from "@/components/Common/Dropdown/Tooltip.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();
const showTooltip = ref(false);
</script>

<template>
  <span
    class="icon-crown relative text-yellow text-lg text-center cursor-pointer"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <Tooltip :show="showTooltip">
      <p class="text-sm text-white">{{ t("has_vip_status") }}</p>
    </Tooltip>
  </span>
</template>

<style scoped></style>
