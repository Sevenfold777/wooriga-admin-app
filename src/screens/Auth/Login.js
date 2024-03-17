import React, { useState } from "react";
import { METHOD, _promise } from "../../api/ApiConfig";
import AuthLayout from "../../components/auth/AuthLayout";
import KakaoButton from "../../components/auth/socialLogin/KaKaoButton";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import { ROUTE_NAME } from "../../Strings";

const Footer = styled.View`
  margin: 10px 40px;
`;

const BottomTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BottomText = styled.Text`
  font-family: "nanum-regular";
  color: ${Colors.borderDark};
`;

export default function Login({ navigation, route: { params } }) {
  return (
    <AuthLayout>
      <KakaoButton />

      <Footer>
        <BottomTextContainer>
          <BottomText>{"회원 가입 완료 시 우리가"}</BottomText>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_NAME.TERMS_OF_USE)}
          >
            <BottomText style={{ color: "#0095f6", fontFamily: "nanum-bold" }}>
              {" 이용약관 "}
            </BottomText>
          </TouchableOpacity>
          <BottomText>및</BottomText>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_NAME.OPERATION_POLICY)}
          >
            <BottomText style={{ color: "#0095f6", fontFamily: "nanum-bold" }}>
              {" 운영정책 "}
            </BottomText>
          </TouchableOpacity>
        </BottomTextContainer>
        <BottomTextContainer>
          <BottomText>{"에 동의하게 됩니다"}</BottomText>
        </BottomTextContainer>
      </Footer>
    </AuthLayout>
  );
}
