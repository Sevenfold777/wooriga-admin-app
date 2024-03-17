import * as SecureStore from "expo-secure-store";
import { observable, runInAction } from "mobx";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../Strings";
import { METHOD, SERVER_URL, _promise } from "../api/ApiConfig";
import jwtDecode from "jwt-decode";
import axios from "axios";

const authStore = observable({
  // auth states
  isLoggedIn: false,
  accessToken: "",
  userId: 0,
  userName: "",
  permissionsChecked: false,
  isTokenRefreshing: false,

  // login action
  async loginAction({ accessToken, refreshToken }) {
    runInAction(() => {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
    });

    await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);
    }

    const me = await _promise(METHOD.GET, `users/my`);

    runInAction(() => {
      authStore.setUserId({
        userId: me?.data?.id,
        userName: me?.data?.userName,
      });
    });
  },

  // logout action
  async logoutAction() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN);

    runInAction(() => {
      this.isLoggedIn = false;
      this.accessToken = "";
    });
  },

  // set ids
  setUserId({ userId, userName }) {
    if (!userId || !userName) {
      return;
    }
    this.userId = userId;
    this.userName = userName;
  },

  async refreshAccessToken() {
    runInAction(() => {
      this.isTokenRefreshing = true;
    });

    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
    const refreshTokenExpires = (await jwtDecode(refreshToken)).exp;

    // refreshToken도 만료되었다면 로그아웃
    runInAction(() => {
      const now = new Date().getTime() / 1000;

      if (now > refreshTokenExpires) {
        this.logoutAction();
        return;
      }
    });

    // refresh ACCESS TOKEN
    const result = await axios({
      method: METHOD.PATCH.type,
      url: `users/refreshToken`,
      baseURL: SERVER_URL,
      data: { refreshToken },
    });

    runInAction(() => {
      if (!result || result.data?.ok === false) {
        this.logoutAction();
        return;
      }
    });

    await SecureStore.setItemAsync(ACCESS_TOKEN, result.data.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN, result.data.refreshToken);

    runInAction(() => {
      this.accessToken = result.data.accessToken;
      this.isTokenRefreshing = false;
    });

    return result.data.accessToken;
  },
});

export default authStore;
