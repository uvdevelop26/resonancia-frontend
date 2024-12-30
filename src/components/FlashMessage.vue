<script setup>
import { onMounted, computed, ref } from "vue";
import { gsap } from "gsap";
import AlertIcons from "./icons/AlertIcons.vue";
import Modal from "./Modal.vue";

const props = defineProps({
  type: String,
  title: String,
  message: String,
});

const alertRef = ref(null);

const customColor = computed(() => {
  if (props.type === "success") {
    return "green-600";
  } else if (props.type === "error") {
    return "red-600";
  }
  return null;
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

</script>

<template>
  <Modal :show="message" maxWidth="xs">
    <div ref="alertRef" class="w-full h-40 p-4">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center"
          :class="{
            'bg-green-600': customColor === 'green-600',
            'bg-red-600': customColor === 'red-600',
          }">
          <AlertIcons :name="props.type" class="w-3 h-3 mb-1 fill-white" />
        </div>
        <p
          class="font-bold"
          :class="{
            'text-green-600': customColor === 'green-600',
            'text-red-600': customColor === 'red-600',
          }">
          {{ title }}
        </p>
      </div>
      <p class="pt-3 pb-4">{{ message }}</p>
      <div class="text-right pt-4 border-t">
        <button
          type="button"
          aria-label="close alert"
          @click="close"
          class="w-16 h-8 rounded-lg text-sm text-white font-bold"
          :class="{
            'bg-green-600 hover:text-green-600 hover:bg-green-200':
              customColor === 'green-600',
            'bg-red-600 hover:text-red-600 hover:bg-red-200':
              customColor === 'red-600',
          }">
          Cerrar
        </button>
      </div>
    </div>
  </Modal>
</template>
