<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from "vue";
import gsap from "gsap";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: "2xl",
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});

const body = ref(null);
const window = ref(null);

defineExpose({
  body,
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }
);

const close = () => {
  if (props.closeable) {
    emit("close");
  }
  emit("modalClosed");
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("keydown", closeOnEscape);

  gsap.fromTo(
    window.value,
    { scale: 0.5 },
    { scale: 1, duration: 0.6, ease: "power2.out" }
  );
});

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
  document.body.style.overflow = null;
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
</script>
<template>
  <teleport to="body">
    <div
      v-show="show"
      class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 transition-all duration-200"
      scroll-region>
      <transition>
        <div
          v-show="show"
          class="fixed inset-0 transform transition-all"
          @click="close">
          <div class="absolute inset-0 bg-gray-500 opacity-50" />
        </div>
      </transition>
      <div
        class="mb-6 p-4 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto"
        ref="window"
        :class="maxWidthClass">
        <slot v-if="show" />
      </div>
    </div>
  </teleport>
</template>
