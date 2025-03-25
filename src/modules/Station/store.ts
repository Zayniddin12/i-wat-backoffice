import { defineStore } from "pinia";
import { ref } from "vue";
import ApiService from "@/services/ApiService";
import {
  IDistrict,
  IRegion,
  IUserSelector,
} from "@/modules/Station/types/interface";

export const useStationStore = defineStore("station", () => {
  const stations = ref([]);
  const regions = ref<Array<IRegion>>([]);
  const districts = ref<Array<IDistrict>>([]);
  const userSelectors = ref<Array<IUserSelector>>([]);
  const columnsList = ref<Array<{ id: number; label: string; value: string }>>(
    []
  );
  const loadingUserList = ref(false);

  const fetchRegions = async () => {
    if (regions.value.length) return;

    ApiService.get<Array<IRegion>>("/regions").then((response) => {
      regions.value = response.data;
    });
  };

  const fetchDistricts = async (regionId: number) => {
    ApiService.get<Array<IDistrict>>(`/districts/${regionId}`).then(
      (response) => {
        districts.value = response.data;
      }
    );
  };

  const fetchUserSelectors = async () => {
    loadingUserList.value = true;
    ApiService.get<Array<IUserSelector>>("/select-user-list").then(
      (response) => {
        userSelectors.value = response.data;
        loadingUserList.value = false;
      }
    );
  };

  return {
    stations,
    regions,
    districts,
    userSelectors,
    columnsList,
    loadingUserList,

    fetchRegions,
    fetchDistricts,
    fetchUserSelectors,
  };
});
