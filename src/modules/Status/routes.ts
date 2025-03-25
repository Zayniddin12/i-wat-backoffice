import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/live-status",
    name: "PStatus",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Status/page/PIndex.vue"),
  },
];

export default routes;
