<template>
  <div class="flex-y-center gap-3">
    <CAvatar :image="card?.avatar" avatar-class="!w-8 !h-8 before:border" />
    <div>
      <div>
        <router-link :to="card?.userLink">
          <div class="flex items-center gap-1">
            <h5
              class="font-medium text-dark text-sm leading-130 mb-0.5 hover:text-primary transition-300 hover:underline"
            >
              {{ card?.full_name }}
            </h5>
            <div v-if="isAdmin" class="bg-gray py-[1px] px-1 rounded">
              <span class="text-gray-200 font-medium text-[10px]">{{
                t("admin")
              }}</span>
            </div>
            <span
              v-if="card.is_birth_date"
              class="icon-cake text-blue-200 text-sm"
            />
            <img
              v-if="isBirthday"
              src="/images/cake.png"
              alt="cake"
              class="w-[11px] object-cover mb-0.5"
            />
          </div>
        </router-link>
        <slot name="feature"></slot>
      </div>
      <p class="text-xs text-gray-300 leading-130">
        {{ card?.phone_number }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";
import { useI18n } from "vue-i18n";
import { ca } from "date-fns/locale";

interface ICard {
  id?: number;
  full_name: string;
  avatar: string;
  phone_number: string;
  is_birth_date: boolean;
  userLink?: string;
}

interface Props {
  card: ICard;
  isBirthday?: boolean;
  isAdmin?: boolean;
}

defineProps<Props>();

const { t } = useI18n();
</script>
