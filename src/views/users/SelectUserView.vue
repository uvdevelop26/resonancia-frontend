<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import AdminUser from "@/components/icons/AdminUser.vue";
import PacienteUser from "@/components/icons/PacienteUser.vue";
import gsap from "gsap";

const beforeEnter = (el) => {
  el.style.transform = "translateY(40px)";
  el.style.opacity = 0;
};

const enter = (el, done) => {
  gsap.to(el, {
    duration: 0.6,
    y: 0,
    opacity: 1,
    onComplete: done,
    delay: el.dataset.index * 0.1,
    ease: "power3.out",
  });
};
</script>

<template>
  <AppLayout :title="`Selecciona Usuario`">
    <template #content>
      <transition-group
        tag="div"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
        class="h-full w-full pt-8 flex flex-col items-center gap-4 md:flex-row md:items-start">
        <!-- cada elemento debe tener una clave (key) única para que Vue pueda rastrear el estado de cada elemento y aplicar las animaciones de manera correcta. -->
        <router-link
          class="w-full h-24 border-2 border-primary p-4 rounded-lg flex items-center gap-3 shadow-md group hover:bg-primary hover:border-primary-light max-w-60"
          to="/users/administrador"
          data-index="1"
          :key="'admin'">
          <div
            class="w-11 h-11 bg-primary rounded-full flex items-center justify-center group-hover:bg-white">
            <AdminUser class="w-4 h-4 fill-white group-hover:fill-primary" />
          </div>
          <span
            class="text-lg text-primary font-bold group-hover:text-primary-light">
            Administradores
          </span>
        </router-link>
        <router-link
          class="w-full h-24 border-2 border-primary p-4 rounded-lg flex items-center gap-3 shadow-md group hover:bg-primary hover:border-primary-light max-w-60"
          to="/users/paciente"
          data-index="2"
          :key="'paciente'">
          <div
            class="w-11 h-11 bg-primary rounded-full flex items-center justify-center group-hover:bg-white">
            <PacienteUser class="w-4 h-4 fill-white group-hover:fill-primary" />
          </div>
          <span
            class="text-lg text-primary font-bold group-hover:text-primary-light">
            Pacientes
          </span>
        </router-link>
      </transition-group>
    </template>
  </AppLayout>
</template>
