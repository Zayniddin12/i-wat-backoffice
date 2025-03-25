<template>
  <div :class="error ? 'error' : ''" class="code-input">
    <label
      v-if="label"
      :for="`verification-input-${randomNumber}`"
      class="mb-2 block text-sm leading-130 font-medium text-dark"
    >
      {{ label }}
    </label>
    <div class="flex-y-center gap-3">
      <template v-for="(v, index) in values" :key="index">
        <input
          :id="`verification-input-${randomNumber + index}`"
          :ref="
            (el) => {
              if (el) inputs[index + 1] = el;
            }
          "
          :autoFocus="autoFocus && index === autoFocusIndex"
          :class="inputClass"
          :data-id="index"
          :disabled="props.disabled"
          :required="props.required"
          :value="v"
          class="w-full text-center rounded-lg otp-input outline-none transition-300 bg-gray/40 focus:border-primary h-[46px] font-medium text-xl leading-130 overflow-hidden focus:bg-white"
          maxlength="1"
          pattern="[0-9]"
          @focus="onFocus"
          @input="onValueChange"
          @keydown="onKeyDown"
          @paste="handlePaste"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUpdate, onMounted, ref, toRef, watch } from "vue";

const props = defineProps({
  className: String,
  inputClass: String,
  step: Number,
  fields: {
    type: Number,
    default: 6,
  },
  title: String,
  error: Boolean,
  label: {
    type: String,
    required: false,
    default: "",
  },
});
const emit = defineEmits(["change", "complete", "update:modelValue"]);
const KEY_CODE = {
  backspace: 8,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};
const randomNumber = Math.floor(Math.random() * 101);
const values = ref([]);
const iRefs = ref([]);
const inputs = ref([]);
const fields = toRef(props, "fields");
const autoFocusIndex = ref(0);
const autoFocus = true;
const initVals = () => {
  let vals;
  if (values.value && values.value.length) {
    vals = [];
    for (let i = 0; i < fields.value; i++) {
      vals.push(values.value[i] || "");
    }
    autoFocusIndex.value =
      values.value.length >= fields.value ? 0 : values.value.length;
  } else {
    vals = Array(fields.value).fill("");
  }
  iRefs.value = [];
  for (let i = 0; i < fields.value; i++) {
    iRefs.value.push(i + 1);
  }
  values.value = vals;
};
const onFocus = (e) => {
  e.target.select(e);
};
const onValueChange = (e) => {
  const index = parseInt(e.target.dataset.id);
  e.target.value = e.target.value.replace(/[^\d]/gi, "");
  // this.handleKeys[index] = false;
  if (e.target.value === "" || !e.target.validity.valid) {
    return;
  }
  let next;
  const value = e.target.value;
  values.value = Object.assign([], values.value);
  if (value.length > 1) {
    let nextIndex = value.length + index - 1;
    if (nextIndex >= fields.value) {
      nextIndex = fields.value - 1;
    }
    next = iRefs.value[nextIndex];
    const split = value.split("");
    split.forEach((item, i) => {
      const cursor = index + i;
      if (cursor < fields.value) {
        values.value[cursor] = item;
      }
    });
  } else {
    next = iRefs.value[index + 1];
    values.value[index] = value;
  }
  if (next) {
    const element = inputs.value[next];
    element.focus();
    element.select();
  }
  triggerChange(values.value);
};
const onKeyDown = (e) => {
  const index = parseInt(e.target.dataset.id);
  const prevIndex = index - 1;
  const nextIndex = index + 1;
  const prev = iRefs.value[prevIndex];
  const next = iRefs.value[nextIndex];
  switch (e.keyCode) {
    case KEY_CODE.backspace: {
      e.preventDefault();
      const vals = [...values.value];
      if (values.value[index]) {
        vals[index] = "";
        values.value = vals;
        triggerChange(vals);
      } else if (prev) {
        vals[prevIndex] = "";
        inputs.value[prev].focus();
        values.value = vals;
        triggerChange(vals);
      }
      break;
    }
    case KEY_CODE.left:
      e.preventDefault();
      if (prev) {
        inputs.value[prev].focus();
      }
      break;
    case KEY_CODE.right:
      e.preventDefault();
      if (next) {
        inputs.value[next].focus();
      }
      break;
    case KEY_CODE.up:
    case KEY_CODE.down:
      e.preventDefault();
      break;
    default:
      break;
  }
};
const triggerChange = (values = values.value) => {
  const val = values.join("");
  emit("update:modelValue", val);
  if (val.length >= fields.value) {
    emit("complete", val);
  }
};

function handlePaste(e) {
  const paste = e.clipboardData.getData("text");
  if (typeof paste === "string") {
    // If it is the right length, paste it.
    values.value = paste.split("");
    const inputs = e.target.parentElement.querySelectorAll(".otp-input");
    // Focus on the last character
    inputs.item(values.value.length - 1).focus();
  }
}

initVals();
watch(
  () => props.step,
  (newValue) => {
    if (newValue === 2) {
      document.getElementById(`verification-input-${randomNumber}`).autofocus;
    }
  },
  { immediate: true }
);
onBeforeUpdate(() => {
  inputs.value = [];
});

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (inputs.value && inputs.value[1]) {
        inputs.value[1]?.focus();
      }
    }, 500);
  });
});
</script>

<style scoped>
.error input {
  border: 1px solid #e52e30 !important;
  background: #fef5f5 !important;
}

input {
  border-radius: 8px;
  border: 1px solid rgba(148, 168, 170, 0.4);
  background: #edf0f2;
}
</style>
