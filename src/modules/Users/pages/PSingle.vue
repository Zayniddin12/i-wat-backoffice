<script setup lang="ts">
import CPreloader from "@/components/CPreloader.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { useRoute, useRouter } from "vue-router";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { reactive } from "@vue/runtime-core";
import { ITabItem } from "@/components/Tab/CTab.types";
import { formatMoneyDecimal, formatPhoneNumber } from "@/utils";
import CButton from "@/components/Common/CButton.vue";
import TCars from "@/modules/Users/components/Tables/TCars.vue";
import TStations from "@/modules/Users/components/Tables/TStations.vue";
import EditUser from "@/modules/Users/components/Modals/EditUser.vue";
import BlockUser from "@/modules/Users/components/Modals/BlockUser.vue";
import THistoryOfCharging from "@/modules/Users/components/Tables/THistoryOfCharging.vue";
import THistoryOfTransactions from "@/modules/Users/components/Tables/THistoryOfTransactions.vue";
import ApiService from "@/services/ApiService";
import { IUser } from "@/modules/Auth/types";
import { useHandleError } from "@/composables/useHandleError";
import dayjs from "dayjs";
import CStatus from "@/components/Card/CStatus.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const router = useRouter();
const { handleError } = useHandleError();

const activeTab = ref<string>((route.query.tab as string) || "cars");
const showEditModal = ref(false);
const showLockModal = ref(false);
const loading = ref(false);

watch(activeTab, (newTab) => {
  router.push({
    query: {
      ...route.query,
      tab: newTab,
    },
  });
});

const isBlockedUser = computed(() => {
  return {
    type: userData.value?.active_status ? "lock" : "unlock",
    isBlocked: userData.value?.active_status,
  };
});

const breadcrumbRoutes = computed(() => {
  return [
    {
      name: t("side_menu.users"),
      route: "/users",
      link: true,
    },
    {
      name: t("side_menu.all_users"),
      route: "/users",
    },
    {
      name: userData.value?.full_name ?? t("user"),
      route: "",
      disabled: true,
    },
  ];
});
const tabList = reactive<ITabItem[]>([
  {
    label: t("cars"),
    value: "cars",
  },
  {
    label: t("stations"),
    value: "stations",
  },
  {
    label: t("history_of_charging"),
    value: "history_of_power",
  },
  {
    label: t("history_of_transactions"),
    value: "history_of_transactions",
  },
]);

const userData = ref<IUser>();

const openEditModal = () => {
  showEditModal.value = true;
};

const openLockModal = () => {
  showLockModal.value = true;
};

onMounted(() => {
  getUser();
});

function getUser() {
  loading.value = true;
  ApiService.get(`/user/${route.params.id}`)
    .then((res) => {
      userData.value = res.data;
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      loading.value = false;
    });
}

function editUser(data: IUser) {
  ApiService.put(`/user/${route.params.id}/`, {
    ...data,
    phone: userData.value?.phone,
  })
    .then(() => {
      getUser();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (showEditModal.value = false));
}

function changeStatus(type: string) {
  isBlockedUser.value.type = type;
  type === "lock"
    ? (isBlockedUser.value.isBlocked = false)
    : (isBlockedUser.value.isBlocked = true);
  ApiService.put(`/user/${route.params.id}/block-and-unblock/`, userData.value)
    .then(() => {
      getUser();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => (showLockModal.value = false));
}
</script>

<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb :routes="breadcrumbRoutes" />
  </Teleport>

  <CCommonHeader
    v-model="activeTab"
    :key="userData?.id"
    v-bind="{
      loading,
      tabList,
      image: userData?.avatar_url,
      title: userData?.full_name,
      subTitle: formatPhoneNumber(userData?.phone),
    }"
    is-editable
    class="mb-6"
  >
    <template #status>
      <CPreloader width="107px" height="24px" v-bind="{ loading }">
        <CStatus
          :text="userData?.active_status ? t('active') : t('blocked')"
          :status="userData?.active_status ? 'Available' : 'Unavailable'"
        />
      </CPreloader>
    </template>
    <template #details>
      <CProfileDashDetail
        :loading="loading"
        :title="formatMoneyDecimal(userData?.balance) + ' UZS'"
        :description="$t('users_module.table.balance')"
        active
      >
        <template #icon>
          <i class="icon-wallet text-primary text-lg" />
        </template>
      </CProfileDashDetail>

      <CProfileDashDetail
        :loading="loading"
        :title="userData?.charge_point_count || '-'"
        :description="$t('users_module.table.col_vo_station')"
      />

      <CProfileDashDetail
        :loading="loading"
        :title="userData?.car_count"
        :description="$t('users_module.table.col_vo_car')"
      />

      <CProfileDashDetail
        :loading="loading"
        :title="dayjs(userData?.date_joined).format('DD.MM.YYYY')"
        :description="$t('users_module.table.registration_date')"
      />
    </template>
    <template #actions>
      <div class="flex items-center gap-4">
        <CPreloader width="157px" height="36px" v-bind="{ loading }">
          <div class="flex flex-row items-center gap-4">
            <CButton
              :text="$t('edit')"
              icon="icon-edit !text-gray-300 pr-1"
              class="flex items-center py-2 px-4 gap-1"
              size="md"
              icon-position="left"
              variant="info"
              @click="openEditModal"
            />
            <CButton
              :variant="isBlockedUser.type === 'lock' ? 'error' : 'yellow'"
              :text="isBlockedUser.type === 'lock' ? $t('lock') : $t('unlock')"
              :icon="
                isBlockedUser.type === 'lock'
                  ? 'icon-lock text-xl pr-1'
                  : 'icon-unlocked text-xl pr-1'
              "
              icon-position="left"
              @click="openLockModal"
            />
          </div>
        </CPreloader>
      </div>
    </template>
  </CCommonHeader>

  <Transition name="fade" mode="out-in">
    <section :key="activeTab">
      <TCars v-if="activeTab === 'cars'" />
      <TStations v-if="activeTab === 'stations'" />
      <THistoryOfCharging v-if="activeTab === 'history_of_power'" />
      <THistoryOfTransactions v-if="activeTab === 'history_of_transactions'" />
    </section>
  </Transition>

  <EditUser
    @close="showEditModal = false"
    @submit="editUser"
    v-bind="{
      loading,
      user: userData,
      show: showEditModal,
    }"
  />
  <BlockUser
    :show="showLockModal"
    :type="isBlockedUser.type"
    @cancel="showLockModal = false"
    @block="changeStatus('unlock')"
    @unblock="changeStatus('lock')"
  />
</template>

<style scoped></style>
