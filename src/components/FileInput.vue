<script setup>
import { defineEmits, computed } from "vue";
import Upload from "./icons/Upload.vue";

const props = defineProps({
  id: String,
  accept: String,
  label: String,
  multiple: Boolean,
  placeholder: String,
  error: Array,
  maxWidth: {
    type: String,
    default: "2xl",
  },
});

const emit = defineEmits(["update:modelValue"]);

const maxWidthClass = computed(() => {
  return {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[props.maxWidth];
});

const errorClasess = computed(() => {
  return props.error ? "border-b-red-500" : "";
});
const handleChange = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  const filesArray = Array.from(files); 
  emit("update:modelValue", filesArray); 
};


</script>
<template>
  <div class="flex flex-col gap-2 w-full relative" :class="maxWidthClass">
    <span class="font-bold">{{ label }}:</span>
    <!-- input -->
    <label
      :for="id"
      class="w-full block h-10 px-2 overflow-hidden relative border-b cursor-pointer bg-gray-100"
      :class="errorClasess">
      <Upload
        class="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-2 fill-gray-400"
      />
      <input
        type="file"
        :accept="accept"
        :id="id"
        class="opacity-0 absolute -z-10"
        :multiple="multiple"
        @change="handleChange"
      />
      <span
        class="absolute w-28 top-1/2 -translate-y-1/2 text-xs text-gray-400 italic left-10">
        {{ placeholder }}
      </span>
    </label>
    <!-- error -->
    <div v-if="error" class="text-xs text-red-500">{{ error[0].msg }}</div>
  </div>
</template>
