import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import {
  AgeDistribution,
  GenderStats,
  IAppUsageStats,
  IMainInfo,
  IResponseUsageStats,
} from "@/modules/Dashboard/types";

export const useDashboardStore = defineStore("dashboardStore", {
  state: () => ({
    data: {} as IMainInfo,
    ageStats: {} as AgeDistribution,
    genderStats: {} as GenderStats,
    appUsageStats: {} as IAppUsageStats,
    dateFrom: "" as string,
    dateTo: "" as string,
    loading: true,
  }),
  actions: {
    fetchMainData() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .get<IMainInfo>("backoffice/MainInfo")
          .then((response) => {
            this.data = response.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async fetchAgeStats() {
      const { data } = await apiService.get(
        `/dashboard-age${
          this.dateFrom ? `/?timestamp_gte=${this.dateFrom}` : ""
        }${this.dateTo ? `&timestamp_lte=${this.dateTo}` : ""}`
      );
      this.ageStats = data;
    },
    async fetchGenderStats() {
      const { data } = await apiService.get(
        `/dashboard-gender${
          this.dateFrom ? `/?timestamp_gte=${this.dateFrom}` : ""
        }${this.dateTo ? `&timestamp_lte=${this.dateTo}` : ""}`
      );
      this.genderStats = data;
    },
    async fetchAppUsageStats() {
      const { data } = await apiService.get<IResponseUsageStats>(
        `/dashboard-chart${
          this.dateFrom ? `/?timestamp_gte=${this.dateFrom}` : ""
        }${this.dateTo ? `&timestamp_lte=${this.dateTo}` : ""}`
      );
      const dailyStatistics = Object.entries(data.daily_statistics).map(
        ([hour, count]) => ({
          hour: parseInt(hour),
          count,
        })
      );

      const monthlyStatistics = Object.entries(data.yearly_statistics).map(
        ([month, count]) => ({
          month: parseInt(month),
          count,
        })
      );

      this.appUsageStats.daily_statistics = dailyStatistics;
      this.appUsageStats.yearly_statistics = monthlyStatistics;
    },
  },
});
