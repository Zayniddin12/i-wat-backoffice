<template>
  <div class="container max-h-[220px] max-w-[327px]">
    <div class="w-full bg-white rounded-xl">
      <div
        v-if="data.image"
        @dragstart="handleDragStart"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        class="relative rounded-lg h-full w-full"
        draggable="true"
      >
        <div class="rounded-lg h-full w-full">
          <div class="absolute top-0 right-3 flex gap-2">
            <!-- Delete button -->
            <div
              class="rounded-full p-2 bg-blur/30 z-10 border border-white/9 transition-all duration-300 cursor-pointer"
              @click="removeImage"
            >
              <img src="../../public/images/trash.svg" alt="trash" />
            </div>
            <!-- Change button -->
            <div
              class="rounded-full p-2 bg-blur/30 z-10 border border-white/9 transition-all duration-300 cursor-pointer"
              @click="selectFile"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
            >
              <img src="../../public/images/edit.svg" alt="change" />
            </div>
          </div>
          <!-- Display the selected image -->
          <img :src="data.image" alt="image" class="rounded-lg h-full w-full" />
        </div>
      </div>

      <!-- Drag and drop area for uploading a new image -->
      <div
        v-else
        @click="selectFile"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        class="max-h-[360px] text-center bg-stone-1 rounded-lg p-6 max-sm:p-1 border-dashed border-grey-2 border flex justify-center items-center flex-col h-full"
      >
        <img src="../../public/images/uploadImg.svg" alt="uploadImg" />
        <h3 class="font-semibold text-base max-sm:text-xs leading-5 mt-5 mb-2">
          Перетащите изображение сюда
        </h3>
        <p class="font-medium text-sm max-sm:text-xs leading-4 text-grey-1">
          Перетащите свое изображение сюда или
          <span class="text-mainBlue cursor-pointer">выберите</span>
        </p>
        <input
          ref="input"
          class="file hidden"
          type="file"
          @change="onFileSelect"
          accept="image/*"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const data = ref<{ image: string | null }>({ image: null });
const input = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function handleDragStart() {
  // No need for index as only one image exists
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function handleDrop() {
  // Logic for handling drop can be added here if needed
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files[0] && files[0].type.startsWith("image/")) {
    const newImageUrl = URL.createObjectURL(files[0]);
    data.value.image = newImageUrl;
  }
}

function selectFile() {
  input.value?.click();
}

function onFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0] && files[0].type.startsWith("image/")) {
    const newImageUrl = URL.createObjectURL(files[0]);
    data.value.image = newImageUrl;
  }
}

function removeImage() {
  data.value.image = null;
}
</script>
