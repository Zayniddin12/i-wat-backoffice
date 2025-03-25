<template>
  <div
    class="w-full relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      id="input"
      :key="image?.url"
      accept="image/png, image/jpeg"
      class="w-0 h-0 absolute"
      multiple
      name="file"
      type="file"
      @change="handleFile"
    />
    <div class="flex items-center gap-3">
      <div
        v-if="image?.url"
        class="flex-y-center relative transition-300 w-[60px] h-[60px] flex items-center justify-center flex-col rounded-lg transition-300 hover:border-primary cursor-pointer p-1 border-2 border-dashed border-primary/60"
      >
        <img
          :src="image.url"
          alt="avatar"
          class="object-cover relative z-0 rounded-lg w-full aspect-square"
          @error="image.url = null"
        />
      </div>
      <div
        v-else
        :class="[
          {
            '!border-red': error,
          },
        ]"
        class="min-w-15 min-h-15 w-min flex items-center justify-center flex-col p-[14px] rounded-lg transition-300 hover:border-primary cursor-pointer border-2 border-dashed border-primary/60"
        @click="getFile('create')"
      >
        <slot>
          <div>
            <div :class="wrapperClass" class="flex-y-center gap-2">
              <i
                :class="icon"
                class="icon-add-picture text-primary text-3.5xl"
              ></i>
            </div>
          </div>
        </slot>
      </div>
      <div
        v-if="image?.url"
        class="px-2 py-1 flex items-center gap-1 rounded-md bg-gray duration-300 cursor-pointer hover:bg-gray-300/10"
        @click="getFile('create')"
      >
        <i class="icon-edit text-gray-300"></i>
        <p class="font-semibold text-xs">{{ $t("edit2") }}</p>
      </div>
    </div>
    <h3 class="mt-2 text-gray-100 font-normal text-[13px]">
      {{ $t("max") }}: <span class="upload_info">{{ size }}</span>
      {{ $t("format") }}: <span class="upload_info"> png, jpg, svg</span>
      {{ $t("size") }}:
      <span class="upload_info">{{ $t("from") }} 512x512</span>
    </h3>
    <div
      v-if="dragging"
      class="delay-75 ease-in w-full h-full bg-dark-100 bg-opacity-80 rounded-lg absolute p-2"
    >
      <div
        class="w-full h-full border-dashed border-2 rounded-md border-white border-opacity-60 flex items-center justify-center"
      >
        <p class="text-white text-base font-bold !leading-[130%]">
          {{ $t("drop_file_here") }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";

const { handleError } = useHandleError();
const emit = defineEmits(["change"]);
const { t } = useI18n();
const { showToast } = useCustomToast();

interface Props {
  error?: boolean;
  defaultImage?: string | File;
  size?: string;
  format?: string;
  icon?: string;
  wrapperClass?: string;
  title?: string;
}

type IImage = {
  id?: string;
  url?: string;
  name?: string;
  file?: File;
  type?: string;
};
const props = withDefaults(defineProps<Props>(), {
  error: false,
  size: "2 MB",
  format: "PNG, JPG",
  icon: "icon-gallery-add",
  wrapperClass: "",
  title: "add_image",
});
let image = ref<IImage>({
  url: "",
});
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
const uploadType = ref("");
const currentTarget = ref(null);
const handleFile = async (event: Event) => {
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }
  if (target?.files?.length) {
    handleUploader(target);
  }
};
const handleUploader = (target: any) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(target?.files[0]);
    reader.onerror = (error) => reject(error);
  })
    .then((res) => {
      // console.log(formData.entries(), formData.get("file"), target.files);
      //Do not touch this, or else You will find yourself DEAD!!!
      let formData = new FormData();

      formData.append("image", target?.files[0], target?.files[0].name);

      //check size file max size 10MB
      if (target?.files[0].size > 2097152 * 5) {
        showToast(t("max_file_size_error"), "error");
        return;
      }
      // formData.append("file_type", "image");
      ApiService.post("file-upload/", formData, config)
        .then((response: any) => {
          image.value = {
            id: response?.data?.id,
            url: response?.data?.image,
            name: target?.files[0].name,
            file: target?.files[0],
            type: "image",
          };
          send();
        })
        .catch(({ response }) => {
          handleError(response);
        });
    })
    .catch((err) => {
      handleError(err);
    });
};
const handleOnDropUploader = (target: any) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(target?.[0]);
    reader.onerror = (error) => reject(error);
  })
    .then((res) => {
      //Do not touch this, or else You will find yourself DEAD!!!
      let formData = new FormData();

      formData.append("file", target?.[0], target[0].name);
      formData.append("file_type", "image");
      ApiService.post("file-upload/", formData, config)
        .then((response: any) => {
          image.value = {
            id: response?.data?.id,
            url: res as string,
            name: target?.[0].name,
            file: target?.[0],
            type: "image",
          };
          send();
        })
        .catch(({ response }) => {
          handleError(response);
        });

      send();
    })
    .catch((err) => {
      handleError(err);
    });
};
const getFile = (type: string) => {
  uploadType.value = type;
  const input = document.getElementById("input");
  input?.click();
};
const removeImage = () => {
  image.value = {};
  send();
};

function send() {
  emit("change", image.value);
}

const dragging = ref(false);
const handleDragOver = (event: Event) => {
  event.preventDefault();
};
const handleDragEnter = (e) => {
  dragging.value = true;
  currentTarget.value = e?.target;
};
const handleDragLeave = (e) => {
  if (e?.target === currentTarget.value) {
    currentTarget.value = null;
    dragging.value = false;
  }
};
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragging.value = false;
  uploadType.value = "create";
  const files = event.dataTransfer?.files;
  handleOnDropUploader(files);
  send();
};
watch(
  () => props.defaultImage,
  () => {
    if (typeof props.defaultImage === "string") {
      image.value.url = props.defaultImage;
    } else {
      image.value = props.defaultImage || {};
    }
  },
  {
    immediate: true,
  }
);
</script>
<style>
.color {
  color: #e74c3c;
}

.upload_info {
  color: #94a8aa;
}
</style>
