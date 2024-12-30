<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  error: Array,
  modelValue: String,
  id: String,
  placeholder: String,
  disabled: Boolean,
  maxWidth: {
    type: String,
    default: "2xl",
  },
});

const errorClasess = computed(() => {
  return props.error ? "border-b-red-500" : "";
});

const disabledClasses = computed(() => {
  return props.disabled ? "bg-gray-200 border-b-gray-300" : "";
});

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

defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex flex-col gap-2 w-full" :class="maxWidthClass">
    <label :for="id" class="font-bold">{{ label }}:</label>
    <textarea
      :value="modelValue"
      :id="id"
      class="h-32 w-full p-2 text-sm text-primary border-b bg-gray-100 placeholder:text-xs placeholder:italic focus:outline-none"
      :class="[errorClasess, disabledClasses]"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <div v-if="error" class="text-xs text-red-500">{{ error[0].msg }}</div>
  </div>
</template>
