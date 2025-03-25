import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import {
  IFinishLoginResponse,
  ILoginPostData,
  ILoginResponse,
  IRequestOtpResponse,
  IUser,
  IVerifyOtpPostData,
} from "@/modules/Auth/types";
import { JwtService } from "@/services/JwtService";
import { convertPhoneNumberToString } from "@/utils/changeNumberFormat";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: {} as IUser,
    loginResponse: {} as ILoginResponse,
    requestOtpResponse: {} as IRequestOtpResponse,
    profileLoading: true,
    blockedTime: 0,
  }),
  actions: {
    login(params: ILoginPostData) {
      const phone = `+998${convertPhoneNumberToString(params.phone)}`;
      return new Promise((resolve, reject) => {
        apiService
          .post<ILoginPostData, ILoginResponse>("/auth/Login/", {
            phone,
          })
          .then((res) => {
            this.loginResponse = res.data;
            this.loginResponse.phone_number = phone;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    verifyOtp(otp: string) {
      return new Promise((resolve, reject) => {
        apiService
          .post<IVerifyOtpPostData>("auth/LoginConfirm/", {
            phone: this.loginResponse.phone_number,
            code: otp,
            type_: "backoffice_login_sms_verification",
            session: this.loginResponse?.session,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    finishLogin(tokens: IFinishLoginResponse) {
      JwtService.saveToken(tokens.access_token);
      JwtService.saveRefreshToken(tokens.refresh_token);
    },
    fetchUserData() {
      apiService.setHeader();
      this.profileLoading = true;
      return new Promise((resolve, reject) => {
        apiService
          .get<IUser>("users/CurrentUser")
          .then((res) => {
            this.user = res.data;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.profileLoading = false;
            }, 500);
          });
      });
    },
    logout() {
      JwtService.destroyAccess();
      JwtService.destroyRefresh();
      apiService.setHeader();
      this.user = {} as IUser;
    },
  },
});
