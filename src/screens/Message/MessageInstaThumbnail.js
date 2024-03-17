import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Prompt, PromptText, RowContainer } from "../../components/Shared";
import Toast from "../../components/Toast";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import { Colors, EMOTION_KOREAN } from "../../Config";
import { Emotion, EmotionWrapper } from "../../components/Emotions";
import assetStore from "../../stores/assetStore";
import MessageInput from "../../components/message/MessageInput";
import InstaThumbnail from "../../components/message/InstaThumbnail";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SizeInput = styled.TextInput`
  font-family: "nanum-regular";
  padding: 10px;
  margin: 10px 15px;
  border-radius: 10px;
  border: 1px solid ${Colors.borderDark};
  background-color: white;
`;

export default function MessageInstaThumbnail({
  navigation,
  route: { params },
}) {
  const viewShotRef = useRef();
  const { width: pageWidth } = useWindowDimensions();

  const [emotionChosen, chooseEmotion] = useState("happy");
  const [payload, setPayload] = useState("");

  const [padding, setPadding] = useState("30");
  const [tempPadding, setTempPadding] = useState("30");
  const [fontSize, setFontSize] = useState("36");
  const [tempFontSize, setTempFontSize] = useState("36");

  const [isCenter, setCenter] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RowContainer style={{ alignItems: "center" }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            style={{
              marginRight: 12,
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setCenter(!isCenter);
            }}
          >
            <Text style={{ fontFamily: "nanum-regular" }}>
              {isCenter ? "왼쪽" : "중앙"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Ionicons name="trash-outline" size={26} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={async () => {
              Keyboard.dismiss();
              const uri = await viewShotRef?.current.capture();
              CameraRoll.save(uri, {
                type: "photo",
                album: "우리가 관리자",
              });

              Toast({ message: "저장되었습니다" });
            }}
          >
            <Ionicons name="download-outline" size={26} />
          </TouchableOpacity>
        </RowContainer>
      ),
    });
  }, [isCenter]);

  return (
    <ScreenLayout>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ fileName: `${new Date().getTime()}` }}
        >
          <InstaThumbnail
            payload={payload}
            onChagePayload={setPayload}
            emotion={emotionChosen}
            fontSize={parseInt(fontSize)}
            padding={parseInt(padding)}
            textAlignCenter={isCenter}
          />
        </ViewShot>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 20,
            marginBottom: 5,
          }}
        >
          {Object.keys(EMOTION_KOREAN).map((emotion) => (
            <EmotionWrapper key={emotion}>
              <TouchableOpacity
                onPress={() => {
                  chooseEmotion(emotion);
                }}
              >
                <Emotion
                  source={{ uri: assetStore.emotionsRound[emotion] }}
                  style={
                    emotionChosen !== emotion && {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    }
                  }
                  pageWidth={pageWidth + 30}
                />
              </TouchableOpacity>
              {/* <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName> */}
            </EmotionWrapper>
          ))}
        </ScrollView>
        <RowContainer style={{ paddingHorizontal: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.sub,
              marginHorizontal: 3,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Prompt>
              <PromptText>폰트 크기</PromptText>
            </Prompt>
            <SizeInput
              keyboardType="number-pad"
              maxLength={2}
              value={tempFontSize}
              onChangeText={(text) => setTempFontSize(text)}
              onEndEditing={() => {
                tempFontSize
                  ? setFontSize(tempFontSize)
                  : setTempFontSize(fontSize);
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: Colors.sub,
              marginHorizontal: 3,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Prompt>
              <PromptText>여백</PromptText>
            </Prompt>
            <SizeInput
              keyboardType="number-pad"
              maxLength={2}
              value={tempPadding}
              onChangeText={(text) => setTempPadding(text)}
              onEndEditing={() => {
                tempPadding ? setPadding(tempPadding) : setTempPadding(padding);
              }}
            />
          </View>
        </RowContainer>
      </KeyboardAwareScrollView>
    </ScreenLayout>
  );
}
