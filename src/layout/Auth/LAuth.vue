<template>
  <div class="grid grid-cols-9">
    <div
      class="relative flex col-span-5 items-center flex-col justify-between py-12 overflow-y-scroll max-h-screen gap-4"
    >
      <div>
        <img alt="logo" src="/images/svg/logo.svg" />
      </div>
      <slot />

      <div class="text-center flex flex-col gap-3">
        <RouterLink
          class="text-xs font-normal underline text-gray-200 leading-normal"
          target="_blank"
          to="/privacy-policy"
        >
          {{ $t("privacy_policy") }}
        </RouterLink>
        <p class="text-xs leading-normal text-gray-200">
          {{ $t("version") }} {{ CONFIG.APP_VERSION }}
        </p>
      </div>
    </div>
    <div
      class="col-span-4 w-full h-screen bg-primary bg-image relative flex flex-col items-center justify-between"
    >
      <SUicLogo class="absolute-x bottom-24" main-color="#fff" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SUicLogo from "@/components/Logo/CUicLogo.vue";
import { CONFIG } from "@/config";
</script>

<style scoped>
.bg-image {
  background-image: url("/images/svg/bg_png.webp");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
