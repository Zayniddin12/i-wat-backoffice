import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/settings/mark",
    name: "PMark",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Settings/page/PMark.vue"),
  },
  {
    path: "/settings/model",
    name: "PModel",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Settings/page/PModel.vue"),
  },
  {
    path: "/settings/charging-types",
    name: "PChargingTypes",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Settings/page/PChargingTypes.vue"),
  },
];

export default routes;
