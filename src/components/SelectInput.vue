<script setup>
import { computed } from "vue";
const props = defineProps({
  label: String,
  modelValue: String,
  id: String,
  disabled: Boolean,
  placeholder: String,
  error: Array,
  maxWidth: {
    type: String,
    default: "2xl",
  }
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

const errorClasess = computed(() => {
  return props.error ? "border-b-red-500" : "";
});

defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex flex-col w-full gap-2" :class="maxWidthClass">
    <label :for="id" class="font-bold">{{ label }}:</label>
    <select
      class="h-9 w-full px-2 text-sm text-primary bg-gray-100 border-b cursor-pointer placeholder:text-xs placeholder:italic focus:outline-none"
      :class="errorClasess"
      :value="modelValue"
      :id="id"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)">
      <slot name="options" />
    </select>
    <div v-if="error" class="text-xs text-red-500">{{ error[0].msg }}</div>
  </div>
</template>
