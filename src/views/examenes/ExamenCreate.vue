<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import TextInput from "@/components/TextInput.vue";
import TextArea from "@/components/TextArea.vue";
import SearchInput from "@/components/SearchInput.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import { Utilities } from "@/js/Utilities";
import { Constants } from "@/js/Contants";
import { onMounted, ref, watchEffect } from "vue";
import axios from "axios";
import FileInput from "@/components/FileInput.vue";
import ImageViewer from "@/components/ImageViewer.vue";
import LoadingButton from "@/components/LoadingButton.vue";

// search data
const pacientes = ref([]);
const pacientesSearch = ref([]);
const search = ref("");
//file handlers data
const fileNames = ref([]);
const photosPreview = ref([]);
//other
const message = ref("");
const errors = ref({});

const form = ref({
  fecha: "",
  resultado: "",
  user_id: "",
  url: [],
});

const resultadosPrediccion = ref([]);

//funciones
const close = () => {
  Utilities.close(message);
};

const cleanFormEx = () => {
  Utilities.cleanForm(form);
  search.value = "";
  fileNames.value = [];
  photosPreview.value = [];
};

const action = () => {
  const dni = Utilities.getDniFromString(search);

  const user = pacientes.value.filter(
    (paciente) => paciente.persona.dni === dni
  );

  form.value.user_id = user[0].id;
};

watchEffect(() => {
  const value = search.value;
  if (!value) {
    form.value.user_id = "";
  }
});

const fileHandler = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  const filesArrayTmp = [];

  for (const file of files) {
    fileNames.value.push(file.name);
    filesArrayTmp.push(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      photosPreview.value.push(e.target.result);
    };

    reader.onerror = (error) => {
      console.error(`Error leyendo el archivo ${file.name}:`, error);
    };

    reader.readAsDataURL(file);
  }

  form.value.url = filesArrayTmp;
};

const classLabels = {
  1: "Glioma",
  2: "Meningioma",
  3: "No tumor",
  4: "Pituitary",
};

const typeText = async (text, delay = 50) => {
  form.value.resultado = "";
  for (let i = 0; i < text.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    form.value.resultado += text[i];
  }
};

const generatePrediction = async () => {
  const imagenes = form.value.url;

  if (imagenes.length === 0) {
    console.error("No has añadido imágenes para analizar");
    return;
  }

  resultadosPrediccion.value = await Promise.all(
    imagenes.map(async (imagen) => {
      const formData = new FormData();
      formData.append("file", imagen);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
          { withCredentials: true }
        );

        // Extraer las probabilidades del JSON
        const predictionArray = response.data.prediction[0]; // Tomar el primer array

        if (!Array.isArray(predictionArray)) {
          console.error("Formato inesperado en la predicción:", response.data);
          return { imagen: imagen.name, resultado: "Error en la predicción" };
        }

        // Encontrar el índice con el valor más alto (como en test.py)
        const classIndex = predictionArray.indexOf(
          Math.max(...predictionArray)
        );

        // Convertir el índice en el nombre de la clase
        const resultado = classLabels[classIndex + 1] || "No encontrado"; // +1 porque tus clases empiezan en 1

        return { imagen: imagen.name, resultado };
      } catch (error) {
        console.error(`Error en la predicción de ${imagen.name}:`, error);
        return { imagen: imagen.name, resultado: "Error en la predicción" };
      }
    })
  );

  if (resultadosPrediccion.value) {
    let finalText = "";

    resultadosPrediccion.value.forEach((result, index) => {
      const description = Utilities.getClaseDescription(result.resultado);

      finalText += `La imagen ${index + 1}: ${
        result.imagen
      } ha arrojado el resultado: ${result.resultado}. ${description}\n`;

    });

    typeText(finalText, 50);
  }
};

const handleRemoveImage = (index) => {
  photosPreview.value.splice(index, 1);
  fileNames.value.splice(index, 1);
  form.value.url.splice(index, 1);
};

const store = async () => {
  const formData = new FormData();

  formData.append("fecha", form.value.fecha);
  formData.append("resultado", form.value.resultado);
  formData.append("user_id", form.value.user_id);

  form.value.url.forEach((file) => {
    formData.append("url", file);
  });

  try {
    const response = await axios.post(
      `${Constants.serverPath}/api/examenes/store`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    cleanFormEx();

    message.value = response.data.msg;

    errors.value = {};
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

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${Constants.serverPath}/api/examenes/create`
    );

    pacientes.value = response.data;

    response.data.forEach((res) => {
      pacientesSearch.value.push(res.persona);
    });
  } catch (error) {
    console.error("Error en el servidor", error);
  }
};

onMounted(fetchData);
</script>
<template>
  <AppLayout :title="`Nuevo Análisis`">
    <template #content>
      <div class="w-full h-full overflow-y-auto flex flex-col gap-5 relative">
        <!-- flash message -->
        <FlashMessage
          v-if="message"
          type="success"
          title="Operación exitosa"
          :message="message"
          @close="close"
        />
        <!-- form -->
        <div class="w-full rounded-lg bg-white shadow-md p-4 lg:p-6 mt-4">
          <form @submit.prevent="store" class="flex flex-col gap-4">
            <div
              class="flex flex-col gap-4 w-full items-center md:flex-row md:items-start md:flex-wrap"
            >
              <TextInput
                label="Fecha"
                type="date"
                id="fecha"
                v-model="form.fecha"
                :error="errors.fecha"
                maxWidth="sm"
              />
              <SearchInput
                placeholder="Ingresa nombre, apellido o CI. Selecciona en la lista"
                id="user_id"
                label="Buscar Paciente"
                v-model="search"
                :data="pacientesSearch"
                :criteria="['nombre', 'apellido', 'dni']"
                :error="errors.user_id"
                @action="action"
                maxWidth="sm"
              />
              <div class="flex flex-col gap-2 w-full relative max-w-sm">
                <FileInput
                  label="Selecciona Archivo"
                  id="url"
                  accept=".jpeg, .jpg, .png"
                  multiple="true"
                  placeholder=".jpeg, .jpg, .png"
                  maxWidth="sm"
                  :error="errors.url"
                  @change="fileHandler"
                />
                <ImageViewer
                  :show="photosPreview.length > 0"
                  :images="photosPreview"
                  @remove="handleRemoveImage"
                  maxWidth="sm"
                  class="lg:absolute lg:left-0 lg:-bottom-[134px]"
                />
              </div>
              <TextArea
                label="Resultados"
                id="resultado"
                disabled
                maxWidth="sm"
                v-model="form.resultado"
                :error="errors.resultado"
                placeholder="Los resultados se generarán en segundos.."
              />
            </div>

            <div
              class="flex flex-col gap-4 w-full items-center md:mt-4 md:flex-row"
            >
              <LoadingButton @click="generatePrediction">
                Analizar
              </LoadingButton>
              <button
                type="submit"
                class="h-10 w-72 bg-primary self-center text-white shadow font-bold rounded-lg text-sm hover:bg-primary-light hover:text-primary md:mt-8"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
