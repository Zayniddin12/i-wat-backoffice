<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show: boolean;
  type: "lock" | "unlock";
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (event: "cancel"): void;
  (event: "block"): void;
  (event: "unblock"): void;
  (event: "close"): void;
}>();

const checkStatus = () => {
  if (props.type === "lock") {
    emits("block");
  } else {
    emits("unblock");
  }
  emits("close");
};
</script>

<template>
  <CDialog :show="show" no-header body-class="!max-w-[421px]">
    <template #default>
      <section class="flex items-center justify-center flex-col p-5 gap-5">
        <div
          class="w-[72px] h-[72px] flex items-center justify-center p-4 rounded-full"
          :class="type === 'lock' ? 'bg-[#FFF2F2]' : 'bg-[#FFF7E7]'"
        >
          <img
            v-if="type === 'lock'"
            src="@/assets/svg/lock.svg"
            alt="image of lock"
            class="w-full h-full"
          />

          <img
            v-else
            src="@/assets/svg/unlock.svg"
            alt="image of unlock"
            class="w-full h-full"
          />
        </div>
        <div>
          <h1
            class="mb-2 text-dark text-xl font-medium leading-130 text-center"
          >
            {{
              type === "lock"
                ? $t("user_block.title")
                : $t("user_unblock.title")
            }}
          </h1>
          <p class="text-gray-200 text-sm font-normal leading-130 text-center">
            {{
              type === "lock"
                ? $t("user_block.subtitle")
                : $t("user_unblock.subtitle")
            }}
          </p>
        </div>
        <div class="w-full grid grid-cols-2 gap-3">
          <CButton
            :text="$t('cancel')"
            info
            @click="() => $emit('cancel')"
            variant="info"
          />
          <CButton
            :text="type === 'lock' ? $t('lock') : $t('unlock')"
            :variant="type === 'lock' ? 'error' : 'yellow'"
            @click="checkStatus"
          />
        </div>
      </section>
    </template>
  </CDialog>
</template>

<style scoped></style>
