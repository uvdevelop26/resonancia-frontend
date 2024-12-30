<script setup>
import Warning from "@/components/icons/Warning.vue";
import ArrowLeft from "@/components/icons/ArrowLeft.vue";
</script>
<template>
  <div class="min-h-full flex items-center justify-center bg-primary-light">
    <div class="flex flex-col items-center gap-2 font-bold text-primary">
      <Warning class="h-56 fill-primary" />
      <div class="text-3xl">404</div>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <router-link
        to="/"
        class="w-36 h-8 text-sm text-white font-bold bg-primary flex items-center gap-1 justify-center rounded-lg shadow-lg hover:bg-white hover:text-primary hover:border group">
        <ArrowLeft class="w-3 fill-white group-hover:fill-primary" />
        Volver a Login
      </router-link>
    </div>
  </div>
</template>
