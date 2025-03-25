<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CCard from "@/components/Card/CCard.vue";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import { computed, onMounted, ref, watch } from "vue";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import CCar from "@/components/Card/CCar.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import NoData from "@/components/Common/NoData/NoData.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import { convertPhoneNumberToString } from "@/utils/changeNumberFormat";
import CCarNumber from "@/components/Card/CCarNumber.vue";
import { debounce } from "@/utils";

const props = defineProps<{
  show: boolean;
  initialData: number[];
}>();

defineEmits<{
  (event: "close"): void;
  (event: "submit", value: number[]): void;
}>();

const route = useRoute();
const carList = ref([]);
const cars = ref();
const isAllCars = ref(false);
const search = ref("");
const selectedList = ref<number[]>([]);
const filteredOptions = ref([]);

onMounted(() => {
  ApiService.get("cars", `?user=${route.params?.id}`).then((res) => {
    carList.value = res.data.results;
    filteredOptions.value = res.data.results;
  });
});

function onSelect(item: any) {
  if (selectedList.value.includes(item?.id)) {
    selectedList.value = selectedList.value.filter((i) => i !== item?.id);
  } else {
    selectedList.value = [...selectedList.value, item?.id];
  }
}

watch(
  () => props.initialData,
  () => {
    selectedList.value = props.initialData;
  }
);

watch(
  () => isAllCars.value,
  (val) => {
    if (val) {
      selectedList.value = [];
      carList.value.forEach((item) => selectedList.value.push(item?.id));
    } else {
      selectedList.value = [];
    }
  }
);

watch(
  () => search.value,
  () => {
    if (!search.value.length) {
      filteredOptions.value = carList.value;
      return;
    }
    debounce(
      "search-merchant-search",
      () => {
        filteredOptions.value = cars.value?.filter((o: any) =>
          o?.model?.manufacturer_name
            ?.toLowerCase()
            .includes(search.value.toLowerCase())
        );
      },
      100
    );
  }
);
</script>

<template>
  <CDialog
    :show="show"
    :title="$t('side_menu.cars')"
    body-class="!max-w-[421px] !h-max !h-[482px]"
    @close="$emit('close')"
  >
    <CCard class="py-5">
      <div>
        <div class="relative mx-5 mb-2">
          <span
            class="absolute z-10 text-dark top-1/2 -translate-y-1/2 left-2"
          ></span>
          <FInput
            :placeholder="$t('search')"
            v-model="search"
            class="pl-2.5 rounded-md bg-gray"
            input-class="placeholder:font-medium"
          >
            <template #prefix>
              <i
                class="icon-search inline-block mr-2.5 text-xl text-gray-200"
              />
            </template>
          </FInput>
        </div>

        <Transition name="fade" mode="out-in">
          <div :key="search">
            <div
              v-if="filteredOptions?.length"
              class="flex items-center justify-between py-[14px] px-5"
            >
              <div class="flex items-center gap-3">
                <img
                  src="/public/images/svg/car.svg"
                  alt="default car image"
                  class="w-[30px] h-[30px]"
                />
                <p class="font-bold text-sm">{{ $t("all_cars") }}</p>
              </div>

              <FCheckbox
                :checked="isAllCars"
                is-all-cars
                @change="isAllCars = $event"
              />
            </div>
            <div
              v-if="filteredOptions?.length"
              class="h-[220px] overflow-y-scroll"
            >
              <div
                v-for="(item, idx) in filteredOptions"
                :key="idx"
                class="py-[14px] px-5"
              >
                <div class="flex items-center justify-between">
                  <CCar
                    :car="{
                      image: item?.model?.manufacturer_icon,
                      name: item?.model?.name,
                      model: item?.model?.manufacturer_name,
                    }"
                  />

                  <div class="flex gap-3 items-center">
                    <CCarNumber
                      :type="item?.state_number_type ?? 'TYPE_II'"
                      :value="convertPhoneNumberToString(item?.state_number)"
                    />
                    <FCheckbox
                      :key="idx"
                      :checked="selectedList.includes(item?.id)"
                      @change="onSelect(item)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!filteredOptions?.length && search">
              <NoData
                :subtitle="$t('no_cars_machine_subtitle')"
                title-class="!min-w-[95%]"
                subtitle-class="!min-w-[95%] !mx-5"
                :title="$t('no_cars_machine_title')"
                class="p-0 !py-7"
                image="/images/svg/no-data/default_no_data.svg"
              />
            </div>
          </div>
        </Transition>
      </div>

      <Transition name="fade" mode="out-in">
        <div
          v-if="filteredOptions?.length"
          :key="filteredOptions?.length"
          class="m-5 mb-0"
        >
          <CButton
            class="w-full"
            :text="$t('confirm')"
            variant="primary"
            @click="$emit('submit', selectedList)"
          />
        </div>
      </Transition>
    </CCard>
  </CDialog>
</template>

<style scoped></style>
