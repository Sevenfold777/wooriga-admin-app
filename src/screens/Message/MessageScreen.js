import PagerView from "react-native-pager-view";
import ScreenLayout from "../../components/ScreenLayout";
import Message from "../../components/message/Message";
import {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
  DetailModalContainer,
  DetailModalRow,
  DetailModalText,
  Prompt,
  PromptText,
  RowContainer,
  SelectionContainer,
  SelectionText,
} from "../../components/Shared";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { StartBtn, StartBtnText } from "../../components/message/MessageInput";
import Modal from "../../components/Modal";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FamilyItem from "../../components/Family";
import DatePicker from "react-native-date-picker";
import RNModal from "react-native-modal";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMessageApi,
  findMessageApi,
  getAllFamiliesCntApi,
  sendMessagToFamApi,
} from "../../api/MessageApi";
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Toast from "../../components/Toast";
import { ROUTE_NAME, ServiceLinked } from "../../Strings";
import styled from "styled-components/native";
import { Colors } from "../../Config";

const NewPageBtn = styled.View`
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

export default function MessageScreen({ navigation, route: { params } }) {
  const viewShotRef = useRef();

  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const [messageByPage, setMessageByPage] = useState([]);

  const [isSendModal, setSendModal] = useState(false);
  const [isDateModal, setDateModal] = useState(false);
  const [isTimeModal, setTimeModal] = useState(false);
  const [defaultTimePressed, setDefaultTimePressed] = useState(false);
  const [targetDate, setTargetDate] = useState();
  const [isConfirmPressed, setConfirmPressed] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [isSquare, setSquare] = useState(false);
  const [isPageCnt, setPageCnt] = useState(true);

  const {
    data: message,
    isLoading,
    refetch,
  } = useQuery(
    ["Message", params?.statQueryEnabled],
    () => findMessageApi({ id: params?.id, isSent: params?.statQueryEnabled }),
    {
      onSuccess: ({ data: { payload, uploadAt } }) => {
        // format Message
        const messageLines = payload.split(/\n/g);
        const temp = [];
        messageLines.forEach((line, index) => {
          if (index % 2 === 0) {
            messageLines[index + 1]
              ? temp.push(
                  messageLines[index].concat("\n", messageLines[index + 1])
                )
              : temp.push(messageLines[index]);
          }
        });

        setMessageByPage(temp);

        setTargetDate(new Date(uploadAt));
        setTempDate(new Date(uploadAt));
      },
    }
  );

  const {
    data: familyCnt,
    isLoading: familyCntLoading,
    refetch: familyCntRefetch,
  } = useQuery(["familyCnt"], getAllFamiliesCntApi);

  const sendToFamily = useMutation(sendMessagToFamApi);
  const deleteMessage = useMutation(deleteMessageApi);

  const { width: pageWidth } = useWindowDimensions();

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RowContainer>
          <TouchableOpacity
            style={{
              marginRight: 12,
              borderWidth: 1,
              padding: 5,
              borderRadius: 17.5,
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: 1,
            }}
            onPress={() => {
              setPageCnt(!isPageCnt);
            }}
          >
            <Text style={{ fontFamily: "nanum-regular" }}>쪽</Text>
          </TouchableOpacity>
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
            style={{ marginRight: 2 }}
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
          <TouchableOpacity
            style={{ paddingHorizontal: 10 }}
            onPress={() => setDetailModal(true)}
          >
            <Ionicons name="ellipsis-vertical" size={16} />
          </TouchableOpacity>
        </RowContainer>
      ),
    });
  }, [message, isSquare, isPageCnt]);

  if (isLoading || familyCntLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ViewShot
          ref={viewShotRef}
          options={{ fileName: `${new Date().getTime()}` }}
        >
          <View
            style={{
              width: pageWidth,
              aspectRatio: isSquare ? 1 : 4 / 3,
              marginBottom: 20,
            }}
          >
            <PagerView
              initialPage={0}
              style={{ flex: 1 }}
              onPageSelected={(e) => {
                // setCurrentPage(e.nativeEvent.position);
              }}
            >
              {messageByPage.map((page, index) => (
                <Message
                  key={index}
                  emotion={message.data.emotion}
                  payload={page}
                  totalPages={messageByPage.length}
                  index={index}
                  isSquare={isSquare}
                  showPageCount={isPageCnt}
                />
              ))}
            </PagerView>
          </View>
        </ViewShot>

        <Prompt style={{ marginBottom: 15 }}>
          <PromptText>{`* 도착(예정)일: ${new Date(
            message.data.uploadAt
          ).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}</PromptText>
        </Prompt>

        <Prompt style={{ marginBottom: 15 }}>
          <PromptText>* 연결 서비스 (버튼)</PromptText>

          <RowContainer style={{ paddingTop: 10 }}>
            <NewPageBtn
              style={{
                borderColor:
                  message.data.linkTo === ServiceLinked.NONE
                    ? Colors.main
                    : Colors.borderLight,
                borderWidth: 1,
                backgroundColor: "white",
              }}
            >
              <NewPageBtnText>없음</NewPageBtnText>
            </NewPageBtn>
            <NewPageBtn
              style={{
                borderColor:
                  message.data.linkTo === ServiceLinked.PHOTO
                    ? Colors.main
                    : Colors.borderLight,
                borderWidth: 1,
                backgroundColor: "white",
              }}
            >
              <NewPageBtnText>사진</NewPageBtnText>
            </NewPageBtn>
            <NewPageBtn
              style={{
                borderColor:
                  message.data.linkTo === ServiceLinked.LETTER
                    ? Colors.main
                    : Colors.borderLight,
                borderWidth: 1,
                backgroundColor: "white",
              }}
            >
              <NewPageBtnText>편지</NewPageBtnText>
            </NewPageBtn>
            <NewPageBtn
              style={{
                borderColor:
                  message.data.linkTo === ServiceLinked.PEDIA
                    ? Colors.main
                    : Colors.borderLight,
                borderWidth: 1,
                backgroundColor: "white",
              }}
            >
              <NewPageBtnText>인물사전</NewPageBtnText>
            </NewPageBtn>
          </RowContainer>
        </Prompt>

        {params?.statQueryEnabled && (
          <>
            <Prompt style={{ marginBottom: 15 }}>
              <PromptText>{`* 받은 가족: ${message.data.messageFamCount} / ${familyCnt.data}`}</PromptText>
            </Prompt>

            <Prompt style={{ marginBottom: 15 }}>
              <PromptText>{`* 댓글 작성 사용자: ${message.data.commentedUsersCount} / ${familyCnt.data}`}</PromptText>
            </Prompt>

            <Prompt style={{ marginBottom: 15 }}>
              <PromptText>{`* 총 댓글 수: ${message.data.commentsCount}`}</PromptText>
            </Prompt>

            <Prompt style={{ marginBottom: 15 }}>
              <PromptText>{`* 총 좋아요 수: ${message.data.metoosCount}`}</PromptText>
            </Prompt>
          </>
        )}
      </ScrollView>

      <StartBtn
        onPress={() => {
          setSendModal(true);
        }}
        disabled={message.data.messageFamCount > 0}
      >
        <StartBtnText>
          {message.data.messageFamCount > 0 ? "발송 완료" : "발송"}
        </StartBtnText>
      </StartBtn>

      <Modal
        isVisible={isSendModal}
        confirmText="전송"
        onClose={() => {
          setTargetDate();
          setTempDate(new Date());
          setSendModal(false);
        }}
        onConfirm={() => {
          // 전송
          sendToFamily.mutate({
            messageId: message.data.id,
            receiveDate: targetDate,
          });
          setSendModal(false);
        }}
        onCloseEnd={() => {
          if (isConfirmPressed) {
            setDateModal(true);
            setConfirmPressed(false);
          } else if (defaultTimePressed) {
            setTimeModal(true);
            setDefaultTimePressed(false);
          }
        }}
        confirmDisabled={!targetDate}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: 20,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Prompt>
            <PromptText>도착일 설정</PromptText>
          </Prompt>
          <SelectionContainer
            onPress={() => {
              setConfirmPressed(true);
              setSendModal(false);
            }}
          >
            <SelectionText>
              {targetDate
                ? targetDate.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "선택하기"}
            </SelectionText>
          </SelectionContainer>
          <RowContainer
            style={{
              alignItems: "flex-start",
              paddingHorizontal: 25,
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={16}
              style={{ marginRight: 5 }}
            />
            <SelectionText>
              {"전송 버튼을 누르면\n모든 사용자에게 메세지가 발송됩니다"}
            </SelectionText>
          </RowContainer>

          <TouchableOpacity
            onPress={() => {
              setSendModal(false);
              setDefaultTimePressed(true);
            }}
          >
            <RowContainer
              style={{
                paddingHorizontal: 15,
                marginLeft: 15,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "nanum-bold",
                  fontSize: 13,
                  color: "#3d6acb",
                }}
              >
                {targetDate
                  ? `공개시간: ${String(targetDate.getHours()).padStart(
                      2,
                      "0"
                    )}시 ${String(targetDate.getMinutes()).padStart(2, "0")}분`
                  : `공개시간: 08시 00분`}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={"#3d6acb"} />
            </RowContainer>
          </TouchableOpacity>
        </View>
      </Modal>

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
          setSendModal(true);
        }}
      >
        <View style={{ paddingVertical: 30, alignItems: "center" }}>
          <DatePicker
            date={tempDate}
            onDateChange={(date) => {
              date.setHours(12);
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

      <Modal
        isVisible={isTimeModal}
        onClose={() => setTimeModal(false)}
        onConfirm={() => {
          setConfirmPressed(true);
          setTimeModal(false);
        }}
        onCloseEnd={() => {
          if (isConfirmPressed) {
            setTargetDate(tempDate);
          } else {
            setTempDate(targetDate ? targetDate : new Date());
          }

          setConfirmPressed(false);
          setSendModal(true);
        }}
      >
        <View style={{ paddingVertical: 30, alignItems: "center" }}>
          <DatePicker
            date={tempDate}
            onDateChange={(date) => {
              date.setHours(12);
              date.setMinutes(0);
              date.setSeconds(0);
              setTempDate(date);
            }}
            mode="time"
            minimumDate={new Date()}
            maximumDate={oneYearLater}
            androidVariant="nativeAndroid"
            // androidVariant="iosClone"
            timeZoneOffsetInMinutes={9 * 60}
            textColor={"#000000"}
            locale="ko"
            minuteInterval={30}
          />
        </View>
      </Modal>

      <RNModal
        isVisible={isDetailModal}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          setDetailModal(false);
        }}
        onBackButtonPress={() => setDetailModal(false)}
        onModalHide={() => {
          if (isConfirmPressed) {
            setConfirmModal(true);
            setConfirmPressed(false);
          }
        }}
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        statusBarTranslucent
        style={{ position: "absolute", top: headerHeight, right: 0 }}
      >
        <DetailModalContainer>
          <DetailModalRow
            onPress={() => {
              setDetailModal(false);
              navigation.navigate(ROUTE_NAME.MESSAGE_ADD, {
                isEdit: true,
                messageId: params?.id,
                payload: messageByPage,
                emotion: message.data.emotion,
                uploadAt: message.data.uploadAt,
                linkTo: message.data.linkTo,
              });
            }}
          >
            <DetailModalText>수정</DetailModalText>
          </DetailModalRow>
          <DetailModalRow
            onPress={() => {
              setConfirmPressed(true);
              setDetailModal(false);
            }}
          >
            <DetailModalText>삭제</DetailModalText>
          </DetailModalRow>
        </DetailModalContainer>
      </RNModal>

      <Modal
        isVisible={isConfirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={() => {
          deleteMessage.mutate(
            { id: params?.id },
            {
              onSuccess: () => {
                DeviceEventEmitter.emit("isMutated");
                setConfirmModal(false);
                navigation.goBack();
              },
            }
          );
        }}
        onCloseEnd={() => {}}
      >
        <ConfirmModalContainer>
          <View style={{ padding: 30 }}>
            <ConfirmModalText>정말 삭제하시겠습니까?</ConfirmModalText>
          </View>
        </ConfirmModalContainer>
      </Modal>
    </ScreenLayout>
  );
}
