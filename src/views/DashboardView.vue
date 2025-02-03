<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import User from "@/components/icons/User.vue";
import Analisis from "@/components/icons/Analisis.vue";
import AngleRight from "@/components/icons/AngleRight.vue";
import { onMounted, ref } from "vue";
import { Utilities } from "@/js/Utilities";
import { Constants } from "@/js/Contants";
import axios from "axios";

const pacientes = ref(null);
const lastPaciente = ref({});
const examenes = ref(null);
const lastExamenes = ref([]);
const user = ref({});

const fetchData = async () => {
  try {
    const response = await axios.get(`${Constants.serverPath}/api/dashboard`);

    const userInfo = await axios.get(
      `${Constants.serverPath}/api/auth/userinfo`,
      {
        withCredentials: true, // Para enviar cookies al backend
      }
    );

    if (userInfo.data.user) {
      user.value = userInfo.data.user;
    }

    pacientes.value = response.data.pacienteUsers;
    lastPaciente.value = response.data.lastPaciente;
    examenes.value = response.data.examenes;
    lastExamenes.value = response.data.lastExamenes;
  } catch (error) {
    console.error("Error al obtener datos", error);
  }
};

onMounted(fetchData);
</script>

<template>
  <AppLayout title="Dashboard">
    <template #content>
      <div
        class="w-full h-full overflow-y-auto flex flex-col gap-4 relative md:flex-row md:items-start">
        <!-- cantidad de pacientes -->
        <div
          class="h-36 p-4 w-full bg-white border rounded-lg shadow relative max-w-96 md:h-44">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-primary text-lg font-semibold">
                Cantidad de Pacientes
              </h2>
              <span class="font-semibold text-4xl mt-1">{{ pacientes }}</span>
            </div>
            <router-link
              class="flex flex-col items-center group"
              to="/users/paciente">
              <User class="w-8 h-8 fill-primary group-hover:fill-black" />
              <span
                class="text-xs group-hover:underline group-hover:text-primary">
                Ver todo..
              </span>
            </router-link>
          </div>
          <h3
            class="text-xs text-gray-400 absolute left-4 bottom-4 italic font-semibold">
            Último registro en fecha
            {{ Utilities.getFormattedDate(lastPaciente.createdAt) }}
          </h3>
        </div>
        <!-- examenes -->
        <div
          class="p-4 border rounded-lg bg-white shadow relative w-full max-w-xl"
          v-if="user && user.rol === 'administrador'">
          <!-- Datos -->
          <div class="flex items-center justify-between">
            <div class="md:flex md:items-center md:gap-2">
              <h2 class="text-primary text-lg font-semibold">
                Cantidad de Exámenes Realizados
              </h2>
              <div class="md:flex md:items-center md:gap-2">
                <span class="font-semibold text-4xl mt-1">{{ examenes }}</span>
                <h3 class="text-xs mt-1 text-gray-400 italic font-semibold">
                  Últimos exámenes realizados:
                </h3>
              </div>
            </div>
            <router-link
              class="flex flex-col items-center group"
              to="/examenes">
              <Analisis class="w-8 h-8 fill-primary group-hover:fill-black" />
              <span
                class="text-xs group-hover:underline group-hover:text-primary">
                Ver todo..
              </span>
            </router-link>
          </div>
          <!-- últimos -->
          <div class="w-full overflow-x-auto rounded-lg bg-white mt-2">
            <table
              class="w-full text-sm whitespace-nowrap overflow-hidden border">
              <thead>
                <tr class="shadow text-sm border-b-2">
                  <th
                    class="py-1 px-4 text-gray-500 text-xs md:text-sm font-bold"
                    scope="col">
                    N°
                  </th>
                  <th
                    class="py-1 px-4 text-gray-500 text-xs md:text-sm font-bold"
                    scope="col">
                    Paciente
                  </th>
                  <th
                    class="py-1 px-4 text-gray-500 text-xs md:text-sm font-bold"
                    scope="col">
                    Fecha
                  </th>
                  <th
                    class="py-1 px-4 text-gray-500 text-xs md:text-sm font-bold"
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="h-14 text-center shadow group"
                  v-for="(lexamenes, index) in lastExamenes"
                  :key="lexamenes.id">
                  <td
                    class="py-1 px-4 text-xs md:text-sm bg-white border-t group-hover:bg-gray-100">
                    <router-link
                      class="flex w-full h-full"
                      :to="`/examenes/show/${lexamenes.id}`">
                      {{ index + 1 }}
                    </router-link>
                  </td>
                  <td
                    class="py-1 px-4 text-xs md:text-sm bg-white border-t group-hover:bg-gray-100">
                    <router-link
                      class="flex w-full h-full"
                      :to="`/examenes/show/${lexamenes.id}`">
                      {{ lexamenes.user.persona.nombre }}
                      {{ lexamenes.user.persona.apellido }}
                    </router-link>
                  </td>
                  <td
                    class="py-1 px-4 text-xs md:text-sm bg-white border-t group-hover:bg-gray-100">
                    <router-link
                      class="flex w-full h-full"
                      :to="`/examenes/show/${lexamenes.id}`">
                      {{ Utilities.getFormattedDate(lexamenes.createdAt) }}
                    </router-link>
                  </td>
                  <td
                    class="py-1 px-4 text-xs md:text-sm bg-white border-t group-hover:bg-gray-100">
                    <router-link
                      class="flex w-full h-full"
                      :to="`/examenes/show/${lexamenes.id}`">
                      <AngleRight class="w-auto h-2 fill-gray-500" />
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
