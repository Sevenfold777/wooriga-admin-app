import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import { RowContainer } from "../Shared";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ROUTE_NAME } from "../../Strings";

const Container = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.isSent ? Colors.borderLight : Colors.white};
  justify-content: center;
  padding: 17px 20px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 3px 0px;
  border-radius: 10px;
  opacity: ${(props) => (props.isSent ? 0.5 : 1)};
`;

const TextBold = styled.Text`
  padding: 2px 0px;
  font-family: "nanum-bold";
`;

const Text = styled.Text`
  font-size: 13px;
  padding: 2px 0px;
  font-family: "nanum-regular";
`;

const DetailsContainer = styled.View`
  padding: 0px 10px;
`;

export function MessageItem({
  id,
  title,
  uploadAt,
  createdAt,
  sentCnt,
  familyCnt,
}) {
  const navigation = useNavigation();

  return (
    <Container
      onPress={() =>
        navigation.navigate(ROUTE_NAME.MESSAGE_SCREEN, {
          id,
          statQueryEnabled: sentCnt > 0,
        })
      }
      isSent={uploadAt < new Date()}
    >
      <RowContainer>
        <View style={{ flex: 1 }}>
          <TextBold numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </TextBold>

          <DetailsContainer>
            <Text>{`도착(예정)일: ${uploadAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</Text>
            <Text>{`작성일: ${createdAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</Text>
            <Text>{`발송 수: ${sentCnt} / ${familyCnt}`}</Text>
            <RowContainer></RowContainer>
          </DetailsContainer>
        </View>
        <Ionicons name="chevron-forward" size={15} color={Colors.borderDark} />
      </RowContainer>
    </Container>
  );
}
