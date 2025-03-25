<template>
  <div class="flex items-center space-x-3 max-w-[200px]">
    <div
      class="rounded-lg justify-center items-center flex p-1 flex-none w-7 h-7"
      :class="{ 'border border-blue': !card?.image }"
    >
      <img
        v-if="card?.image"
        :src="card?.image"
        alt="card icon"
        class="w-5 object-cover"
      />
      <span v-else-if="card?.icon" :class="card?.icon" />
      <img v-else src="/images/svg/icon-car.svg" alt="icon car" />
    </div>
    <div
      class="transition-300"
      :class="{ 'cursor-pointer hover:text-primary': card?.id }"
      @click="linkToStation"
    >
      <p class="text-xs font-bold leading-none">{{ card?.title }}</p>
      <p class="text-xs font-bold leading-none">{{ card?.subtitle }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

interface Props {
  card: {
    id?: string;
    title: string;
    subtitle: string;
    tab?: string;
    icon?: string;
    image?: string;
  };
}

const props = defineProps<Props>();

const router = useRouter();

function linkToStation() {
  if (!props.card?.id) return;
  router.push({
    name: "PStationSingle",
    params: { id: props.card?.id },
    query: { isFromUser: props.card?.tab },
  });
}
</script>
<style></style>
