import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { BGColors, BottomPhrases, Colors, EMOTION_KOREAN } from "../../Config";
import { Emotion, EmotionWrapper } from "../Emotions";
import assetStore from "../../stores/assetStore";
import { View } from "react-native";
import { Image } from "react-native";
import { useRef } from "react";
import { PageContainer, PageText } from "./Message";

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

const PayloadInput = styled.TextInput`
  text-align: center;
  font-size: 28px;
  font-family: "kangwon-font";
`;

export const StartBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 10px;
  padding: 12px;
  border-radius: 10px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

export const StartBtnText = styled.Text`
  font-size: 16px;
  font-family: "nanum-bold";
`;

export default function MessageInput({
  emotion,
  payload,
  onChagePayload,
  isSquare = false,
  index,
  totalPages,
  showPageCount,
}) {
  const { width: pageWidth } = useWindowDimensions();

  const inputRef = useRef();

  return (
    <TouchableWithoutFeedback onPress={() => inputRef?.current?.focus()}>
      <Container pageWidth={pageWidth} emotion={emotion} isSquare={isSquare}>
        {showPageCount && (
          <PageContainer>
            <PageText>{`${index + 1} / ${totalPages}`}</PageText>
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
            <PayloadInput
              value={payload}
              onChangeText={(text) => onChagePayload(text)}
              numberOfLines={2}
              allowFontScaling={false}
              multiline={true}
              ref={inputRef}
            />
          </View>

          <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
}
