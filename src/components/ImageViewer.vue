<script setup>
import { computed, ref } from "vue";
import Close from "./icons/Close.vue";

const props = defineProps({
  show: false,
  images: Array,
  maxWidth: {
    type: String,
    default: "2xl",
  },
});

const modalShow = ref(false);
const photo = ref(null);

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

const showModalImg = (index) => {
  modalShow.value = true;
  photo.value = props.images[index];
};

const closeModal = () => {
  modalShow.value = false;
  photo.value = null;
};

const emit = defineEmits(["remove"]);

</script>
<template>
  <div v-if="show" :class="maxWidthClass">
    <ul class="h-32 w-full flex gap-2 overflow-x-auto flex-nowrap">
      <li
        v-for="(image, index) in images"
        :key="index"
        @click="showModalImg(index)"
        class="w-32 h-full relative border-2 flex-shrink-0 shadow-md cursor-pointer">
        <img
          :src="image"
          alt="Previsualización"
          class="w-full h-full object-cover"
        />
        <button
          type="button"
          class="absolute bottom-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-primary hover:shadow-xl"
          @click.stop="$emit('remove', index)">
          <Close class="w-3 h-3 fill-white" />
        </button>
      </li>
    </ul>
    <!-- modal form  -->
    <div
      class="fixed inset-0 flex items-center justify-center px-4 py-6 sm:px-0 z-50 transition-all duration-200"
      v-if="show && modalShow">
      <transition>
        <div
          v-show="show && modalShow"
          class="fixed inset-0 bg-gray-500 opacity-50"
        ></div>
      </transition>
      <div
        class="h-96 w-full sm:max-w-md bg-white rounded-lg overflow-hidden shadow-xl transform transition-all relative">
        <button
          type="button"
          class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-primary hover:shadow-xl"
          @click="closeModal">
          <Close class="w-3 h-3 fill-white" />
        </button>
        <img
          :src="photo"
          alt="Previsualización"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
