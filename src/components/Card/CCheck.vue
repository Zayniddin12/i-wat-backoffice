<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  transaction: {
    id: string;
    method: string;
    date: string;
    merchant_id: string;
    commission: string;
    amount: string;
    paid: string;
  };
}

defineProps<Props>();
const { t } = useI18n();

const pattern = ref();
</script>

<template>
  <div>
    <ul class="list1">
      <li>
        {{ t("transaction_date") }}:
        <span>
          {{ transaction?.date }}
        </span>
      </li>
      <li>
        {{ t("transaction_method") }}:
        <span>
          {{ transaction?.method }}
        </span>
      </li>
      <li>
        {{ t("transaction_id") }}:
        <span>
          {{ transaction?.id }}
        </span>
      </li>
      <li>
        {{ t("transaction_merchant_id") }}:
        <span>
          {{ transaction?.merchant_id }}
        </span>
      </li>
      <li class="line"></li>
      <li>
        {{ t("transaction_commission") }}:
        <span>
          {{ transaction?.commission }}
        </span>
      </li>
      <li>
        {{ t("transaction_amount") }}:
        <span>
          {{ transaction?.amount }}
        </span>
      </li>
    </ul>
    <div ref="pattern" class="check-pattern"></div>
    <ul>
      <li class="!text-gray-200 !font-semibold">
        {{ t("transaction_paid_amount") }}:
        <span class="!text-2xl">
          {{ transaction?.paid }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  @apply flex flex-col items-center justify-center p-4 bg-white border rounded-md border-[#EDF0F2];
}

li {
  @apply w-full flex justify-between items-center mb-2.5 text-gray-300 text-base font-normal leading-130;
}

span {
  @apply text-dark text-base font-semibold leading-130 text-right;
}

.line {
  @apply w-full h-[1px] bg-[#EDF0F2] mt-1.5 mb-4;
}
</style>
