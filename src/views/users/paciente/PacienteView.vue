<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import Edit from "@/components/icons/Edit.vue";
import Delete from "@/components/icons/Delete.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import QuestionFlash from "@/components/QuestionFlash.vue";
import SearchInput from "@/components/SearchInput.vue";
import { ref, onMounted, watchEffect } from "vue";
import { Utilities } from "@/js/Utilities";
import { Animations } from "@/js/Aminations";
import axios from "axios";

//variables reactivas
const users = ref([]);
const filteredUsers = ref([]);
const message = ref("");
const questionFlashIndex = ref(null);
const pacientesSearch = ref([]);
const search = ref("");

//funciones
const close = () => {
  Utilities.close(message);
};

watchEffect(() => {
  const value = search.value;

  if (value === "") {
    filteredUsers.value = users.value;
  }
});

const action = () => {
  const dni = Utilities.getDniFromString(search);

  filteredUsers.value = filteredUsers.value.filter(
    (fill) => fill.persona.dni === dni
  );
};

//llamadas al backed
const deleteUser = async (slug) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/users/delete/${slug}`
    );

    questionFlashIndex.value = null;

    setTimeout(() => {
      message.value = response.data.msg;
    }, 300);

    // Filtra el usuario eliminado de la lista de usuarios
    filteredUsers.value = filteredUsers.value.filter(
      (user) => user.slug !== slug
    );
    users.value = users.value.filter((user) => user.slug !== slug);

    // Actualiza la lista de búsqueda
    pacientesSearch.value = pacientesSearch.value.filter(
      (persona) =>
        persona.dni !==
        filteredUsers.value.find((user) => user.slug === slug)?.persona.dni
    );
    // Reinicia el valor de búsqueda
    search.value = "";
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/paciente"
    );

    //valor permanente
    users.value = response.data;

    //valor para filtro
    filteredUsers.value = response.data;

    //filtro para la búsqueda
    response.data.forEach((res) => {
      pacientesSearch.value.push(res.persona);
    });
  } catch (error) {
    console.error("Error al obtener los datos", error);
  }
};

onMounted(fetchUsers);
</script>
<template>
  <AppLayout :title="`Lista de Pacientes`">
    <template #content>
      <div class="w-full h-full overflow-y-auto flex flex-col gap-5 relative">
        <!-- flash message -->
        <FlashMessage
          v-if="message"
          type="success"
          title="Operación Exitosa"
          :message="message"
          @close="close"
        />

        <div
          class="w-full flex justify-between gap-2 items-center mt-4 md:gap-8">
          <!-- search bar -->
          <SearchInput
            placeholder="Busca por nombre, apellido o CI. Selecciona en la lista"
            id="search"
            v-model="search"
            :data="pacientesSearch"
            :criteria="['nombre', 'apellido', 'dni']"
            @action="action"
            background="bg-white"
            maxWidth="3xl"
            top="full-1"
          />
          <router-link
            to="/users/paciente/create"
            class="w-28 h-8 text-white font-bold bg-primary flex items-center justify-center rounded-lg shadow-lg hover:bg-primary-light hover:text-primary hover:border">
            Crear
          </router-link>
        </div>
        <!-- table -->
        <div class="w-full overflow-x-auto rounded-lg bg-white shadow-md">
          <table class="w-full text-sm whitespace-nowrap overflow-hidden">
            <thead>
              <tr class="h-12 shadow text-sm border-b-2">
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  N°
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Nombre
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Apellido
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  CI
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Ciudad
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Dirección
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Correo
                </th>
                <th
                  class="py-3 px-4 text-gray-500 text-xs md:text-sm font-bold">
                  Acciones
                </th>
              </tr>
            </thead>
            <transition-group
              tag="tbody"
              @before-enter="Animations.tableBeforeEnter"
              @enter="Animations.tableEnter"
              appear>
              <template v-if="users.length === 0">
                <tr>
                  <td
                    colspan="8"
                    class="px-6 py-4 text-center text-sm text-gray-500">
                    NO SE HAN REGISTRADO USUARIOS DE ESTA CATEGORÍA.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr
                  class="h-14 text-center shadow group border-b-2"
                  v-for="(user, index) in filteredUsers"
                  :key="user.id"
                  :data-index="index">
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.persona.nombre }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.persona.apellido }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.persona.dni }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs capitalize md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.persona.ciudad.nombre_ciudad }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.persona.direccion }}
                  </td>
                  <td
                    class="py-1 px-1 text-xs md:text-sm bg-white group-hover:bg-gray-100">
                    {{ user.email }}
                  </td>
                  <td
                    class="py-1 px-1 text-sm md:text-xs bg-white group-hover:bg-gray-100">
                    <div
                      class="w-full h-full flex items-center justify-center gap-2">
                      <router-link
                        :to="`/users/paciente/edit/${user.slug}`"
                        class="inline-block border bg-primary-light px-3 py-3 rounded-full bg-light-green-two hover:shadow-md">
                        <Edit class="w-3 h-3 fill-primary" />
                      </router-link>
                      <button
                        @click="questionFlashIndex = index"
                        class="inline-block border bg-primary-light px-3 py-3 rounded-full bg-light-green-two hover:shadow-md">
                        <Delete class="w-3 h-3 fill-primary" />
                      </button>
                    </div>
                  </td>
                  <QuestionFlash
                    :show="questionFlashIndex === index"
                    title="¿Desea eliminar este usuario?"
                    :data="`Eliminar a ${user.persona.nombre} de la lista`"
                    @continues="deleteUser(user.slug)"
                    @close="questionFlashIndex = null"
                  />
                </tr>
              </template>
            </transition-group>
          </table>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
