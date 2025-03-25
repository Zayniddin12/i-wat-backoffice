import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    meta: {
      layout: "static",
    },
    component: () => import("@/modules/Static/page/PrivacyPolice.vue"),
  },
];

export default routes;
