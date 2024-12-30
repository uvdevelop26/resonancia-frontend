<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import TextInput from "@/components/TextInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";
import { Utilities } from "@/js/Utilities";

const route = useRoute();

// variables reactives 
const ciudades = ref([]);
const departamentos = ref([]);
const message = ref("");
const errors = ref({});
const rol = ref({});

const form = ref({
  // persona 
  id: "",
  nombre: "",
  apellido: "",
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
  slug: "",
  profile_photo_path: "",
  rol_id: "",
  persona_id: "",
});

// functions 
const close = () => {
  Utilities.close(message);
};

const getSlug = () => {
  const slug = Utilities.slugify(form.value.nombre, form.value.apellido);
  form.value.slug = slug;
};

// update user 
const update = async () => {
  const { slug } = route.params;

  try {
    const response = await axios.put(
      `http://localhost:3000/api/users/update/${slug}`,
      form.value
    );

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
      console.error("Error en el Servidor:");
    }
  }
};

// fetch data 
const fetchData = async () => {
  const { slug } = route.params;

  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/paciente/edit/${slug}`
    );

    const user = response.data.user;
    rol.value = user.rol;

    const formattedDateBday = Utilities.getFormattedDate(
      user.persona.fecha_nacimiento
    );

    form.value = {
      id: user.id,
      // persona 
      nombre: user.persona.nombre,
      apellido: user.persona.apellido,
      dni: user.persona.dni,
      telefono: user.persona.telefono,
      fecha_nacimiento: formattedDateBday,
      edad: user.persona.edad,
      sexo: user.persona.sexo,
      ciudad_id: user.persona.ciudad_id,
      departamento_id: user.persona.ciudad.departamento_id,
      direccion: user.persona.direccion,
      // user 
      email: user.email,
      password: "",
      slug: user.slug,
      profile_photo_path: user.profile_photo_path,
      rol_id: user.rol.id,
      persona_id: user.persona.id,
    };

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
    console.error("Error al cargar el usuario:", error);
    message.value = error.response.data.message || "Error al editar el usuario";
  }
};

onMounted(fetchData);
</script>
<template>
  <AppLayout :title="`Editar Paciente`">
    <template #content>
      <div class="w-full h-full overflow-y-auto flex flex-col gap-5 relative">
        <FlashMessage
          v-if="message"
          type="success"
          title="Operación Exitosa"
          :message="message"
          @close="close"
        />
        <div class="w-full rounded-lg bg-white shadow-md p-4 lg:p-6 mt-4">
          <form @submit.prevent="update" class="flex flex-col gap-4">
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
                label="Apellidos"
                type="text"
                id="apellidos"
                :error="errors.apellidos"
                v-model="form.apellido"
                maxWidth="xs"
                @input="getSlug()"
              />
              <TextInput
                label="Slug"
                type="text"
                id="slug"
                :error="errors.slug"
                v-model="form.slug"
                maxWidth="xs"
                disabled="true"
              />
              <TextInput
                label="DNI"
                type="text"
                id="dni"
                v-model="form.dni"
                maxWidth="xs"
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
                placeholder="Déjala en blanco si no deseas cambiarla"
                :error="errors.password"
                v-model="form.password"
              />
              <TextInput
                label="Contraseña"
                type="password"
                id="confirmPassword"
                maxWidth="xs"
                placeholder="Déjala en blanco si no deseas cambiarla"
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
                Editar
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
