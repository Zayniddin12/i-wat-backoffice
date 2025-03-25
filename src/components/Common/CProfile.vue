<script setup lang="ts">
import { computed } from "vue";
import { formatPhoneNumber } from "@/utils";

interface Props {
  user: {
    image: string;
    fullName?: string;
    phone?: string;
    job?: string;
  };
  userType: "profile" | "profile-card";
  noBg?: boolean;
}

const props = defineProps<Props>();

const isProfile = computed(() => props.userType === "profile");
</script>

<template>
  <div
    class="flex items-center space-x-1.5"
    :class="[
      { 'py-1 px-1.5 bg-gray rounded-lg': isProfile },
      { '!bg-transparent': noBg },
    ]"
  >
    <div>
      <img
        :src="user.image ?? '/images/default-user.svg'"
        :alt="'user image of' + user?.fullName"
        class="w-8 h-8 object-cover border border-gray/[60] rounded-full"
        :class="{ '!w-9 !h-9 !p-0 !bg-transparent': isProfile }"
      />
    </div>
    <div>
      <a
        :href="isProfile ? '#' : `tel:${user?.phone}`"
        class="text-dark text-xs font-medium leading-130 cursor-pointer hover:text-primary transition-300"
        :class="{ '!mb-0.5': userType === 'profile' }"
      >
        {{ isProfile ? user?.fullName : formatPhoneNumber(user?.phone) }}
      </a>
      <p
        class="text-gray-100 text-xxs font-normal leading-130 line-clamp-1"
        :class="{ '!text-xs': userType === 'profile' }"
      >
        {{
          isProfile
            ? formatPhoneNumber(user?.phone)
            : user?.job ?? user?.fullName
        }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
