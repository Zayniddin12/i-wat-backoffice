<template>
  <div>
    <span class="h-[1px] bg-gray w-full block" />
    <div class="p-5 flex flex-col gap-4">
      <FGroup :label="$t('connector')">
        <FSelect
          v-model="form.values.name"
          :error="form.$v.value.name?.$error"
          :options="options"
          isIcon
          :placeholder="$t('select_connector')"
          is-checked
          label-key="name"
          selectedOptionStyles="!bg-gray"
          value-key="id"
        />
      </FGroup>
      <FGroup :label="$t('power')">
        <div class="flex gap-2 items-center">
          <FInput
            v-model="form.values.power"
            :error="form.$v.value.power?.$error"
            placeholder="0"
            type="number"
          />
          <FSelect
            v-model="form.values.power_size"
            :error="form.$v.value.power_size?.$error"
            :options="powerUnits"
            is-checked
            label-key="name"
            selectedOptionStyles="!w-[max-content] !bg-gray"
            value-key="id"
          />
        </div>
      </FGroup>

      <FGroup :label="$t('price_by', { size: activePowerUnitName })">
        <FInput
          v-model="form.values.price"
          :error="form.$v.value.price?.$error"
          :placeholder="0"
          type="number"
        >
          <template #suffix>
            <span class="text-gray-200 text-sm">UZS</span>
          </template>
        </FInput>
      </FGroup>
    </div>
    <span class="h-[1px] bg-gray w-full block" />
    <div class="p-5 flex justify-end">
      <div class="flex gap-4 items-center">
        <CButton :text="$t('cancel')" variant="info" @click="$emit('cancel')" />
        <CButton
          :disabled="form.$v.value.$invalid"
          :text="$t('add')"
          @click="$emit('submit')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref, watch } from "vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import apiService from "@/services/ApiService";
import { ChargingStation } from "@/modules/Station/types/interface";
import { IResponse } from "@/types/common";
import { TForm } from "@/composables/useForm";

const props = defineProps<{
  form: TForm<any>;
}>();
defineEmits(["submit", "cancel"]);

const form = unref(props.form);
const options = ref<Array<ChargingStation>>([]);
const powerUnits = ref<Array<{ id: number; name: string }>>([]);
const activePowerUnitName = ref<string>("");

const getOptions = () => {
  apiService.get<IResponse<ChargingStation>>("/chargingtypes").then((res) => {
    options.value = res.data.results;
  });
};

const getPowerUnits = () => {
  apiService
    .get<Array<{ id: number; name: string }>>("/power-units")
    .then((res) => {
      powerUnits.value = res.data;
    });
};

onMounted(() => {
  getOptions();
  getPowerUnits();
});

watch(
  () => form.values.power_size,
  (value) => {
    activePowerUnitName.value = powerUnits.value.find(
      (unit) => unit.id === value
    )?.name;
  }
);
</script>
