<script lang="ts" setup>
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CButton from "@/components/Common/CButton.vue";
import CCard from "@/components/Card/CCard.vue";
import CCheckWrapper from "@/components/CCheckWrapper.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps<{
  show: boolean;
  upper: Record<string, any>;
  lower: Record<string, any>;
  total: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const cleanedUpper = computed(() => {
  return Object.fromEntries(
    Object.entries(props.upper).map(([key, value]) => [
      key,
      value === "payment_types.Charging" ? "Charging" : value,
    ])
  );
});
</script>

<template>
  <CDialog
    :show="props.show"
    :title="t('check.title')"
    body-class="!max-w-[421px]"
    headerStyle="!border-none"
    @close="emit('close')"
  >
    <CCard class="p-5 pt-1.5">
      <CCheckWrapper>
        <template #info>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="(item, key, i) in cleanedUpper"
              :key="i"
              class="flex justify-between"
            >
              <p class="text-gray-300">{{ t(`check.${key}`) }}:</p>
              <p class="max-w-[232px] font-semibold text-end">{{ item }}</p>
            </li>
          </ul>
          <span
            v-if="Object.keys(props.lower).length"
            class="my-4 h-[1px] bg-gray w-full block"
          />
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="(item, key, i) in props.lower"
              :key="i"
              class="flex justify-between"
            >
              <p class="text-gray-300">{{ t(`check.${key}`) }}:</p>
              <p class="max-w-[232px] font-semibold text-end">{{ item }}</p>
            </li>
          </ul>
        </template>
        <template #paid>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-200">
              {{ t("charging_transactions.table.paid_amount") }}:
            </span>
            <span class="text-2xl font-semibold">{{ props.total }}</span>
          </div>
        </template>
      </CCheckWrapper>
      <CButton
        :text="t('close')"
        class="w-full"
        type="button"
        variant="primary"
        @click="() => emit('close')"
      />
    </CCard>
  </CDialog>
</template>

<style scoped></style>
