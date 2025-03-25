<template>
  <CCard class="!p-0 relative">
    <div
      v-show="checkRouteFromUser"
      class="back absolute -left-[14px] top-6 h-7 w-7 flex align-center items-center justify-center bg-white rounded-full cursor-pointer"
      @click="back"
    >
      <i class="icon-chevron-left text-xs text-gray-200" />
    </div>
    <div v-if="!checkRouteFromUser" class="p-6 pb-0 flex gap-5">
      <CPreloader :loading="loading" height="135px" width="135px">
        <div
          class="!w-[132px] !h-[132px] flex-none flex items-center justify-center rounded-lg overflow-hidden bg-gray"
        >
          <img
            v-if="image"
            :src="image"
            alt="title"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="icon-plugin-open text-[88px] text-gray-300"
          ></span>
        </div>
      </CPreloader>
      <div class="flex flex-col w-full">
        <div class="flex-grow flex justify-between">
          <div>
            <CPreloader :loading="loading" height="31px" width="235px">
              <slot name="title">
                <div class="flex items-center space-x-3">
                  <h1
                    v-if="title"
                    class="mb-0.5 text-dark font-medium leading-130 text-[22px]"
                  >
                    {{ title }}
                  </h1>
                  <slot name="status" />
                </div>
              </slot>
            </CPreloader>
            <CPreloader
              :loading="loading"
              height="31px"
              preloader-class="mt-1"
              width="135px"
            >
              <slot name="subTitle">
                <p v-if="subTitle" class="text-sm text-gray-300 leading-130">
                  {{ subTitle }}
                </p>
              </slot>
            </CPreloader>
          </div>

          <div>
            <slot name="actions">
              <div class="flex-y-center space-x-5">
                <CButton
                  text=""
                  class="flex items-center py-2 px-4 gap-2"
                  icon="icon-trash
                  !text-red-400 text-xl"
                  icon-position="left"
                  size="md"
                  variant="error"
                  @click="$emit('delete')"
                />
                <CButton
                  :text="$t('edit')"
                  class="flex items-center py-2 px-4 gap-2"
                  icon="icon-edit
                  !text-gray-300 pr-1 text-xl"
                  icon-position="left"
                  size="md"
                  variant="info"
                  @click="$emit('edit')"
                />
                <CButton
                  :text="$t('add_columns')"
                  class="flex items-center py-2 px-4 gap-2"
                  icon="icon-plus pr-1"
                  icon-position="left"
                  size="md"
                  @click="emit('add')"
                />
              </div>
            </slot>
          </div>
        </div>
        <div class="flex gap-4">
          <template v-if="loading">
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
          </template>
          <template v-else>
            <slot name="details">
              <CProfileDashDetail
                :description="$t('added_at')"
                title="16.09.2022 / 09:41"
              />

              <CProfileDashDetail
                :description="$t('parking_price')"
                :title="formatPhoneNumber('+998712007007')"
              />
            </slot>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="p-6 pb-0 flex gap-5">
      <div class="flex flex-col w-full">
        <div class="flex-grow flex justify-between">
          <div>
            <CPreloader :loading="loading" height="31px" width="235px">
              <slot name="title">
                <div class="flex items-center space-x-3">
                  <h1
                    v-if="title"
                    class="mb-0.5 text-dark font-medium leading-130 text-[22px]"
                  >
                    {{ title }}
                  </h1>
                  <slot name="status" />
                </div>
              </slot>
            </CPreloader>
            <CPreloader
              :loading="loading"
              height="31px"
              preloader-class="mt-1"
              width="135px"
            >
              <slot name="subTitle">
                <p v-if="subTitle" class="text-sm text-gray-300 leading-130">
                  {{ subTitle }}
                </p>
              </slot>
            </CPreloader>
          </div>

          <div>
            <slot name="actions"></slot>
          </div>
        </div>
        <div v-show="!checkRouteFromUser" class="flex gap-4">
          <template v-if="loading">
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
            <CProfileDashDetail
              title="16.09.2022 / 09:41"
              v-bind="{ loading }"
            />
          </template>
          <template v-else>
            <slot name="details">
              <CProfileDashDetail
                :description="$t('added_at')"
                title="16.09.2022 / 09:41"
              />

              <CProfileDashDetail
                :description="$t('parking_price')"
                :title="formatPhoneNumber('+998712007007')"
              />
            </slot>
          </template>
        </div>
      </div>
    </div>
    <div class="w-full pl-6 mt-7">
      <hr class="border-gray" />
    </div>
    <CTab
      v-model="activeTab"
      :list="tabList"
      active-items-class="!font-medium text-primary"
      item-class="!text-base font-normal"
    />
  </CCard>
</template>
<script lang="ts" setup>
import CCard from "@/components/Card/CCard.vue";
import CTab from "@/components/Tab/CTab.vue";
import { computed, ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { formatPhoneNumber } from "@/utils";
import { ITabItem } from "@/components/Tab/CTab.types";
import CPreloader from "@/components/CPreloader.vue";
import { useRoute, useRouter } from "vue-router";

interface Props {
  modelValue?: string;
  image?: string;
  title?: string;
  date?: string;
  subTitle?: string;
  loading?: boolean;
  tabList?: ITabItem[];
}

const props = withDefaults(defineProps<Props>(), {
  image: "",
  title: "-",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "delete"): void;
  (e: "edit"): void;
  (e: "add"): void;
}>();

const route = useRoute();
const router = useRouter();

const activeTab = ref(props?.modelValue);

const checkRouteFromUser = computed(() => {
  return route.query?.isFromUser === "true";
});

const back = () => router.back();
watch(
  () => activeTab.value,
  (val) => {
    emit("update:modelValue", val ?? "");
  }
);

watch(
  () => props.modelValue,
  () => {
    activeTab.value = props.modelValue;
  }
);
</script>

<style scoped>
.back {
  box-shadow: 0 4px 20px 0 rgba(8, 10, 21, 0.2);
}
</style>
