<script setup>
const props = defineProps({
  href: String,
});
</script>

<template>
  <div
    class="w-full h-64 bg-white shadow border rounded-lg overflow-hidden max-w-[340px] hover:shadow-lg">
    <router-link :to="href" class="flex flex-col p-4 w-full h-full">
      <slot name="content" />
    </router-link>
  </div>
</template>
