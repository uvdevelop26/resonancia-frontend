<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import TextInput from "@/components/TextInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { Utilities } from "@/js/Utilities";

// variables reactivas
const form = ref({
  // persona 
  nombre: "",
  apellido: "",
  slug: "",
  dni: "",
  telefono: "",
  fecha_nacimiento: "",
  sexo: "",
  direccion: "",
  edad: "",
  ciudad_id: "",
  departamento_id: "",
  // user 
  email: "",
  password: "",
  confirmPassword: "",
  profile_photo_path: "",
  rol_id: "",
});

const departamentos = ref([]);
const ciudades = ref([]);
const rol = ref("");
const message = ref("");
const errors = ref({});

// functios 
const cleanForm = () => {
  Utilities.cleanForm(form);
};

const getSlug = () => {
  const slug = Utilities.slugify(form.value.nombre, form.value.apellido);
  form.value.slug = slug;
};

const close = () => {
  Utilities.close(message);
};

// create new user 
const store = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/store",
      form.value
    );

    message.value = response.data.msg;

    cleanForm();

    errors.value = {};
  } catch (error) {
    if (error.response) {
      message.value = error.response.data.msg;

      if (error.response.data.errors) {
        errors.value = Utilities.manageValidationErrors(
          error.response.data.errors
        );
      }

      console.error("Error en el Servidor:");
    }
  }
};

// Resquest data from the server 
const fechData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/administrador/create"
    );

    rol.value = response.data.rol;

    form.value.rol_id = rol.value.id;

    const departamentosData = response.data.departamentos;

    departamentosData.forEach((departamento) => {
      departamento.ciudades.forEach((ciudade) => {
        ciudades.value.push(ciudade);
      });
    });

    departamentosData.forEach((departamento) => {
      delete departamento.ciudade;
      departamentos.value.push(departamento);
    });
  } catch (error) {
    console.error("Error en el servidor", error);
  }
};

onMounted(fechData);
</script>
<template>
  <AppLayout :title="`Crear Administrador`">
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
              class="flex flex-col gap-4 w-full items-center md:flex-row md:flex-wrap">
              <TextInput
                label="Nombre"
                type="text"
                id="nombre"
                :error="errors.nombre"
                v-model="form.nombre"
                maxWidth="xs"
                @input="getSlug()"
              />
              <TextInput
                label="Apellido"
                type="text"
                id="apellidos"
                maxWidth="xs"
                :error="errors.apellido"
                v-model="form.apellido"
                @input="getSlug()"
              />
              <TextInput
                label="Slug"
                type="text"
                id="slug"
                maxWidth="xs"
                :error="errors.slug"
                v-model="form.slug"
                disabled="true"
              />
              <TextInput
                label="DNI"
                type="text"
                id="dni"
                maxWidth="xs"
                :error="errors.dni"
                v-model="form.dni"
              />
              <TextInput
                label="Teléfono"
                type="text"
                id="telefono"
                maxWidth="xs"
                :error="errors.telefono"
                v-model="form.telefono"
              />
              <TextInput
                label="Fecha de Nacimiento"
                type="date"
                id="fecha_nacimiento"
                maxWidth="xs"
                :error="errors.fecha_nacimiento"
                v-model="form.fecha_nacimiento"
              />
              <TextInput
                label="Edad"
                type="number"
                id="edad"
                min="1"
                max="100"
                maxWidth="xs"
                :error="errors.edad"
                v-model="form.edad"
              />
              <SelectInput
                label="Sexo"
                id="sexo"
                maxWidth="xs"
                :error="errors.sexo"
                v-model="form.sexo">
                <template #options>
                  <option :value="null"></option>
                  <option value="femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </template>
              </SelectInput>
              <SelectInput
                label="Departamento"
                id="departamento_id"
                maxWidth="xs"
                v-model="form.departamento_id">
                <template #options>
                  <option :value="null"></option>
                  <option
                    v-for="departamento in departamentos"
                    :key="departamento.id"
                    :value="departamento.id">
                    {{ departamento.nombre_departamento }}
                  </option>
                </template>
              </SelectInput>
              <SelectInput
                label="Ciudad"
                id="ciudad_id"
                maxWidth="xs"
                :error="errors.ciudad_id"
                v-model="form.ciudad_id">
                <template #options>
                  <option :value="null"></option>
                  <option
                    v-for="ciudade in ciudades"
                    :key="ciudade.id"
                    :value="ciudade.id">
                    {{ ciudade.nombre_ciudad }}
                  </option>
                </template>
              </SelectInput>
              <TextInput
                label="Dirección"
                type="text"
                id="direccion"
                maxWidth="xs"
                :error="errors.direccion"
                v-model="form.direccion"
              />
              <TextInput
                label="Correo"
                type="email"
                id="email"
                maxWidth="xs"
                :error="errors.email"
                v-model="form.email"
              />
              <TextInput
                label="Contraseña"
                type="password"
                id="password"
                maxWidth="xs"
                :error="errors.password"
                v-model="form.password"
              />
              <TextInput
                label="Repetir Contraseña"
                type="password"
                id="confirmPassword"
                maxWidth="xs"
                :error="errors.confirmPassword"
                v-model="form.confirmPassword"
              />
              <SelectInput
                label="Rol"
                id="rol_id"
                maxWidth="xs"
                :error="errors.rol_id"
                v-model="form.rol_id"
                disabled>
                <template #options>
                  <option :value="rol.id">{{ rol.nombre_rol }}</option>
                </template>
              </SelectInput>
              <button
                type="submit"
                class="h-10 w-72 bg-primary text-white shadow font-bold rounded-lg text-sm hover:bg-primary-light hover:text-primary md:mt-8">
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
