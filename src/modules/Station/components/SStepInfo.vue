<template>
  <div class="pl-5">
    <div class="w-full bg-white rounded-xl space-y-4">
      <CTabLang
        v-model="nameValue"
        :list="tabListLanguage"
        class="!w-full"
        withIcon
      />

      <Transition mode="out-in" name="fade">
        <div :key="nameValue" class="mt-6 space-y-5">
          <FGroup :label="$t(`ezc_name`)">
            <FInput
              v-model="form.values[`name_${nameValue}`]"
              :error="form.$v.value[`name_${nameValue}`]?.$error"
              :placeholder="$t('enter_ezc_name')"
            />
          </FGroup>
          <FGroup :label="$t('ezc_price')">
            <FInput
              v-model="form.values.price_parking"
              v-maska="moneyMask()"
              :error="form.$v.value.price_parking?.$error"
              placeholder="0"
            >
              <template #suffix>
                <span class="text-sm font-normal text-gray-200">UZS</span>
              </template>
            </FInput>
          </FGroup>
        </div>
      </Transition>
      <div class="space-x-4 mt-5 flex items-center justify-end">
        <CButton :text="$t('cancel')" variant="info" @click="emit('close')" />
        <CButton
          :disabled="form.$v.value.$error"
          :text="$t('next')"
          variant="primary"
          @click="next"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { ref, unref } from "vue";
import CButton from "@/components/Common/CButton.vue";
import { tabListLanguage } from "@/modules/Station/data";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { moneyMask } from "@/utils";

interface Props {
  form: TForm<any>;
  loading?: boolean;
  selectDisable?: boolean;
  isEdit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit", "back", "next", "close"]);

const form = unref(props.form);
const nameValue = ref("uz");

function next() {
  form.$v.value.$touch();

  if (!form.$v.value.$invalid) {
    emit("next");
  }
}
</script>
