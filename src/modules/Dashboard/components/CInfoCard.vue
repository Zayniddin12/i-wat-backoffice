<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import { formatMoneyDecimal } from "@/utils";

interface Props {
  card: {
    icon: string;
    count: number;
    title: string;
    class: string;
  };
}

defineProps<Props>();
</script>

<template>
  <CCard class="p-6">
    <div class="flex items-center space-x-3 mb-2">
      <div
        :class="card?.class"
        class="card w-10 h-10 p-2 flex items-center justify-center rounded-lg text-white"
      >
        <i :class="[card?.icon, 'text-xl text-white']" />
      </div>
      <div class="text-2xl font-bold text-dark">
        {{ formatMoneyDecimal(card?.count ?? 0, 0) }}
      </div>
    </div>
    <p class="text-sm font-normal text-gray-200">
      {{ card?.title }}
    </p>
  </CCard>
</template>

<style scoped>
.card {
  border-radius: 8px;
  border: 1.6px solid rgba(255, 255, 255, 0.17);
}

.plugin {
  background: #73cf11;
  box-shadow: 0px 4px 20px 0px rgba(115, 207, 17, 0.2);
}

.users {
  background: #0d9cd9;
  box-shadow: 0px 4px 20px 0px rgba(13, 156, 217, 0.2);
}

.cars {
  background: #ea8c1e;
  box-shadow: 0px 4px 20px 0px rgba(234, 140, 30, 0.2);
}

.transaction {
  background: #a159fd;
  box-shadow: 0px 4px 20px 0px rgba(161, 89, 253, 0.2);
}

.paid_cost {
  background: #20cc65;
  box-shadow: 0px 4px 20px 0px rgba(32, 204, 101, 0.2);
}

.used_kv {
  background: #f2b33a;
  box-shadow: 0px 4px 20px 0px rgba(242, 179, 58, 0.2);
}

.user {
  background: #e52e30;
  box-shadow: 0px 4px 20px 0px rgba(229, 46, 48, 0.2);
}

.station_owners {
  background: #02bfdf;
  box-shadow: 0px 4px 20px 0px rgba(2, 191, 223, 0.2);
}
</style>
