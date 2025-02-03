<script setup>
defineProps({
  loading: Boolean,
});
</script>
<template>
  <button
    type="button"
    :disabled="loading"
    class="h-10 w-72 max-w-sm rounded-lg bg-primary-light self-center text-primary border border-primary shadow-md font-bold text-xs hover:bg-primary hover:text-white md:mt-8"
  >
    <div v-if="loading" class="btn-spinner mr-2" />
    <slot />
  </button>
</template>

<style lang="scss" scoped></style>
