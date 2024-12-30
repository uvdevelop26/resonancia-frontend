<script setup>
import ChevronDown from "../icons/ChevronDown.vue";
import Home from "../icons/Home.vue";
import User from "../icons/User.vue";
import Analisis from "../icons/Analisis.vue";
import Logo from "../icons/Logo.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "@/router";
import { Constants } from "@/js/Contants";

const props = defineProps({
  title: String,
});

const user = ref({ nombre: '', apellido: '' });

const openSubmenu = ref(false);

const isActive = (path) => {
  const currentPath = router.currentRoute.value.fullPath;
  return currentPath.startsWith(path) ? true : false;
};

const activeClasess = `before:content-[''] before:absolute before:w-0 before:h-0 before:border-l-[20px] before:border-r-[20px] before:border-t-[37px] before:border-t-gray-100 before:border-l-transparent before:border-r-transparent before:left-1/2 before:-translate-x-1/2 before:-top-6 lg:before:border-l-[24px] lg:before:border-r-[24px] lg:before:border-t-[48px] lg:before:top-1/2 lg:before:-translate-y-1/2 lg:before:rotate-90 lg:before:left-auto lg:before:translate-x-0 lg:before:-right-9 `;

const logout = async () => {
  try {
    const response = await axios.get(
      `${Constants.serverPath}/api/auth/logout`,
      {
        withCredentials: true, // Asegura que las cookies se envíen al backend
      }
    );

    const message = response.data.msg;

    if (message) {
      router.push("/");
    }
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
};

async function fetchUser() {
  try {
    const response = await axios.get(
      `${Constants.serverPath}/api/auth/userinfo`,
      {
        withCredentials: true, // Para enviar cookies al backend
      }
    );

    if (response.data.user) {
      user.value = response.data.user;
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
}

onMounted(fetchUser);
</script>
<template>
  <div
    class="w-full h-full py-4 px-4 bg-primary flex flex-col justify-between gap-3 lg:flex-row-reverse">
    <!-- content -->
    <div
      class="h-full w-full py-4 md:py-6 bg-gray-100 rounded-xl overflow-y-auto lg:rounded-2xl">
      <div class="h-full w-full flex flex-col gap-3 container">
        <header
          class="h-16 p-4 flex justify-between items-center rounded-xl shadow bg-primary lg:rounded-2xl">
          <div class="flex items-center gap-1 lg:hidden">
            <span class="font-bold text-white">Resonplus</span>
            <Logo class="w-4 h-4 fill-white" />
          </div>
          <div class="hidden lg:flex">
            <h1 class="font-bold text-white text-2xl">{{ props.title }}</h1>
          </div>
          <div class="relative">
            <button
              @click="openSubmenu = !openSubmenu"
              type="button"
              class="flex py-2 pl-7 pr-4 bg- gap-2 rounded-2xl border shadow relative bg-white hover:bg-primary-light group transition-all duration-75">
              <div
                class="w-9 h-9 rounded-full border-primary-light overflow-hidden absolute -left-3 top-1/2 -translate-y-1/2">
                <img
                  src="/images/uv.png"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex items-center gap-1" v-if="user">
                <span class="text-xs group-hover:text-primary"> 
                  {{ user.nombre }} {{ user.apellido }}
               </span>
                <ChevronDown class="w-2 h-2" />
              </div>
            </button>
            <div
              class="w-32 h-20 absolute left-1/2 -translate-x-1/2 -bottom-[5.1rem] bg-white rounded-lg shadow-md overflow-hidden z-50"
              v-if="openSubmenu">
              <button
                @click="logout"
                class="inline-block w-full border-b text-center py-2 px-2 hover:bg-primary-light hover:text-primary text-xs text-gray-500 font-bold md:text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <!-- slot, render the component -->
        <div class="w-full h-full overflow-y-auto">
          <slot name="content" />
        </div>
      </div>
    </div>
    <!-- nav -->
    <nav class="h-14 w-full bg-primary lg:h-full lg:w-[5vw] xl:w-[5.5vw]">
      <div
        class="hidden w-full pb-3 pt-6 lg:flex lg:items-center lg:justify-center">
        <div
          class="bg-white p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow">
          <Logo class="w-7 h-7 fill-primary" />
        </div>
      </div>
      <div class="w-full h-full flex lg:flex-col lg:gap-2">
        <div
          class="w-full h-full lg:h-20 relative"
          :class="isActive('/dashboard') ? activeClasess : ''">
          <router-link
            to="/dashboard"
            class="w-full h-full flex items-center justify-center">
            <Home class="w-7 h-7 fill-white" />
          </router-link>
        </div>
        <div
          class="w-full h-full lg:h-20 relative"
          :class="isActive('/examenes') ? activeClasess : ''">
          <router-link
            to="/examenes"
            class="w-full h-full flex items-center justify-center">
            <Analisis class="w-7 h-7 fill-white" />
          </router-link>
        </div>
        <div
          v-if="user && user.rol === 'administrador'"
          class="w-full h-full lg:h-20 relative"
          :class="isActive('/users') ? activeClasess : ''">
          <router-link
            to="/users/select"
            class="w-full h-full flex items-center justify-center">
            <User class="w-7 h-7 fill-white" />
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>
