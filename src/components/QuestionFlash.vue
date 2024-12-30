<script setup>
import { onMounted, computed, ref } from "vue";
import { gsap } from "gsap";
import AlertIcons from "./icons/AlertIcons.vue";
import Modal from "./Modal.vue";

const props = defineProps({
  show: Boolean,
  title: String,
  data: String,
});

const emit = defineEmits(["close", "continues"]);

const close = () => {
  emit("close");
};

const continues = () => {
  emit("continues");
};
</script>
<template>
  <Modal :show="show" maxWidth="xs">
    <div ref="alertRef" class="w-full h-40 p-4">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center">
          <AlertIcons name="question" class="w-3 h-3 mb-2 fill-white" />
        </div>
        <p class="font-bold">
          {{ title }}
        </p>
      </div>
      <p class="pt-3 pb-4 text-center text-sm">
          {{ data }}
      </p>
      <div class="flex gap-4 pt-4 border-t justify-center">
        <button
          type="button"
          aria-label="continue"
          class="w-20 h-8 rounded-lg text-sm text-white font-bold bg-orange-600 hover:text-orange-600 hover:bg-orange-200"
          @click="continues">
          Continuar
        </button>
        <button
          type="button"
          aria-label="close alert"
          @click="close"
          class="w-16 h-8 rounded-lg text-sm text-white font-bold bg-gray-400 hover:text-gray-400 hover:bg-gray-200">
          Cerrar
        </button>
      </div>
    </div>
  </Modal>
</template>

