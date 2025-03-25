import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "PDashboard",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Dashboard/pages/PDashboard.vue"),
  },
  {
    path: "/active-users",
    name: "PActiveUsers",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Dashboard/pages/PActiveUsers.vue"),
  },
];

export default routes;
