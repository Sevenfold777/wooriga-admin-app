import styled from "styled-components/native";
import { BGColors, BottomPhrases } from "../../Config";
import { View, useWindowDimensions } from "react-native";
import { Image } from "react-native";
import assetStore from "../../stores/assetStore";

const Container = styled.View`
  background-color: ${(props) => BGColors[props.emotion]};
  width: ${(props) => `${props.pageWidth}px`};
  aspect-ratio: ${(props) => (props.isSquare ? 1 : 4 / 3)};
`;

const PromotePayload = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 28px;
  font-family: "kangwon-font";
`;

export const PageContainer = styled.View`
  position: absolute;
  right: 10px;
  top: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const PageText = styled.Text`
  font-family: "nanum-regular";
  color: white;
`;

export default function Message({
  emotion = "happy",
  payload = "예시 문장",
  index,
  totalPages,
  isSquare = false,
  showPageCount,
}) {
  const { width: pageWidth } = useWindowDimensions();

  return (
    <Container pageWidth={pageWidth} emotion={emotion} isSquare={isSquare}>
      {showPageCount && (
        <PageContainer>
          <PageText style={{ fontFamily: "nanum-regular", color: "white" }}>{`${
            index + 1
          } / ${totalPages}`}</PageText>
        </PageContainer>
      )}
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        <View
          style={{ flex: 2, ...(isSquare && { justifyContent: "flex-end" }) }}
        >
          <Image
            source={{
              uri: assetStore.messageEmotions[emotion],
            }}
            resizeMode="contain"
            style={{
              width: 50,
              height: 50,
              margin: 12,
            }}
          />
        </View>

        <View style={{ flex: 5 }}>
          <MessagePayload numberOfLines={2} allowFontScaling={false}>
            {payload}
          </MessagePayload>
        </View>

        <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
      </View>
    </Container>
  );
}
