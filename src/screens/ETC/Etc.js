import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import authStore from "../../stores/AuthStore";
import { Colors } from "../../Config";

const Wrapper = styled.View`
  height: 100%;
`;

const LogOutBtn = styled.TouchableOpacity`
  padding: 15px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
  border-radius: 10px;
  margin: 10px;
`;
const LogOutText = styled.Text`
  font-family: "nanum-regular";
`;

export default function Etc({ navigation, route }) {
  return (
    <ScreenLayout>
      <Wrapper style={{ justifyContent: "flex-end" }}>
        <LogOutBtn onPress={() => authStore.logoutAction()}>
          <LogOutText>로그아웃</LogOutText>
        </LogOutBtn>
      </Wrapper>
    </ScreenLayout>
  );
}
