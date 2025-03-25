import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/transaction",
    name: "PTransaction",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Transaction/pages/PTransactions.vue"),
  },
  {
    path: "/transaction/history",
    name: "PTransactionHistory",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Transaction/pages/PHistoryCharging.vue"),
  },
  {
    path: "/transaction/history/parking",
    name: "PTransactionHistoryParking",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Transaction/pages/PHistoryParking.vue"),
  },
];

export default routes;
