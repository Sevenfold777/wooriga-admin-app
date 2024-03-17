import * as SecureStore from "expo-secure-store";
import axios from "axios";
import jwtDecode from "jwt-decode";
import authStore from "../stores/AuthStore";

export const SERVER_URL = "https://prod-backend.wool2ga.com";

/** http request method */
export const METHOD = {
  GET: { num: 0, type: "get" },
  POST: { num: 1, type: "post" },
  PATCH: { num: 2, type: "patch" },
  DELETE: { num: 3, type: "delete" },
  POST_FILES: { num: 4, type: "post" },
};

/** axios skeleton */
export async function _promise(method, url, body = {}) {
  let accessToken = authStore.accessToken;

  if (accessToken) {
    const accessTokenExpires = (await jwtDecode(accessToken)).exp;

    const now = parseInt(new Date().getTime() / 1000);
    // 5분 이내 token expires
    if (now + 300 > accessTokenExpires) {
      if (!authStore.isTokenRefreshing) {
        accessToken = await authStore.refreshAccessToken();
      } else {
        let refreshed = false;
        for (let i = 0; i < 20; i++) {
          if (accessToken !== authStore.accessToken) {
            refreshed = true;
            break;
          }

          await new Promise((res) => setTimeout(res, 500));
        }

        if (!refreshed) {
          return;
        }

        accessToken = authStore.accessToken;
      }
    }
  }

  // base config
  const baseConfig = {
    method: method.type,
    url: url,
    baseURL: SERVER_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(method.num === 4 && { "Content-Type": "multipart/form-data" }),
    },
  };

  // Additional Config (Based on Req METHOD)
  const config =
    method.num === 0 ? { ...baseConfig } : { ...baseConfig, data: body };

  try {
    const response = await axios(config);
    return response;
  } catch (e) {
    // addtional error handling needed
    console.log(e);
  }
}
