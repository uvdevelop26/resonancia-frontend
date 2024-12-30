<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import TextInput from "@/components/TextInput.vue";
import TextArea from "@/components/TextArea.vue";
import QuestionFlash from "@/components/QuestionFlash.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { Utilities } from "@/js/Utilities";
import { useRouter } from "vue-router";
import { Constants } from "@/js/Contants";

const router = useRouter();
const route = useRoute();
const examene = ref({});
const questionFlash = ref(false);
const message = ref("");

const form = ref({
  id: "",
  fecha: "",
  paciente: "",
  resultado: "",
  urls: [],
});

const deleteExamen = async () => {
  try {
    const response = await axios.delete(
      `${Constants.serverPath}/api/examenes/delete/${form.value.id}`
    );

    message.value = response.data.msg;

    router.push({
      path: "/examenes",
      query: { message: response.data.msg },
    });
  } catch (error) {
    console.error("Error al cargar el examen:", error);
  }
};

const fetchData = async () => {
  try {
    const { id } = route.params;

    const response = await axios.get(
      `${Constants.serverPath}/api/examenes/show/${id}`
    );

    const examene = response.data;
    let imagenes = [];

    examene.imagenes.forEach((image) => {
      const url = image.url;
      imagenes.push(url);
    });

    form.value = {
      id: examene.id,
      fecha: Utilities.getFormattedDate(examene.fecha),
      paciente: `${examene.user.persona.nombre} ${examene.user.persona.apellido}`,
      resultado: examene.resultado,
      urls: imagenes,
    };
  } catch (error) {
    console.error("Error al cargar el examen:", error);
  }
};

onMounted(fetchData);
</script>
<template>
  <AppLayout :title="`Examen ${Utilities.getFormattedDate(examene.fecha)}`">
    <template #content>
      <div class="w-full h-full overflow-y-auto flex flex-col gap-5 relative">
        <!-- question flas -->
        <QuestionFlash
          :show="questionFlash"
          title="¿Desea eliminar este Examen?"
          :data="`Eliminar examen fecha ${form.fecha}`"
          @close="questionFlash = false"
          @continues="deleteExamen()"
        />
        <div class="w-full rounded-lg bg-white shadow-md p-4 lg:p-6 mt-4">
          <form class="flex flex-col gap-4">
            <div
              class="flex flex-col gap-4 w-full items-center md:flex-row md:items-start md:flex-wrap">
              <TextInput
                label="Fecha"
                type="date"
                id="fecha"
                v-model="form.fecha"
                :disabled="true"
                maxWidth="xs"
              />
              <TextInput
                label="Paciente"
                type="text"
                id="user"
                v-model="form.paciente"
                :disabled="true"
                maxWidth="xs"
              />
              <TextArea
                label="Resultados"
                id="resultado"
                v-model="form.resultado"
                placeholder="Los resultados se generarán en segundos.."
                :disabled="true"
                maxWidth="xs"
              />
              <div class="flex flex-col gap-2 w-full relative">
                <div class="font-bold">Imágenes:</div>
                <ul
                  v-if="form.urls"
                  class="h-52 w-full flex gap-2 overflow-x-auto flex-nowrap">
                  <li
                    v-for="(urlimg, index) in form.urls"
                    :key="index"
                    class="w-64 h-full relative border-2 flex-shrink-0 shadow-md">
                    <img
                      :src="Utilities.absolutePath(urlimg)"
                      alt="Previsualización"
                      class="w-full h-full object-cover"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col gap-4 w-full items-center md:flex-row">
              <button
                type="button"
                @click="questionFlash = true"
                class="h-10 w-72 bg-red-500 self-center text-white shadow font-bold rounded-lg text-sm hover:bg-red-200 hover:text-red-500 md:mt-8">
                Eliminar
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
