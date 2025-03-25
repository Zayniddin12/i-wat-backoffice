<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import FSelectMultiple from "@/components/Form/Select/FSelectMultiple.vue";
import CButton from "@/components/Common/CButton.vue";
import CNumberOfCar from "@/components/CNumberOfCar.vue";

import { defineEmits, defineProps, onMounted, ref, unref, watch } from "vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import ApiService from "@/services/ApiService";
import { TForm } from "@/composables/useForm";

interface Props {
  form: TForm<any>;
  show: boolean;
  loading?: boolean;
}

const props = defineProps<Props>();
defineEmits<{ (e: "close"): void; (e: "submit"): void }>();

const form = unref(props.form);
const carMarks = ref([]);
const carModels = ref([]);
const connectors = ref([]);
const onToggle = ref(false);

function getCarModels() {
  ApiService.get(
    `car-models`,
    `?limit=1000&manufacturer=${form.values.manufacturer}`
  ).then((res) => {
    carModels.value = res.data.results;
  });
}

onMounted(() => {
  ApiService.get("manufacturers", "?limit=1000").then((res) => {
    carMarks.value = res.data.results;
  });
  getCarModels();
  ApiService.get(`chargingtypes`, "?limit=1000").then((res) => {
    connectors.value = res.data.results;
  });
});

watch(
  () => props.show,
  (val) => {
    if (!val) {
      form.$v.value.$reset();
      for (let key in form.values) {
        form.values[key] = "";
      }
    }
  }
);

watch(
  () => form.values.manufacturer,
  () => {
    getCarModels();
  }
);
</script>

<template>
  <CDialog
    :show="show"
    @close="$emit('close')"
    @outer-click="$emit('close')"
    body-class="!w-[421px] !overflow-y-visible"
    :title="$t('add_car')"
  >
    <template #default>
      <CCard class="px-5 pt-4 pb-5">
        <form @submit.prevent class="grid grid-cols-1 gap-5">
          <FGroup :label="$t('add_car_form.vin')">
            <FInput
              :maxlength="17"
              v-model="form.values.vin"
              :error="form.$v.value.vin.$error"
              :placeholder="$t('add_car_form.vin_placeholder')"
            />
          </FGroup>
          <FGroup :label="$t('add_car_form.mark')">
            <FSelectCustom
              :options="carMarks"
              :error="form.$v.value.manufacturer.$error"
              v-model="form.values.manufacturer"
              filter-key="name"
              selected-option-styles="!bg-gray"
              :placeholder="$t('add_car_form.mark_placeholder')"
              placeholder-classes="!text-dark !font-normal"
              is-search-icon
            >
              <template #option="{ option: option, selected: selected }">
                <div class="px-2 py-2.5 flex items-center justify-between">
                  <p
                    class="group-hover:font-medium text-sm font-normal leading-130 text-dark"
                  >
                    {{ option?.name }}
                  </p>
                  <p
                    class="text-dark pr-2 icon-star"
                    v-if="selected?.id === option?.id"
                  >
                    <i class="icon-checked text-green text-sm" />
                  </p>
                </div>
              </template>
            </FSelectCustom>
          </FGroup>
          <FGroup :label="$t('add_car_form.model')">
            <FSelect
              :options="carModels"
              v-model="form.values.model"
              :error="form.$v.value.model.$error"
              :placeholder="$t('add_car_form.model_placeholder')"
              selected-option-styles="!h-10 !bg-gray border-transparent !focus:!border-primary"
              is-checked
            />
          </FGroup>
          <FGroup :label="$t('add_car_form.connector')">
            <FSelectMultiple
              :options="connectors"
              v-model="form.values.charging_type"
              :error="form.$v.value.charging_type.$error"
              @on-toggle="onToggle = $event"
              :placeholder="$t('add_car_form.connector_placeholder')"
              selected-option-styles="!bg-gray !h-auto"
              label-key="name"
              filter-key="name"
            >
              <template
                #option="{ option: option, selectedList: selectedList }"
              >
                <div class="px-3 py-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="option?.icon"
                      class="w-7 h-7 bg-gray rounded-lg flex-center"
                    >
                      <img
                        :src="option?.icon"
                        alt="image icon"
                        class="w-[14px] object-cover"
                      />
                    </div>
                    <div class="text-dark transition-300">
                      {{ option?.name }}
                    </div>
                  </div>

                  <FCheckbox :checked="selectedList?.includes(option?.id)" />
                </div>
              </template>

              <template
                #selectedOption="{ value: selectedValues, remove: removeTag }"
              >
                <i
                  class="icon-chevron absolute right-2.5 flex-center h-4 transition-200 text-base text-gray-700 block shrink-0"
                  :class="{ '!rotate-180': onToggle }"
                ></i>
                <p v-if="!selectedValues.length" class="text-sm">
                  {{ $t("add_car_form.connector_placeholder") }}
                </p>
                <div
                  class="flex flex-wrap items-center justify-start gap-3 pr-2.5"
                >
                  <div
                    v-for="(so, idx) in selectedValues"
                    :key="idx"
                    class="flex items-center rounded-[4px] bg-gray px-2 py-1.5 gap-1"
                    :class="{ '!bg-white': !onToggle }"
                  >
                    <img
                      v-if="so?.icon"
                      :src="so?.icon"
                      alt="icon"
                      class="w-[14px] object-cover"
                    />
                    <p class="text-xs font-medium">{{ so?.name }}</p>
                    <div
                      @click="removeTag(so?.id)"
                      class="w-4 h-4 p-[3px] group hover:bg-red-100 flex items-center justify-center bg-[#66777929] rounded-full"
                    >
                      <i
                        class="icon-close text-gray-200 text-[6px] group-hover:text-red transition-300"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </FSelectMultiple>
          </FGroup>

          <FGroup :label="$t('add_car_form.number')">
            <CNumberOfCar v-model="form.values.state_number" />
          </FGroup>

          <div class="flex items-center justify-end gap-5">
            <CButton
              :text="$t('cancel')"
              variant="info"
              @click="$emit('close')"
            />
            <CButton
              type="button"
              :disabled="form.$v.value.$invalid"
              :text="$t('add')"
              @click="$emit('submit')"
            />
          </div>
        </form>
      </CCard>
    </template>
  </CDialog>
</template>

<style scoped></style>
