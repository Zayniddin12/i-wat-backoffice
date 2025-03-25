<template>
  <div
    :class="[avatarSize, avatarClass]"
    class="relative rounded-full before:rounded-full before:absolute before:inset-0 before:border-2 before:border-gray/50 overflow-hidden shrink-0"
  >
    <img
      v-if="!isError && !!image"
      :key="image"
      :class="imageClass"
      :src="image"
      alt="avatar-image"
      class="w-full h-full object-cover"
      @error="isError = true"
    />
    <img
      v-else
      :class="imageClass"
      alt="avatar-default-image"
      class="w-full h-full object-cover"
      src="/images/default-avatar.png"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { EAvatarSize } from "@/types/components/avatar";

interface Props {
  image?: string;
  size?: EAvatarSize;
  avatarClass?: string;
  imageClass?: string;
  loading?: boolean;
  isProfileDropdown?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: EAvatarSize.MD,
  avatarClass: "",
  imageClass: "",
});

const isError = ref(false);

watch(
  () => props.image,
  () => (isError.value = false)
);

const avatarSize = computed(() => {
  const sizes: Record<EAvatarSize, string> = {
    [EAvatarSize.MD]: "w-[50px] h-[50px]",
    [EAvatarSize.SM]: "w-10 h-10",
  };

  return sizes[props.size ?? EAvatarSize.MD];
});
</script>
