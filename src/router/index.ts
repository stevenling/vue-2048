import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "app",
    component: () => import("../views/index.vue"),
  },
  {
    path: "/scoreRank",
    name: "ScoreRank",
    component: () => import("../views/ScoreRank.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});