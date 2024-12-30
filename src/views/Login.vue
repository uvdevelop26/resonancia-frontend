<script setup>
import Logo from "@/components/icons/Logo.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import axios from "axios";
import TextInput from "@/components/TextInput.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Utilities } from "@/js/Utilities";
import { Constants } from "@/js/Contants";

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const errors = ref({});
const message = ref("");

/* funciones */

const close = () => {
  Utilities.close(message);
};

const login = async () => {
  try {
    const response = await axios.post(
      `${Constants.serverPath}/api/auth/login`,
      form.value,
      { withCredentials: true }
    );

    /*  localStorage.setItem("jwt", response.data.token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`; */

    message.value = response.data.msg;

    const data = response.data.user;

    if (data) {
      router.push("/dashboard");
    }
  } catch (error) {
    if (error.response) {
      message.value = error.response.data.msg;

      if (error.response.data.errors) {
        errors.value = Utilities.manageValidationErrors(
          error.response.data.errors
        );
      }

      console.error("Error en el login:");
    }
  }
};
</script>

<template>
  <div
    class="w-full h-full bg-primary flex items-end relative md:items-center md:justify-center">
    <FlashMessage
      v-if="message"
      type="error"
      :message="message"
      title="Error de Acceso"
      @close="close"
    />
    <div
      class="w-full flex flex-col md:flex-row md:w-[598px] md:rounded-2xl overflow-hidden md:shadow-2xl">
      <!-- logo -->
      <div
        class="h-52 md:h-auto flex items-center justify-center md:bg-primary-light md:flex-1">
        <div
          class="p-3 bg-white rounded-tl-xl rounded-bl-xl rounded-br-xl md:bg-primary">
          <Logo class="w-12 h-12 fill-primary md:fill-white" />
        </div>
      </div>
      <!-- formulario -->
      <div
        class="bg-white h-[25rem] px-4 rounded-tl-[6rem] flex flex-col justify-center items-center md:rounded-tl-none md:flex-1">
        <h1 class="text-2xl font-bold text-primary italic">Login</h1>
        <form @submit.prevent="login" class="flex flex-col w-full px-4">
          <TextInput
            label="Email"
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            v-model="form.email"
            :error="errors.email"
          />
          <TextInput
            class="mt-2"
            label="Contraseña"
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            v-model="form.password"
            :error="errors.password"
          />
          <div
            class="mt-8 h-10 w-full overflow-hidden rounded-lg bg-primary shadow-md group hover:bg-primary-light">
            <button
              type="submit"
              class="w-full h-full text-white font-bold hover:text-primary">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
