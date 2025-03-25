<template>
  <div
    class="max-h-[56px] border py-2 px-3 rounded-md border-dashed border-gray-300/40 group flex-y-center gap-2"
    :class="{
      'bg-primary-100 !border-solid !border-primary/20': active,
      '!py-1 !px-1.5': mini,
    }"
  >
    <CPreloader width="32px" height="32px" v-bind="{ loading }" v-if="image">
      <CAvatar class="!w-8 !h-8" v-if="image" v-bind="{ image }" />
    </CPreloader>
    <div>
      <slot>
        <CPreloader width="120px" height="18px" v-bind="{ loading }">
          <div class="flex items-center gap-1">
            <slot name="icon" />
            <p
              class="text-sm font-medium text-dark leading-130"
              :class="{ '!text-xs': mini }"
            >
              {{ title }}
            </p>
          </div>
        </CPreloader>
      </slot>
      <CPreloader width="100px" height="17px" v-bind="{ loading }">
        <p
          class="text-gray-200 text-2xs font-normal leading-130 truncate"
          :class="[descriptionClass, { '!text-[11px]': mini }]"
        >
          {{ t(description) }}
        </p>
      </CPreloader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CAvatar from "@/components/CAvatar.vue";
import CPreloader from "@/components/CPreloader.vue";

interface Props {
  title?: string;
  description: string;
  image?: boolean;
  descriptionClass?: string;
  loading?: boolean;
  active?: boolean;
  mini?: boolean;
}

const { t } = useI18n();

withDefaults(defineProps<Props>(), {
  title: "No title",
  description: "No subtitle",
});
</script>
