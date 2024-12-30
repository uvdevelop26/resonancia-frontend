<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  type: String,
  modelValue: String,
  id: String,
  disabled: Boolean,
  placeholder: String,
  error: Array,
  min: Number,
  max: Number,
  maxWidth: {
    type: String,
    default: "2xl",
  },
});

defineEmits(["update:modelValue"]);

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

const disabledClasses = computed(() => {
  return props.disabled ? "bg-gray-200 border-b-gray-300" : "";
});

const errorClasess = computed(() => {
  return props.error ? "border-b-red-500" : "";
});
</script>
<template>
  <div class="flex flex-col gap-2 w-full" :class="maxWidthClass">
    <label :for="id" class="font-bold">{{ label }}:</label>
    <input
      :type="type"
      class="h-9 w-full px-2 text-sm text-primary bg-gray-100 border-b placeholder:text-xs placeholder:italic focus:outline-none"
      :class="[disabledClasses, errorClasess]"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="off"
      :disabled="disabled"
    />
    <div v-if="error" class="text-xs text-red-500">{{ error[0].msg }}</div>
  </div>
</template>
