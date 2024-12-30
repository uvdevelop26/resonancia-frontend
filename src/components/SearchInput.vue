<script setup>
import Search from "./icons/Search.vue";
import { ref, watchEffect, computed } from "vue";

const props = defineProps({
  placeholder: String,
  id: String,
  modelValue: String,
  label: String,
  data: Array,
  // criterio de la búsqueda
  criteria: Array,
  error: Array,
  maxWidth: {
    type: String,
    default: "2xl",
  },
  background: {
    type: String,
    default: "bg-gray-100",
  },
});

const filteredData = ref([]);
const showOnList = ref(false);

watchEffect(() => {
  const value = props.modelValue?.toLowerCase() || "";
  const criteria = props.criteria || [];
  const data = props.data || [];

  value !== "" ? (showOnList.value = true) : (showOnList.value = false);

  filteredData.value = data.filter((item) => {
    // Verificar si alguno de los criterios coincide con el valor buscado
    return criteria.some((crit) => {
      const field = item[crit]?.toString().toLowerCase();
      return field?.includes(value);
    });
  });
});

const cleanSearch = (event) => {
  if (event.key === "Backspace") {
    emit("update:modelValue", "");
  }
};

const selectData = (data) => {
  emit("update:modelValue", `${data.nombre} ${data.apellido} - ${data.dni}`);
  emit("action");
};

const errorClasess = computed(() => {
  return props.error ? "border-b-red-500" : "";
});

const maxWidthClass = computed(() => {
  return {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "4xl": "sm:max-w-4xl",
  }[props.maxWidth];
});

const emit = defineEmits(["update:modelValue", "action"]);
</script>
<template>
  <div class="flex flex-col gap-2 w-full relative" :class="maxWidthClass">
    <label v-if="label" :for="id" class="font-bold">{{ label }}:</label>
    <div
      class="w-full h-10 overflow-hidden relative border-b"
      :class="errorClasess">
      <Search
        class="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-2 fill-gray-400"
      />
      <input
        type="search"
        :id="id"
        :placeholder="placeholder"
        class="h-full w-full pl-9 pr-2 text-sm bg-gray-100 text-primary placeholder:text-xs placeholder:italic focus:outline-none"
        :class="background"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown="cleanSearch"
      />
    </div>
    <!-- error -->
    <div v-if="error" class="text-xs text-red-500">{{ error[0].msg }}</div>
    <!-- list -->
    <ul
      v-if="filteredData.length > 0 && showOnList"
      class="absolute z-50 w-full py-2 border-2 bg-white shadow top-[4.655rem] max-h-52 overflow-y-auto cursor-pointer">
      <li
        v-for="data in filteredData"
        :key="data.id"
        class="text-sm p-2 text-gray-500 hover:bg-gray-200">
        <button
          type="button"
          class="w-full h-full text-start"
          @click="selectData(data)">
          {{ `${data.nombre} ${data.apellido} - ${data.dni}` }}
        </button>
      </li>
    </ul>
  </div>
</template>
