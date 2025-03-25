<template>
  <div class="flex space-x-4 w-full">
    <!-- Active Option -->
    <div class="flex items-center">
      <div
        class="w-4 h-4 rounded-full border-[3px] border-green flex items-center justify-center"
      ></div>
      <span class="ml-2 text-gray-200 text-xs font-medium">Активный</span>
    </div>
    <!-- Inactive Option -->
    <div class="flex items-center">
      <div
        class="w-4 h-4 rounded-full border-[3px] border-red flex items-center justify-center"
      ></div>
      <span class="ml-2 text-gray-200 text-xs font-medium">Неактивный</span>
    </div>
  </div>
</template>
