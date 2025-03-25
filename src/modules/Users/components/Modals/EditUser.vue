<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch } from "vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import { allStatus } from "@/modules/Users/data";
import CButton from "@/components/Common/CButton.vue";
import { IUser } from "@/modules/Auth/types";
import { formatPhoneNumber } from "@/utils";

interface Props {
  show: boolean;
  user: IUser;
  loading?: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  (event: "close"): void;
  (event: "submit", value: any): void;
}>();

const data = reactive({
  is_active: "",
  is_admin: false,
});

watch(
  () => props.user,
  () => {
    data.is_active = String(props.user.active_status);
    data.is_admin = !!props.user.is_admin;
  }
);
</script>

<template>
  <div>
    <CDialog
      :show="show"
      @close="() => $emit('close')"
      :title="$t('edit_user_modal.title')"
      body-class="!w-[421px]"
    >
      <template #default>
        <form @submit.prevent class="grid grid-cols-1 px-5 pt-4 pb-5 gap-5">
          <FGroup :label="$t('edit_user_modal.user')">
            <div class="flex items-center px-3 py-2 bg-gray rounded-lg gap-2">
              <img
                v-if="user?.avatar_url"
                :src="user?.avatar_url"
                :alt="user?.full_name ?? 'image of user'"
                class="w-9 h-9 rounded-full object-cover"
              />
              <img
                v-else
                alt="avatar-default-image"
                class="w-9 h-9 rounded-full object-cover"
                src="/images/default-avatar.png"
              />
              <h5
                v-if="user?.full_name"
                class="text-sm font-medium leading-130 text-dark"
              >
                {{ user?.full_name }}
              </h5>
            </div>
          </FGroup>

          <FGroup
            v-if="user?.phone"
            :label="$t('edit_user_modal.phone_number')"
          >
            <div
              class="h-10 p-3 bg-gray text-sm font-normal leading-130 text-dark rounded-lg"
            >
              {{ formatPhoneNumber(user?.phone) }}
            </div>
          </FGroup>

          <FGroup :label="$t('edit_user_modal.status')">
            <FSelect
              :options="allStatus().slice(1)"
              v-model="data.is_active"
              selected-option-styles="!bg-gray !h-10 border-transparent"
              label-key="label"
              value-key="value"
              @change="data.is_active = $event"
              is-checked
            />
          </FGroup>

          <FCheckbox
            :checked="data.is_admin"
            @change="data.is_admin = $event"
            :label="$t('edit_user_modal.checkbox')"
          />

          <div class="flex items-center gap-3 justify-end">
            <CButton
              :text="$t('cancel')"
              variant="info"
              @click="() => $emit('close')"
            />
            <CButton
              :loading="loading"
              :text="$t('save')"
              @click="$emit('submit', data)"
            />
          </div>
        </form>
      </template>
    </CDialog>
  </div>
</template>

<style scoped></style>
