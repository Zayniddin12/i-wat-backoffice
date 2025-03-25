import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/stations",
    name: "PStations",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Station/page/PIndex.vue"),
  },
  {
    path: "/station/:id",
    name: "PStationSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Station/page/PSingle.vue"),
  },
  {
    path: "/station/add",
    name: "PStationAdd",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Station/page/PAdd.vue"),
  },
];

export default routes;
