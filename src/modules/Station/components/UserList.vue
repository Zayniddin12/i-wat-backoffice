<script lang="ts" setup>
import CProfile from "@/components/Common/CProfile.vue";
import CDropdown from "@/components/Common/Dropdown/CDropdown.vue";
import { Owner } from "@/modules/Station/types/interface";

defineProps<{
  users: Owner[];
}>();
</script>

<template>
  <div class="flex items-center flex-wrap gap-4 pl-3">
    <template v-if="users?.length > 1">
      <CProfile
        v-for="(item, i) in users?.slice(0, 2)"
        :key="i"
        :user="{
          image: item.avatar_url,
          phone: item.phone,
          fullName: item.full_name,
        }"
        class="bg-gray px-1.5 py-1.5 rounded-lg"
        user-type="profile-card"
      />
    </template>
    <CDropdown v-if="users?.length > 2">
      <template #head>
        <div
          class="py-[5px] pl-2.5 pr-2 rounded-md border border-transparent bg-gray group duration-200 flex items-center gap-2 justify-between cursor-pointer"
        >
          <div>
            <p class="text-xs font-medium">+{{ users?.length - 2 }}</p>
            <p class="text-xxs text-gray-300">
              {{ $t("owners") }}
            </p>
          </div>

          <i
            class="icon-chevron duration-200 text-gray-100 group-focus:rotate-180"
          ></i>
        </div>
      </template>

      <template #default>
        <div
          v-if="users.length"
          class="bg-white rounded-lg box-shadow flex flex-col py-2 max-h-[202px] overflow-scroll"
        >
          <div v-for="(item, i) in users.slice(2)" :key="i">
            <CProfile
              :user="{
                image: item.avatar_url,
                phone: item.phone,
                fullName: item.full_name,
              }"
              class="p-1 pl-4 pr-4"
              user-type="profile-card"
            />
            <span
              v-if="i < users?.length - 3"
              class="h-[1px] my-1 block w-36 bg-gray ml-auto"
            />
          </div>
        </div>
      </template>
    </CDropdown>
  </div>
</template>

<style scoped></style>
