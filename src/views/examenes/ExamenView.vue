<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import SearchInput from "@/components/SearchInput.vue";
import Card from "@/components/Card.vue";
import { Utilities } from "@/js/Utilities";
import { Animations } from "@/js/Aminations";
import User from "@/components/icons/User.vue";
import { useRoute, useRouter } from "vue-router";
import { Constants } from "@/js/Contants";
import { onMounted, ref, watchEffect } from "vue";
import FlashMessage from "@/components/FlashMessage.vue";
import axios from "axios";
import gsap from "gsap";

//rutas
const route = useRoute();
const router = useRouter();

//variables reactivass
const examenes = ref([]);
const user = ref({});
const message = ref("");
const showDeleteSuccess = ref(false);
const search = ref("");
const examenesSearch = ref([]);
const filteredExamenes = ref([]);

//funciones
const close = () => {
  Utilities.close(message);
  showDeleteSuccess.value = false;
};

watchEffect(() => {
  const value = search.value;

  if (value === "") {
    filteredExamenes.value = examenes.value;
  }
});

const action = () => {
  const dni = Utilities.getDniFromString(search);

  filteredExamenes.value = filteredExamenes.value.filter(
    (fill) => fill.user.persona.dni === dni
  );
};

//llamadas al backend
const fetchData = async () => {
  try {

    const userResponse = await axios.get(
      `${Constants.serverPath}/api/auth/userinfo`,
      {
        withCredentials: true, 
      }
    );

    //examenes
    const examenesResponse = await axios.get(
      `${Constants.serverPath}/api/examenes/`
    );

    examenes.value = examenesResponse.data;

    user.value = userResponse.data.user;

    filteredExamenes.value = examenesResponse.data;

    //filtra solo las personas para pasar al searchbar
    examenesResponse.data.forEach((res) => {
      const persona = res.user.persona;
      const dni = persona.dni;

      const exists = examenesSearch.value.some((p) => p.dni === dni);

      if (!exists) {
        examenesSearch.value.push(persona);
      }
    });

    //filtra si el usuario es un paciente
    if (user.value.rol === "paciente") {
      examenes.value = examenesResponse.data.filter(
        (examene) => examene.user.id === user.value.id
      );
    } else {
      examenes.value = examenesResponse.data;
    }

    //activate flash message
    if (route.query.message !== "") {
      message.value = route.query.message;
      showDeleteSuccess.value = true;

      router.replace({ query: { ...route.query, message: undefined } });
    }
  } catch (error) {
    console.error("Error al obtener los datos", error);
  }
};

onMounted(fetchData);
</script>

<template>
  <AppLayout title="Exámenes Realizados">
    <template #content>
      <div class="w-full h-full overflow-y-auto flex flex-col gap-5 relative">
        <!-- mesage flash -->
        <FlashMessage
          v-if="showDeleteSuccess"
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
            :data="examenesSearch"
            :criteria="['nombre', 'apellido', 'dni']"
            @action="action"
            background="bg-white"
            maxWidth="3xl"
          />
          <router-link
            to="/examenes/create"
            class="w-28 h-8 text-white font-bold bg-primary flex items-center justify-center rounded-lg shadow-lg hover:bg-primary-light hover:text-primary hover:border">
            Nuevo
          </router-link>
        </div>
        <div
          v-if="examenes.length === 0"
          class="px-6 py-4 text-center text-sm text-gray-500">
          Todavía No Hay Exámenes para Mostrar
        </div>

        <!-- cards -->
        <transition-group
          v-else
          tag="div"
          class="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-6"
          appear
          @before-enter="Animations.cardBeforeEnter"
          @enter="Animations.cardEnter">
          <template
            v-for="(examene, index) in filteredExamenes"
            :key="examene.id">
            <card :href="`/examenes/show/${examene.id}`" :data-index="index">
              <template #content>
                <figure class="rounded-lg h-40 w-full overflow-hidden">
                  <img
                    v-if="Array.isArray(examene.imagenes)"
                    :src="Utilities.absolutePath(examene.imagenes[0].url)"
                    :alt="examene.imagenes[0].url"
                    class="h-full w-full object-cover"
                  />
                  <img
                    v-else
                    src="https://cdn.pixabay.com/photo/2015/02/22/17/56/loading-645268_1280.jpg"
                    alt="No image available"
                    class="h-full w-full object-cover"
                  />
                </figure>
                <div
                  class="text-sm h-24 w-full flex flex-col justify-center relative">
                  <h1
                    class="flex justify-between items-center font-bold text-primary text-sm underline">
                    {{ examene.user.persona.nombre }}
                    {{ examene.user.persona.apellido }}
                    <User class="w-3 h-3 fill-primary" />
                  </h1>
                  <p>{{ Utilities.shortingString(examene.resultado) }}</p>
                  <span class="absolute bottom-0 right-0 text-xs text-gray-500">
                    {{ Utilities.getFormattedDate(examene.fecha_examene) }}
                  </span>
                </div>
              </template>
            </card>
          </template>
        </transition-group>
      </div>
    </template>
  </AppLayout>
</template>
