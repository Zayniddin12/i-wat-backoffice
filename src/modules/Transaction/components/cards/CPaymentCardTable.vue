<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{
  data: {
    variant: string;
  };
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="w-7 h-7 p-1 flex items-center justify-center border border-gray bg-white rounded-lg"
    >
      <img
        v-if="data?.variant === 'payme'"
        src="@/assets/images/payment-type/payme.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else-if="data?.variant === 'paylov'"
        src="@/assets/images/payment-type/paylov.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else-if="data?.variant === 'humo'"
        src="@/assets/images/payment-type/humo.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else-if="data?.variant === 'card'"
        src="@/assets/images/payment-type/uzcard.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else-if="data?.variant === 'uzum'"
        src="@/assets/images/payment-type/uzum.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else-if="data?.variant === 'Charging'"
        src="/public/favicon.svg"
        :alt="data?.variant"
        class="w-full object-cover"
      />
      <img
        v-else
        src="@/assets/images/payment-type/uzcard.png"
        :alt="data?.variant"
        class="w-full object-cover"
      />
    </div>
    <div class="flex flex-col gap-0.5">
      <div>
        <span
          v-if="data?.variant == 'Charging'"
          class="text-dark text-sm font-bold leading-130 hover:text-primary transition-300"
          >{{ data?.variant }}</span
        >
        <span
          v-else
          class="text-dark text-sm font-bold leading-130 hover:text-primary transition-300"
          >{{ t(`payment_types.${data?.variant}`) }}</span
        >
      </div>
      <span
        v-if="data?.variant === 'card' || data?.variant === 'humo'"
        class="text-gray-300 text-xs leading-130"
        >powered by Paylov</span
      >
    </div>
  </div>
</template>

<style scoped></style>
