import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/users",
    name: "PUsers",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Users/pages/PAll.vue"),
  },
  {
    path: "/users/:id",
    name: "PUsersSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Users/pages/PSingle.vue"),
  },
  {
    path: "/users/cars",
    name: "PUsersCars",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Users/pages/PUserMachines.vue"),
  },
];

export default routes;
