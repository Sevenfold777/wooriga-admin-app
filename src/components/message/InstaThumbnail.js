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
import { useEffect, useRef, useState } from "react";
import { PageContainer, PageText } from "./Message";

const Container = styled.View`
  /* padding: ${(props) => `${props.padding}px ${props.padding + 10}px`}; */
  background-color: ${(props) => BGColors[props.emotion]};
  width: ${(props) => `${props.pageWidth}px`};
  aspect-ratio: 1;
`;

const PayloadInput = styled.TextInput`
  /* font-size: ${(props) => `${props.fontSize}px`};
  line-height: ${(props) => `${props.fontSize + 8}px`}; */
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

export default function InstaThumbnail({
  emotion,
  payload,
  onChagePayload,
  fontSize = 36,
  padding = 30,
  textAlignCenter,
}) {
  const { width: pageWidth } = useWindowDimensions();
  const [textCenter, setTextCenter] = useState(textAlignCenter);
  const [fontSizeNew, setFontSizeNew] = useState(fontSize);
  const [paddingNew, setPaddingNew] = useState(padding);

  useEffect(() => {
    setTextCenter(textAlignCenter);
  }, [textAlignCenter]);

  useEffect(() => {
    setFontSizeNew(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setPaddingNew(padding);
  }, [padding]);

  const inputRef = useRef();

  return (
    <TouchableWithoutFeedback onPress={() => inputRef?.current?.focus()}>
      <Container
        pageWidth={pageWidth}
        emotion={emotion}
        style={{
          paddingVertical: paddingNew,
          paddingHorizontal: paddingNew + 10,
        }}
      >
        <View>
          {/* <View style={{ flex: 5 }}> */}
          <PayloadInput
            value={payload}
            onChangeText={(text) => onChagePayload(text)}
            allowFontScaling={false}
            multiline={true}
            ref={inputRef}
            fontSize={fontSizeNew}
            style={{
              textAlign: textCenter ? "center" : "left",
              fontSize: fontSizeNew,
              lineHeight: fontSizeNew + 8,
            }}
          />
        </View>

        <View style={{ position: "absolute", bottom: 10, right: 10 }}>
          {/* <View style={{ flex: 2, justifyContent: "flex-end" }}> */}
          <Image
            source={{
              uri: assetStore.messageEmotions[emotion],
            }}
            resizeMode="contain"
            style={{
              width: 65,
              height: 65,
              margin: 12,
            }}
          />
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
}
