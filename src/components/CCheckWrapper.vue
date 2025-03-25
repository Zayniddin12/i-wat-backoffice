<script lang="ts" setup></script>
<template>
  <section ref="parentBox" class="mb-6 w-full">
    <div class="upper-box bg-white p-4">
      <slot name="info" />
    </div>
    <div
      class="pattern h-5 px-6 relative bg-white flex items-center gap-[2px] overflow-hidden"
    >
      <div class="prefix mr-2"></div>
      <div class="flex items-center justify-center overflow-hidden gap-0.5">
        <span v-for="n in 21" :key="n" />
      </div>
      <div class="suffix ml-2"></div>
    </div>
    <div class="lower-box bg-white p-4">
      <slot name="paid" />
    </div>
  </section>
</template>

<style scoped>
section {
  filter: drop-shadow(0px 20px 30px rgba(24, 64, 83, 0.06));
}

.upper-box {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border: 1px solid #f9fafa;
  border-bottom: 0;
}

.lower-box {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border: 1px solid #f9fafa;
  border-top: 0;
}

.pattern::before,
.pattern::after {
  content: "";
  position: absolute;
  top: 0;
  width: 20px;
  height: 20px;
  background: #f9fafa;
  border: 1px solid #e8ecee;
  border-radius: 100%;
  z-index: 2;
}

.pattern::before {
  left: -10px;
}

.pattern::after {
  right: -10px;
}

.pattern span,
.prefix,
.suffix {
  max-width: 14px;
  width: 14px;
  height: 6px;
  display: inline-block;
  border-radius: 80px;
  border: 1px solid #e8ecee;
  background: #f9fafa;
}

.prefix {
  position: absolute;
  left: 6px;
}

.suffix {
  position: absolute;
  right: 7px;
}
</style>
