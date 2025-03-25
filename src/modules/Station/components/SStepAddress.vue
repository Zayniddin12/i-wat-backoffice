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
          <FGroup :label="$t(`region`)">
            <FSelect
              v-model="form.values.region"
              :error="form.$v.value.region.$error"
              :options="regions"
              :placeholder="$t('select_region')"
              is-checked
            />
          </FGroup>
          <FGroup :label="$t(`city`)">
            <FSelect
              v-model="form.values.district"
              :error="form.$v.value.district?.$error"
              :options="districts"
              :placeholder="$t('select_city')"
              is-checked
            />
          </FGroup>
          <FGroup :label="$t('address')">
            <FInput
              v-model="form.values[`address_${nameValue}`]"
              :error="form.$v.value[`address_${nameValue}`]?.$error"
              :placeholder="$t('enter_address')"
            />
          </FGroup>
          <FGroup :label="$t('reference_point')">
            <FInput
              v-model="form.values[`landmark_${nameValue}`]"
              :error="form.$v.value[`landmark_${nameValue}`]?.$error"
              :placeholder="$t('enter_reference_point')"
            />
          </FGroup>
          <FGroup :label="$t('right_address')">
            <div class="h-[260px] relative shadow rounded-xl mb-5">
              <div ref="container" class="container" />
              <yandex-map
                :cluster-options="clusterSettings"
                :controls="[]"
                :coords="coords"
                :settings="mapSettings"
                :zoom="zoom"
                class="h-[260px] w-full"
                @boundschange="changeZoom"
                @click="onMapClick"
              >
                <ymap-marker
                  :coords="coords"
                  :icon="getIconMap()"
                  cluster-name="1"
                  marker-id="123"
                  v-bind="coords"
                />
              </yandex-map>
              <div
                ref="controls"
                class="flex right-3 flex-col gap-3 shadow rounded-[10px] p-2 bg-white absolute bottom-8"
              >
                <i
                  class="icon-plus text-xl text-center cursor-pointer hover:text-blue transition-300"
                  @click="zoom++"
                />
                <div class="h-px w-7 bg-gray-200" />
                <i
                  class="icon-minus text-xl text-center cursor-pointer hover:text-blue transition-300"
                  @click="zoom--"
                />
              </div>
            </div>
          </FGroup>
        </div>
      </Transition>
      <div class="space-x-4 mt-5 flex items-center justify-end">
        <CButton :text="$t('cancel')" variant="info" @click="emit('back')" />
        <CButton
          :disabled="form.$v.value.$error"
          :text="isEdit ? $t('save') : $t('add')"
          variant="primary"
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { ref, unref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import { tabListLanguage } from "@/modules/Station/data";
import CTabLang from "@/components/Tab/CTabLang.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import { useStationStore } from "@/modules/Station/store";
import { storeToRefs } from "pinia";

interface Props {
  form: TForm<any>;
  loading?: boolean;
  selectDisable?: boolean;
  isEdit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit", "back"]);

const form = unref(props.form);
const stationStore = useStationStore();
const { regions, districts } = storeToRefs(stationStore);
const nameValue = ref("uz");

const coords = ref([41.311081, 69.240562]);
const zoom = ref(10);

function changeZoom(e: any) {
  zoom.value = e?.originalEvent?.newZoom;
}

const mapSettings = {
  apiKey: "",
  lang: "ru_RU",
  coordorder: "latlong",
  version: "2.1",
};

const clusterSettings = {
  1: {
    clusterDisableClickZoom: false,
    clusterIconLayout: "default#imageWithContent",
    clusterIconImageHref: "/svg/cluste.svg",
    clusterIconContentLayout: `
        <div class="relative w-8 pointer-events-none -translate-x-2.5 -translate-y-10">
        <img src="/svg/marker.svg" alt="marker" class="w-8">
        <div class="w-6 h-6 rounded-full border border-white/[14%] absolute top-1 right-1 bg-white flex-center">
            <p class="text-sm leading-5 font-medium text-dark">{{ properties.geoObjects.length }}</p>
        </div>
    </div>

`,
  },
};

function getIconMap(image?: string) {
  return {
    layout: "default#imageWithContent",
    disableClickZoom: true,
    imageHref: "/svg/locationa.svg",
    contentLayout: `
        <div class="relative w-8 pointer-events-none -translate-x-2.5 -translate-y-10">
        <img src="/svg/marker.svg" alt="marker" class="w-8">
        <div class="w-6 h-6 rounded-full border border-white/[14%] absolute top-1 right-1">
<!--        <img src="${image}" class="w-6 h-6 rounded-full" alt="company">-->
        </div>
        </div>`,
  };
}

// fetch region and district
stationStore.fetchRegions();

watch(
  () => form.values.region,
  (value) => {
    if (value) {
      stationStore.fetchDistricts(value);
    }
  },
  { deep: true, immediate: true }
);

// watch coors
watch(
  () => coords.value,
  (value) => {
    if (value) {
      form.values.longitude = value[1];
      form.values.latitude = value[0];
    }
  },
  { deep: true }
);

watch(
  () => props.form.values,
  () => {
    if (form.values.longitude && form.values.latitude) {
      coords.value = [form.values.latitude, form.values.longitude];
    }
  },
  { deep: true, immediate: true }
);

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    emit("submit");
  }
}

async function onMapClick(event: any) {
  coords.value = event.get("coords");
  await fetchAddress(coords.value);
}

async function fetchAddress(coords: [number, number]) {
  try {
    const response = await axios.get(
      "https://panel.ebbuzbekistan.uz/api/v1/core/GetAddress/",
      {
        params: {
          lat: coords[0],
          long: coords[1],
        },
      }
    );
    const address = response.data.address; // Assuming the response contains an 'address' field
    form.values[`address_${nameValue.value}`] = address;
  } catch (error) {
    console.error("Error fetching address:", error);
  }
}
</script>
