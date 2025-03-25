<template>
  <div class="h-[264px] w-full">
    <div class="w-full h-full bg-white rounded-xl">
      <!-- Image Preview -->
      <div
          v-if="data"
          @dragstart="handleDragStart"
          @dragover.prevent="handleDragOver"
          @drop.prevent="onDrop"
          class="relative rounded-lg h-full w-full"
          draggable="true"
      >
        <div class="rounded-lg h-full w-full relative group">
          <div
              class="absolute rounded-lg h-full w-full bg-dark-100/60 z-1 opacity-0 group-hover:opacity-100 transition-300"
          />
          <div
              class="absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-3.5 opacity-0 group-hover:opacity-100 transition-300"
          >
            <!-- Change Button -->
            <label
                for="input"
                class="text-white z-10 transition-all duration-300 cursor-pointer flex gap-2 items-center text-sm"
            >
              <span class="icon-square text-xl" />
              <span>{{ $t("edit_photo") }}</span>
            </label>
            <!-- Delete Button -->
            <div
                class="z-10 transition-all duration-300 cursor-pointer flex items-center gap-2 text-white text-sm"
                @click="removeImage"
            >
              <span class="icon-trash text-red" />
              <span>{{ $t("delete") }}</span>
            </div>
          </div>
          <!-- Current Image -->
          <img
              :src="data"
              alt="image"
              class="rounded-lg h-full w-full relative z-0"
          />
        </div>
      </div>

      <!-- Drag and Drop Area -->
      <label
          for="input"
          v-else
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          class="h-full w-full text-center bg-stone-1 rounded-lg p-6 max-sm:p-1 border-grey-2 border flex justify-center items-center flex-col cursor-pointer transition-300 hover:border-dashed hover:border-blue-400 hover:bg-[#2088FF14] group"
      >
        <span
            class="font-semibold text-xs max-sm:text-xs leading-5 mt-5 mb-2 text-gray-100 group-hover:text-blue-400 transition-300"
        >
          <span class="icon-add-picture" /> {{ $t("add_photo") }}
        </span>
        <p class="font-normal text-xs leading-4 text-gray-200">
          {{ $t("format_text_image") }}
        </p>
      </label>
      <input
          id="input"
          ref="input"
          class="file hidden"
          type="file"
          @change="onFileSelect"
          accept="image/*"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

// Props va Emits'ni aniqlash
const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Data object
const data = ref<string | null>(props.modelValue);

// Propni kuzatib, `data` o'zgaruvchisiga yangilash
watch(
    () => props.modelValue,
    (newValue) => {
      data.value = newValue;
    }
);

// Select File Function
function onFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0]) {
    validateAndSetImage(files[0]);
  }
}

// Validate File Function
function validateAndSetImage(file: File) {
  const MAX_FILE_SIZE = 30 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    alert("The file size exceeds the maximum limit of 30 MB.");
    return;
  }

  const newImageUrl = URL.createObjectURL(file);
  data.value = newImageUrl;
  emit("update:modelValue", newImageUrl);
}

// Remove Image Function
function removeImage() {
  data.value = null;
  emit("update:modelValue", null);
}
function handleDragStart() {
  // No need for index as only one image exists
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}
function onDrop(event: DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    validateAndSetImage(files[0]);
  }
}
</script>
