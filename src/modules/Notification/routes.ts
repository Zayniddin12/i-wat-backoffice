import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/notification",
    name: "PNotification",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Notification/page/PNotification.vue"),
  },
  {
    path: "/notification/add",
    name: "PNotificationAdd",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Notification/page/PNotificationAdd.vue"),
  },
  {
    path: "/notification/:id/edit",
    name: "PNotificationEdit",
    meta: {
      layout: "default",
    },
    component: () =>
      import("@/modules/Notification/page/PNotificationEdit.vue"),
  },
];

export default routes;
