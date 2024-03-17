import { getProfile, login } from "@react-native-seoul/kakao-login";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { METHOD, _promise } from "../../../api/ApiConfig";
import { loginApi } from "../../../api/AuthApi";
import authStore from "../../../stores/AuthStore";
import BaseButton from "./BaseButton";

export default function KakaoButton({}) {
  /** react-query: socialLogin */
  // const socialLogin = useMutation(socialLoginApi);
  const loginWithToken = useMutation(loginApi); // 최신 api

  const loginKakao = async () => {
    const token = await login();
    const user = await getProfile();

    // console.log(user);

    // token.idToken jwt decode 하면 result.email 구할 수 있음
    // token.accessToken은? expire 시간은 같음 but jwt decode로 안됨

    loginWithToken.mutate(
      { token: token.accessToken, provider: "kakao" },
      {
        onSuccess: async (data) => {
          const {
            data: { ok, accessToken, refreshToken },
            // config: { data: user },
          } = data;

          // const userObj = JSON.parse(user);

          if (ok) {
            // 2. mobx 활용 - 전역 login State === true
            authStore.loginAction({ accessToken, refreshToken });
          }
        },
      }
    );
  };

  return (
    <BaseButton
      bgColor="#f1d905"
      logoPath={require("../../../../assets/images/kakao.png")}
      onPress={loginKakao}
      textPayload="카카오톡으로 로그인"
    />
  );
}
