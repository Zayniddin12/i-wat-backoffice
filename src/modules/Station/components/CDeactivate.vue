<template>
  <div>
    <span class="bg-gray block h-[1px] w-full" />

    <div class="p-5">
      <p class="text-sm text-gray-100 mb-4">{{ $t("deactivate_question") }}</p>
      <div class="p-3 border border-gray rounded-[10px]">
        <p class="text-xs text-gray-100 font-medium mb-2">
          {{ $t("users_module.cars.model") }}:
        </p>
        <CCar
          class="mb-4"
          :car="{
            name: data?.manufacturer_name,
            model: data?.model_name,
            image: data?.manufacturer_icon,
          }"
        />
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-gray-100 font-medium mb-2">
              {{ $t("edit_user_modal.user") }}
            </p>
            <p class="text-xs">
              {{ formatPhoneNumber(data?.user?.phone ?? "+998 90 100 00 00") }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-100 font-medium mb-2">
              {{ $t("current_power") }}
            </p>
            <p class="text-xs">{{ data?.voltage ?? 0.0 }} kWt</p>
          </div>
        </div>
      </div>
    </div>

    <span class="bg-gray block h-[1px] w-full" />

    <div class="space-x-4 m-5 mt-5 flex items-center justify-end">
      <CButton variant="info" :text="$t('cancel')" @click="$emit('cancel')" />
      <CButton
        variant="warning"
        :text="$t('stop_charging')"
        @click="$emit('submit')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CCar from "@/components/Card/CCar.vue";
import CButton from "@/components/Common/CButton.vue";
import { formatPhoneNumber } from "@/utils";

defineProps<{
  data: any;
}>();

defineEmits(["cancel", "submit"]);
</script>
