<script lang="ts" setup>
import { computed, ref, watch } from "vue";

interface Props {
  modelValue: string;
}

interface Emit {
  (e: "update:modelValue", value: Props["modelValue"]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const handleInput = (e: { target: HTMLInputElement }) => {
  emit("update:modelValue", e.target.value);
};

const numberPattern = /^\d+/;
const letterPattern = /^[A-Za-z]+$/;
const regularNumberPattern = /^\d{2} [a-z] \d{3} [a-z]{2}$/i;
const extraNumberPattern = /^\d{2} \d{3} [a-z]{3}$/i;
const carNumberObj = ref<Record<string, boolean | null | string>>({
  mask: null,
  isNationalNumber: true,
});
const currentActiveClass = ref("");

const checkCarNumberPrefix = (value: string) => {
  if (letterPattern.test(value[2])) {
    carNumberObj.value.isRegularNumber = true;
    carNumberObj.value.mask = "## a ### aa"; // 12 A 123 AA
    return true;
  }

  if (numberPattern.test(value[2])) {
    carNumberObj.value.isRegularNumber = true;
    carNumberObj.value.mask = "## ### aaa"; // 12 123 ABC
    return true;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    if (!value.length) {
      carNumberObj.value.isNationalNumber = true;
      carNumberObj.value.isPersonalTechnique = false;
      carNumberObj.value.isUN = false;
      carNumberObj.value.isVisitors = false;
      carNumberObj.value.mask = null;
      carNumberObj.value.isRegularNumber = false;
      carNumberObj.value.prefix = null;
      carNumberObj.value.isHExists = false;
      carNumberObj.value.isMExists = false;
    }

    const carNumber = value.toLowerCase();
    carNumberObj.value.prefix = carNumber.slice(0, 2);

    if (carNumber.startsWith("un")) {
      carNumberObj.value.isUN = true;
      carNumberObj.value.isNationalNumber = false;
      carNumberObj.value.mask = "UN ####"; // UN 1234
      return;
    }

    if (carNumber.startsWith("t")) {
      carNumberObj.value.isPersonalTechnique = true;
      carNumberObj.value.isNationalNumber = false;
      delete carNumberObj.value.isUN;
      carNumberObj.value.mask = "T ######"; // T 123456
      return;
    }

    if (carNumber.startsWith("cmd")) {
      carNumberObj.value.isNationalNumber = false;
      delete carNumberObj.value.isUN;
      delete carNumberObj.value.isPersonalTechnique;
      carNumberObj.value.isVisitors = true;
      carNumberObj.value.mask = "CMD ##-##"; // CMD 12-34
      return;
    }

    if (checkCarNumberPrefix(carNumber)) {
      carNumberObj.value.isNationalNumber = true;
      delete carNumberObj.value.isUN;
      delete carNumberObj.value.isPersonalTechnique;
      delete carNumberObj.value.isVisitors;
      return;
    }

    if ("h" === carNumber[3] && letterPattern.test(carNumber[3])) {
      carNumberObj.value.isNationalNumber = false;
      carNumberObj.value.isRegularNumber = false;
      carNumberObj.value.isHExists = true;
      carNumberObj.value.mask = "## H ######"; // 12 123 ABC
      currentActiveClass.value = "car-number--h";
      return true;
    }

    if ("m" === carNumber[3] && letterPattern.test(carNumber[3])) {
      carNumberObj.value.isNationalNumber = false;
      carNumberObj.value.isRegularNumber = false;
      carNumberObj.value.isMExists = true;
      carNumberObj.value.mask = "## M ######";
      currentActiveClass.value = "car-number--m";
      return true;
    }
  }
);

const getNumberStyle = computed(() => {
  if (carNumberObj.value.isUN) {
    return "car-number--un";
  }

  if (carNumberObj.value.isPersonalTechnique) {
    return "car-number--t";
  }

  if (carNumberObj.value.isVisitors) {
    return "car-number--t";
  }

  if (carNumberObj.value.isRegularNumber) {
    return "car-number--regular";
  }

  if (carNumberObj.value.isHExists) {
    return "car-number--h";
  }

  if (carNumberObj.value.isMExists) {
    return "car-number--m";
  }

  return "";
});
</script>

<template>
  <div
    :class="[getNumberStyle, currentActiveClass]"
    class="car-number relative max-w-[232px] flex items-center flex-wrap justify-between px-3 py-1.5 bg-white border-2 border-gray-600 rounded-lg"
  >
    <div class="car-number__wrapper">
      <div
        v-if="
          regularNumberPattern.test(modelValue) ||
          extraNumberPattern.test(modelValue)
        "
        class="absolute left-0"
      >
        <div
          v-if="
            carNumberObj.isNationalNumber ||
            carNumberObj.isMexists ||
            carNumberObj.isHexist
          "
          class="card-number__prefix h-full flex items-center justify-center py-[6px] px-[7px]"
        >
          {{ modelValue[0] + modelValue[1] }}
        </div>
      </div>

      <input
        v-maska="carNumberObj.mask"
        :value="modelValue"
        class="w-[90%] h-full text-2xl font-bold outline-none uppercase bg-transparent"
        type="text"
        @input="handleInput"
      />

      <div v-if="carNumberObj.isNationalNumber">
        <img
          alt="image of uzbek flag"
          class="w-5 h-5"
          src="/images/uz-flag.svg"
        />
        <img
          alt="word of uz"
          class="mt-[2px] w-[14px]"
          src="/images/uz-word.svg"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-number {
  height: 48px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 2px solid #74807b;
  background: #fff;
  overflow: hidden;
}

.car-number__wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

input,
.card-number__prefix {
  color: #061018;
  font-size: 28px;
  line-height: 32px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
  text-transform: uppercase;
  font-family: "uzb-auto", sans-serif;
}

input {
  letter-spacing: -1.3px;
}

.card-number__prefix {
  text-align: center;
  text-transform: uppercase;
  border-right: 2px solid #74807b;
  background: #cae161;
}

.card-number__letters {
  color: #32363e;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 16.423px */
  letter-spacing: -0.224px;
  text-transform: uppercase;
}

.car-number--regular {
  background: #fff;
  border-radius: 8px;
  border: 2px solid #74807b;
}

.car-number--t,
.car-number--m {
  flex-shrink: 0;
  background: #54b057;
  border: none;
  padding: 3px;
}

.car-number--m input {
  color: #fff;
  width: 100%;
  text-align: center;
}

.car-number__three span {
  color: white;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 16px */
  text-transform: uppercase;
}

.car-number--un {
  background: #4048c4 !important;
  text-align: center;
  align-items: center;
  border: none;
  padding: 3px !important;
}

.car-number--un input,
.car-number--t input {
  width: 100%;
  text-align: center;
  color: white;
}

.car-number--un > .car-number__wrapper,
.car-number--t > .car-number__wrapper,
.car-number--m > .car-number__wrapper {
  border: 1px solid #fff;
  border-radius: 6px;
}

.car-number--unique {
  padding: 1px;
}

.car-number--unique > div {
  border-radius: 3px;
}

.car-number--h {
  background: #f7cb48;
}
</style>
