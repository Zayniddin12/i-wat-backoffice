<script lang="ts" setup>
import apiService from "@/services/ApiService";
import { ref } from "vue";

const staticContent = ref<{ title: string; body_html: string }>();

const fetchStaticContent = async () => {
  const response = await apiService.get("/static-pages/privacy-policy");
  staticContent.value = response.data;
};

fetchStaticContent();
</script>

<template>
  <main>
    <h1 class="text-2xl leading-130 font-semibold text-dark mb-3">
      {{ staticContent?.title }}
    </h1>
    <div v-html="staticContent?.body_html"></div>
  </main>
</template>

<style scoped></style>
