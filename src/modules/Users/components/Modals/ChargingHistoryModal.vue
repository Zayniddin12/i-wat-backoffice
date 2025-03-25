<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { IHistoryCharging } from "@/modules/Users/types";
import { defineProps, withDefaults } from "vue";
import CAvatar from "@/components/CAvatar.vue";
import { changeNumberFormat } from "@/utils/changeNumberFormat";
import dayjs from "dayjs";
import CButton from "@/components/Common/CButton.vue";

const props = withDefaults(
  defineProps<{
    data: IHistoryCharging;
    show: boolean;
  }>(),
  {
    show: false,
  }
);

const emit = defineEmits(["openCheck"]);
</script>

<template>
  <div>
    <CDialog
      :show="show"
      @close="() => $emit('close')"
      :title="$t('charging_history_modal.title')"
      body-class="!w-[540px]"
    >
      <template #default>
        <div class="flex flex-col space-y-5 p-5">
          <div class="flex flex-row space-x-4 items-center">
            <div
              class="w-1/2 px-3 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.user")
              }}</span>

              <div class="flex-y-center gap-3">
                <CAvatar
                  :image="data?.user?.avatar_url"
                  avatar-class="!w-8 !h-8 before:border"
                />
                <div>
                  <div>
                    <div class="flex items-center gap-1">
                      <h5
                        class="font-semibold text-dark text-sm leading-130 mb-0.5 transition-300"
                      >
                        {{ data?.user?.full_name }}
                      </h5>
                    </div>
                  </div>
                  <p class="text-xs text-gray-300 leading-130">
                    {{ data?.user?.phone }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-if="data?.car"
              class="w-1/2 px-3 py-2.5 bg-gray-700 rounded-lg"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.car")
              }}</span>
              <div class="flex-y-center gap-3">
                <CAvatar
                  :image="data?.car?.manufacturer_icon"
                  avatar-class="!w-8 !h-8 before:border"
                />
                <div>
                  <div>
                    <div class="flex items-center gap-1">
                      <h5
                        class="font-medium text-dark text-sm leading-130 mb-0.5 transition-300"
                      >
                        {{ data?.car?.manufacturer_name }}
                      </h5>
                    </div>
                    <slot name="feature"></slot>
                  </div>
                  <p class="text-xs text-gray-300 leading-130">
                    {{ data?.car?.model_name }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="px-3 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
          >
            <span class="text-gray-100 text-sm font-normal">{{
              $t("charging_history_modal.location")
            }}</span>

            <div class="flex flex-row space-x-2 items-center">
              <img
                class="w-[28px] h-[28px]"
                src="@/assets/svg/map-pin.svg"
                alt="location icon"
              />

              <p class="text-dark text-xs font-semibold">
                {{ data?.address_name }}
              </p>
            </div>
          </div>

          <div class="flex flex-row space-x-4">
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.station_name")
              }}</span>

              <div class="flex flex-row space-x-2 items-center">
                <i class="icon-plugin-open text-blue-200 text-[28px]" />

                <p class="text-dark text-xs font-semibold">
                  {{ data?.address_name }}
                </p>
              </div>
            </div>
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.connector")
              }}</span>

              <div class="flex flex-row space-x-2 items-center">
                <span
                  class="min-w-7 flex items-center justify-center w-7 min-h-7 h-7 bg-white rounded-lg"
                  >1</span
                >

                <p class="text-gray-300 text-xs font-semibold">
                  <span class="text-dark">A</span> TYPE 1 J1772
                </p>
              </div>
            </div>
          </div>

          <div
            class="px-3 w-full py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-2.5"
          >
            <div class="flex flex-row space-x-1 items-center">
              <img class="" src="@/assets/svg/parking.svg" alt="parking icon" />
              <span class="text-dark text-sm font-semibold">{{
                $t("charging_history_modal.parking.title")
              }}</span>
            </div>

            <div class="flex flex-row w-full space-x-4">
              <div class="w-1/2 flex flex-col space-y-1">
                <span class="text-gray-100 text-xs font-normal">{{
                  $t("charging_history_modal.parking.time")
                }}</span>
                <span class="text-dark text-sm font-medium">08:10:20</span>
              </div>
              <div class="w-1/2 flex flex-col space-y-1">
                <span class="text-gray-100 text-xs font-normal">{{
                  $t("charging_history_modal.parking.cost")
                }}</span>
                <span class="text-dark text-sm font-medium">{{
                  changeNumberFormat(+data?.parking_cost)
                }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-row space-x-4 items-center">
            <div
              class="px-3 w-1/2 min-h-[64px] max-h-[64px] py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.power")
              }}</span>

              <div class="flex flex-row space-x-1 items-center">
                <i class="icon-flesh text-blue-300" />

                <p class="text-dark text-sm font-medium">44.4 kw</p>
              </div>
            </div>
            <div
              class="px-3 w-1/2 max-h-[64px] py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.charged")
              }}</span>

              <span
                class="text-white flex items-center justify-center text-xs font-medium p-1 w-[34px] h-6 min-h-6 min-w-[34px] rounded-md bg-red border-2 border-dark/20"
                >10%</span
              >
            </div>
          </div>
          <div class="flex flex-row space-x-4 items-center">
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.charging_started")
              }}</span>

              <div class="flex flex-row space-x-1 items-center">
                <i class="icon-time text-orange" />
                <p class="text-dark text-sm font-medium">
                  {{ dayjs(data?.start_timestamp).format("DD.MM.YYYY") }}
                </p>
                <p class="text-gray-300 text-sm font-semibold">
                  {{ dayjs(data?.start_timestamp).format("HH:MM") }}
                </p>
              </div>
            </div>
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.charging_end")
              }}</span>

              <div class="flex flex-row space-x-1 items-center">
                <i class="icon-time text-orange" />
                <p class="text-dark text-sm font-medium">
                  {{ dayjs(data?.end_timestamp).format("DD.MM.YYYY") }}
                </p>
                <p class="text-gray-300 text-sm font-semibold">
                  {{ dayjs(data?.end_timestamp).format("HH:MM") }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-row space-x-4 items-center">
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.charged_kwh")
              }}</span>

              <div class="flex flex-row space-x-1 items-center">
                <i class="icon-bettary text-blue-300" />
                <p class="text-dark text-sm font-medium">
                  {{ $t("kwh", { count: 1.95 }) }}
                </p>
              </div>
            </div>
            <div
              class="px-3 w-1/2 py-2.5 bg-gray-700 rounded-lg flex flex-col space-y-1"
            >
              <span class="text-gray-100 text-sm font-normal">{{
                $t("charging_history_modal.paid")
              }}</span>

              <div class="flex flex-row space-x-1 items-center">
                <i class="icon-bild-check text-green" />
                <p class="text-dark text-sm font-medium">
                  {{ changeNumberFormat(+data?.payed_cost) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="border-t border-gray p-5">
          <CButton
            @click="[emit('openCheck'), emit('close')]"
            class="w-full bg-primary/[25%] [&_*]:!text-primary [&_*]:hover:!text-white [&_*]:duration-200 [&_*]:transition-all"
            :text="$t('charging_history_modal.show_check')"
            ><span class="!text-primary">{{
              $t("charging_history_modal.show_check")
            }}</span>
          </CButton>
        </div>
      </template>
    </CDialog>
  </div>
</template>

<style scoped></style>
