import {
  DeviceEventEmitter,
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import MessageInput, {
  StartBtn,
  StartBtnText,
} from "../../components/message/MessageInput";
import { BGColors, Colors, EMOTION_KOREAN } from "../../Config";
import { Emotion, EmotionWrapper } from "../../components/Emotions";
import { TouchableOpacity } from "react-native";
import assetStore from "../../stores/assetStore";
import { useEffect, useRef, useState } from "react";
import DismissKeyboard from "../../components/DismissKeyboard";
import {
  Prompt,
  PromptText,
  RowContainer,
  SelectionContainer,
  SelectionText,
} from "../../components/Shared";
import Toast from "../../components/Toast";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import styled from "styled-components/native";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createMessageApi, editMessageApi } from "../../api/MessageApi";
import Modal from "../../components/Modal";
import DatePicker from "react-native-date-picker";
import { ROUTE_NAME, ServiceLinked } from "../../Strings";

const NewPageBtn = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px 0px;
  border-radius: 10px;
  background-color: ${Colors.sub};
  margin: 0px 2px;
`;

const NewPageBtnText = styled.Text`
  font-family: "nanum-bold";
`;

export default function MessageAdd({ navigation, route: { params } }) {
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const viewShotRef = useRef();
  const { width: pageWidth } = useWindowDimensions();

  const [pages, setPages] = useState([0]);
  const [emotionChosen, chooseEmotion] = useState("happy");
  const [isSquare, setSquare] = useState(false);
  const [isPageCnt, setPageCnt] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [isDateModal, setDateModal] = useState(false);
  const [targetDate, setTargetDate] = useState();
  const [isConfirmPressed, setConfirmPressed] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const [linkTo, setLinkTo] = useState(ServiceLinked.NONE);

  const { control, watch, reset, unregister, getValues, setValue } = useForm();

  useEffect(() => {
    if (params?.isEdit) {
      chooseEmotion(params?.emotion);
      setTargetDate(new Date(params?.uploadAt));
      setTempDate(new Date(params?.uploadAt));
      setLinkTo(params?.linkTo);

      const pages = Object.keys([...Array(params?.payload.length)]).map(
        (item) => parseInt(item)
      );
      setPages(pages);
      pages.forEach((page) =>
        setValue(`payload_${page}`, params.payload[page])
      );
    }
  }, []);

  const onValid = () => {
    const payloads = getValues();

    let payload = "";
    pages.forEach(
      (page, index) =>
        (payload +=
          index === 0
            ? `${payloads[`payload_${page}`]}`
            : `\n${payloads[`payload_${page}`]}`)
    );

    uploadMessage.mutate(
      {
        ...(params?.isEdit && { id: params?.messageId }),
        payload,
        emotion: emotionChosen,
        isNow: false,
        uploadAt: targetDate,
        linkTo,
      },
      {
        onSuccess: ({ data: result }) => {
          if (result.ok) {
            DeviceEventEmitter.emit("isMutated");

            navigation.navigate(ROUTE_NAME.MESSAGE_HOME);
          }
        },
      }
    );
  };

  const uploadMessage = useMutation(
    params?.isEdit ? editMessageApi : createMessageApi
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RowContainer>
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
              padding: 2,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 35,
            }}
            onPress={() => {
              setSquare(!isSquare);
            }}
          >
            <Text style={{ fontFamily: "nanum-regular" }}>
              {isSquare ? "1:1" : "4:3"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => {
              Keyboard.dismiss();
              reset();
              setPages([0]);
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
  }, [isSquare, pages]);

  return (
    <DismissKeyboard>
      <ScreenLayout>
        <View style={{ flex: 1 }}>
          <View>
            <ViewShot
              ref={viewShotRef}
              options={{ fileName: `${new Date().getTime()}` }}
            >
              <FlatList
                data={pages}
                renderItem={({ item, index }) => (
                  <Controller
                    control={control}
                    name={`payload_${item}`}
                    render={({ field: { onChange, value } }) => (
                      <MessageInput
                        index={index}
                        payload={watch(`payload_${item}`)}
                        onChagePayload={onChange}
                        emotion={emotionChosen}
                        totalPages={pages.length}
                        isSquare={isSquare}
                        showPageCount={isPageCnt}
                      />
                    )}
                  />
                )}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onScroll={({
                  nativeEvent: {
                    contentOffset: { x },
                  },
                }) => {
                  const newPage = parseInt(x / pageWidth);
                  if (newPage !== currentPage) {
                    setCurrentPage(newPage);
                  }
                }}
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
            <RowContainer style={{ marginHorizontal: 10 }}>
              <NewPageBtn
                onPress={() => setPageCnt(!isPageCnt)}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <NewPageBtnText style={{ color: "white" }}>{`쪽 번호 ${
                  isPageCnt ? "on" : "off"
                }`}</NewPageBtnText>
              </NewPageBtn>
              <NewPageBtn
                onPress={() => {
                  if (pages.length === 1) {
                    reset();
                    setPages([0]);
                  } else {
                    unregister(`payload_${currentPage}`);
                    setPages(pages.filter((item) => item !== currentPage));
                  }
                }}
                style={{ backgroundColor: Colors.borderLight }}
              >
                <NewPageBtnText>현재 쪽 삭제</NewPageBtnText>
              </NewPageBtn>
              <NewPageBtn
                onPress={() =>
                  pages.length < 10
                    ? setPages([...pages, pages[pages.length - 1] + 1])
                    : Toast({ message: "최대 10장까지 가능합니다" })
                }
              >
                <NewPageBtnText>페이지 추가</NewPageBtnText>
              </NewPageBtn>
            </RowContainer>

            <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
              <Prompt>
                <PromptText>도착 예정일</PromptText>
              </Prompt>

              <SelectionContainer
                onPress={() => setDateModal(true)}
                style={{ marginBottom: 5 }}
              >
                <SelectionText>
                  {targetDate
                    ? targetDate.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "도착 예정일 선택하기"}
                </SelectionText>
              </SelectionContainer>
            </View>

            <Prompt style={{ marginLeft: 15 }}>
              <PromptText>연결 서비스 (버튼)</PromptText>
            </Prompt>

            <RowContainer style={{ marginHorizontal: 10, paddingTop: 10 }}>
              <NewPageBtn
                onPress={() => setLinkTo(ServiceLinked.NONE)}
                style={{
                  borderColor:
                    linkTo === ServiceLinked.NONE
                      ? Colors.main
                      : Colors.borderLight,
                  borderWidth: 1,
                  backgroundColor: "white",
                }}
              >
                <NewPageBtnText>없음</NewPageBtnText>
              </NewPageBtn>
              <NewPageBtn
                onPress={() => setLinkTo(ServiceLinked.PHOTO)}
                style={{
                  borderColor:
                    linkTo === ServiceLinked.PHOTO
                      ? Colors.main
                      : Colors.borderLight,
                  borderWidth: 1,
                  backgroundColor: "white",
                }}
              >
                <NewPageBtnText>사진</NewPageBtnText>
              </NewPageBtn>
              <NewPageBtn
                onPress={() => setLinkTo(ServiceLinked.LETTER)}
                style={{
                  borderColor:
                    linkTo === ServiceLinked.LETTER
                      ? Colors.main
                      : Colors.borderLight,
                  borderWidth: 1,
                  backgroundColor: "white",
                }}
              >
                <NewPageBtnText>편지</NewPageBtnText>
              </NewPageBtn>
              <NewPageBtn
                onPress={() => setLinkTo(ServiceLinked.PEDIA)}
                style={{
                  borderColor:
                    linkTo === ServiceLinked.PEDIA
                      ? Colors.main
                      : Colors.borderLight,
                  borderWidth: 1,
                  backgroundColor: "white",
                }}
              >
                <NewPageBtnText>인물사전</NewPageBtnText>
              </NewPageBtn>
            </RowContainer>
          </View>
        </View>

        <StartBtn onPress={onValid} disabled={!targetDate}>
          <StartBtnText>등록</StartBtnText>
        </StartBtn>

        <Modal
          isVisible={isDateModal}
          onClose={() => setDateModal(false)}
          onConfirm={() => {
            setConfirmPressed(true);
            setDateModal(false);
          }}
          onCloseEnd={() => {
            if (isConfirmPressed) {
              setTargetDate(tempDate);
            } else {
              setTempDate(targetDate ? targetDate : new Date());
            }

            setConfirmPressed(false);
          }}
        >
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <DatePicker
              date={tempDate}
              onDateChange={(date) => {
                date.setHours(8);
                date.setMinutes(0);
                date.setSeconds(0);
                setTempDate(date);
              }}
              mode="date"
              minimumDate={new Date()}
              maximumDate={oneYearLater}
              androidVariant="nativeAndroid"
              // androidVariant="iosClone"
              timeZoneOffsetInMinutes={9 * 60}
              textColor={"#000000"}
              locale="ko"
            />
          </View>
        </Modal>
      </ScreenLayout>
    </DismissKeyboard>
  );
}
