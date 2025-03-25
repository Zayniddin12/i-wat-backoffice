<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, onMounted, watch } from "vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import CButton from "@/components/Common/CButton.vue";
import FSelectMultiple from "@/components/Form/Select/FSelectMultiple.vue";
import { ref } from "vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import ApiService from "@/services/ApiService";

const props = withDefaults(
  defineProps<{
    data?: any;
    show: boolean;
  }>(),
  {
    show: false,
  }
);
defineEmits<{
  (event: "close"): void;
  (event: "submit", value: any): void;
}>();
const carMarks = ref([]);
const carModels = ref([]);
const connectors = ref([]);
const onToggle = ref(false);
const form = useForm(
  {
    manufacturer: null,
    model: null,
    charging_type: [],
  },
  {
    manufacturer: { required },
    model: { required },
    charging_type: { required },
  },
  { $stopPropagation: true }
);

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
  // getCarModels();
  ApiService.get(`chargingtypes`, "?limit=1000").then((res) => {
    connectors.value = res.data.results;
  });
});

watch(
  () => form.values.manufacturer,
  (val) => {
    if (val) {
      getCarModels();
    }
  }
);

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.values.manufacturer = val?.manufacturer?.id;
      form.values.model = val?.model?.id;
      val?.charging_type.forEach((el: any) => {
        if (!form.values.charging_type.includes(el?.id)) {
          form.values.charging_type.push(el?.id);
        }
      });
    }
  }
);
watch(
  () => props.show,
  () => {
    if (!props.show) {
      form.$v.value.$reset();
      form.values.model = null;
      form.values.manufacturer = null;
      form.values.charging_type = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <CDialog
      :show="show"
      @close="() => $emit('close')"
      :title="$t('add_car_form.edit')"
      body-class="!w-[421px]"
    >
      <template #default>
        <form @submit.prevent class="grid grid-cols-1 px-5 pt-4 pb-5 gap-5">
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
              filter-key="name"
              :error="form.$v.value.charging_type.$error"
              @on-toggle="onToggle = $event"
              :placeholder="$t('add_car_form.connector_placeholder')"
              selected-option-styles="!bg-gray !h-auto"
              label-key="name"
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

          <div class="flex items-center gap-3 justify-end">
            <CButton
              :text="$t('cancel')"
              variant="info"
              @click="() => $emit('close')"
            />
            <CButton
              :disabled="form.$v.value.$invalid"
              :text="$t('save')"
              @click="$emit('submit', form.values)"
            />
          </div>
        </form>
      </template>
    </CDialog>
  </div>
</template>

<style scoped></style>
