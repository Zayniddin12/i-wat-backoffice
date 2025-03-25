<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{
  type:
    | "TYPE_I"
    | "TYPE_II"
    | "TYPE_III"
    | "TYPE_IV"
    | "TYPE_V"
    | "TYPE_VI"
    | "TYPE_VII";
  value: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="font-car">
    <div v-if="type === 'TYPE_I'" class="car-number">
      <div
        v-if="value"
        class="card-number_prefix flex items-center justify-center py-[5px] pr-1 pl-[5px]"
      >
        {{ value[0] + value[1] }}
      </div>
      <div v-if="value" class="card-number__letters px-1">
        <span class="inline-block mr-[2px]">
          {{ value?.slice(2, 5) }}
        </span>
        <span>
          {{ value?.slice(5) }}
        </span>
      </div>
      <p v-if="!value" class="text-[10px] text-gray-600 ml-1.5">
        {{ t("not_entered") }}
      </p>

      <div class="!ml-auto mr-[5px]">
        <img src="/images/uz-flag.svg" alt="image of uzbek flag" />
        <img src="/images/uz-word.svg" alt="word of uz" class="mt-[2px]" />
      </div>
    </div>

    <div v-if="type === 'TYPE_II'" class="car-number">
      <div
        v-if="value"
        class="card-number_prefix flex items-center justify-center py-[5px] pr-1 pl-[5px]"
      >
        {{ value[0] + value[1] }}
      </div>
      <div v-if="value" class="card-number__letters pl-1">
        <span class="inline-block mr-[2px]">
          {{ value[2] }}
        </span>
        <span class="inline-block mr-[2px]">
          {{ value?.slice(3, 6) }}
        </span>
        <span class="inline-block mr-[2px]">
          {{ value?.slice(6) }}
        </span>
      </div>
      <p v-if="!value" class="text-[10px] text-gray-600 ml-1.5">
        {{ t("not_entered") }}
      </p>

      <div class="!ml-auto mr-[5px]">
        <img src="/images/uz-flag.svg" alt="image of uzbek flag" />
        <img src="/images/uz-word.svg" alt="word of uz" class="mt-[2px]" />
      </div>
    </div>
    <div v-if="type === 'TYPE_III'" class="car-number car-number__three">
      <div class="flex items-center justify-center">
        <span class="inline-block mr-[3px]">{{ value[0] }}</span>
        <span>{{
          value[1] + value[2] + value[3] + value[4] + value[5] + value[6]
        }}</span>
      </div>
    </div>
    <div v-if="type === 'TYPE_IV'" class="car-number car-number__three">
      <div class="flex items-center justify-center">
        <span class="inline-block mr-1">{{
          value[0] + value[1] + value[2]
        }}</span>
        <span>{{ value[3] + value[4] }}</span>
        <span>
          {{ value[5] + value[6] }}
        </span>
      </div>
    </div>
    <div
      v-if="type === 'TYPE_V'"
      class="car-number car-number__three card-number__un"
    >
      <div class="flex items-center justify-center">
        <span class="inline-block mr-1">{{ value[0] + value[1] }}</span>
        <span>{{ value[2] + value[3] + value[4] + value[5] }}</span>
      </div>
    </div>
    <div
      v-if="type === 'TYPE_VI'"
      class="car-number car-number__three car-number--unique"
    >
      <div class="flex items-center">
        <div
          class="card-number-three_prefix px-1 py-[5px] flex items-center justify-center"
        >
          {{ value[0] + value[1] }}
        </div>
        <div class="card-number__letters px-1">
          <span class="inline-block mr-1">
            {{ value[2] }}
          </span>
          <span>
            {{ value[3] + value[4] + value[5] + value[6] + value[7] }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="type === 'TYPE_VII'"
      class="car-number car-number__three car-number--seven"
    >
      <div class="flex items-center">
        <div
          class="card-number-three_prefix px-1 py-[5px] flex items-center justify-center"
        >
          {{ value[0] + value[1] }}
        </div>
        <div class="card-number__letters px-1 flex-center w-full">
          <span class="inline-block mr-1">
            {{ value[2] }}
          </span>
          <span>
            {{ value.slice(3) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-number {
  display: flex;
  min-width: 106px;
  width: max-content;
  height: 24px;
  align-items: center;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #0f221b;
  background: #f5f7f7;
  overflow: hidden;
}

.card-number_prefix {
  color: #32363e;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 11.944px */
  text-transform: uppercase;
  border-right: 1px solid #0f221b;
  font-family: "uzb-auto", sans-serif;
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
.car-number__three {
  width: 106px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #54b057;
  border: none;
  padding: 1px;
}

.car-number__three > div {
  width: 100%;
  border-radius: 3px;
  border: 0.746px solid #fff;
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

.card-number__un {
  background: #4048c4 !important;
  text-align: center;
}
.card-number-three_prefix {
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 12px */
  text-transform: uppercase;
  color: white;
  border-right: 0.746px solid #fff;
}
.car-number--unique {
  padding: 1px;
}
.car-number--unique > div {
  border-radius: 3px;
}
.car-number--seven {
  background: #f7cb48;
}
.car-number--seven > div {
  border-color: #0f221b;
}
.car-number--seven span {
  color: #0f221b;
}
.car-number--seven .card-number-three_prefix {
  color: #0f221b;
  border-color: #0f221b;
}
</style>
