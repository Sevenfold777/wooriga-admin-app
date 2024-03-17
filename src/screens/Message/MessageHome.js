import {
  ActivityIndicator,
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import GridBox from "../../components/GridBox";
import ScreenLayout from "../../components/ScreenLayout";
import { Prompt, PromptText, RowContainer } from "../../components/Shared";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import { ROUTE_NAME } from "../../Strings";
import { MessageItem } from "../../components/message/MessageList";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  findMessagesApi,
  findMessagesNearArriveApi,
  getAllFamiliesCntApi,
  getTodayCommentsCntApi,
  getTodayMetoosApi,
} from "../../api/MessageApi";

const NewThemeBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
  aspect-ratio: 1;
  width: 90px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  padding: 10px;
  background-color: ${Colors.main};
  border-radius: 50px;
`;

const NewThemeBtnText = styled.Text`
  text-align: center;
  line-height: 18px;
  font-family: "nanum-bold";
  color: white;
`;

const MessageList = styled.View`
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const NoMessageText = styled.Text`
  padding: 0px 15px;
  font-family: "nanum-regular";
`;

export default function MessageHome({ navigation, route }) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const [todayMsgs, setTodayMsgs] = useState([]);
  const [tomorrowMsgs, setTomorrowMsgs] = useState([]);
  const [twoDaysMsgs, setTwoDaysMsgs] = useState([]);
  const [threeDaysMsgs, setThreeDaysMessages] = useState([]);

  const {
    data: commentsCnt,
    isLoading: commmentsLoading,
    refetch: commentsRefetch,
  } = useQuery(["commentsCnt"], getTodayCommentsCntApi);

  const {
    data: metoosCnt,
    isLoading: metoosLoading,
    refetch: metoosRefetch,
  } = useQuery(["metoosCnt"], getTodayMetoosApi);

  const {
    data: messagesNear,
    isLoading: nearLoading,
    refetch: nearRefetch,
  } = useQuery(["messagesNear"], findMessagesNearArriveApi, {
    onSuccess: ({ data: messages }) => {
      setTodayMsgs(dateFilter({ messages, dayAfter: 0 }));
      setTomorrowMsgs(dateFilter({ messages, dayAfter: 1 }));
      setTwoDaysMsgs(dateFilter({ messages, dayAfter: 2 }));
      setThreeDaysMessages(dateFilter({ messages, dayAfter: 3 }));
    },
  });

  const {
    data: messagesAll,
    isLoading: allLoading,
    refetch: allRefetch,
  } = useQuery(["messagesAll"], () => findMessagesApi({ prev: 0 }));

  const {
    data: familyCnt,
    isLoading: familyCntLoading,
    refetch: familyCntRefetch,
  } = useQuery(["familyCnt"], getAllFamiliesCntApi);

  const [isRefreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    await commentsRefetch();
    await metoosRefetch();
    await nearRefetch();
    await allRefetch();
    await familyCntRefetch();
  };

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener("isMutated", () =>
      onRefresh()
    );

    return () => unsubscribe.remove();
  }, [messagesAll, messagesNear]);

  if (
    commmentsLoading ||
    metoosLoading ||
    nearLoading ||
    allLoading ||
    familyCntLoading
  ) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <RowContainer style={{ margin: 10, paddingBottom: 10 }}>
          <GridBox
            onPress={() => navigation.navigate(ROUTE_NAME.MESSAGE_COMMENTS)}
            title={"이야기 댓글"}
            count={commentsCnt.data}
          />
          <GridBox title={"이야기 좋아요"} count={metoosCnt.data} />
        </RowContainer>

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_NAME.MESSAGE_LIST_SCREEN, {
              headerTitle: "오늘 발송",
            })
          }
        > */}
        <Prompt>
          <RowContainer>
            <PromptText>오늘 발송</PromptText>
            {/* <Ionicons
              name="chevron-forward"
              size={16}
              style={{ marginLeft: 5 }}
            /> */}
          </RowContainer>
        </Prompt>
        {/* </TouchableOpacity> */}
        <MessageList>
          {todayMsgs.length === 0 ? (
            <NoMessageText>발송 예정 메세지가 없습니다</NoMessageText>
          ) : (
            todayMsgs.map((message, index) => (
              <MessageItem
                familyCnt={familyCnt.data}
                sentCnt={message.messageFamily.length}
                key={index}
                id={message.id}
                title={message.payload}
                createdAt={new Date(message.createdAt)}
                uploadAt={new Date(message.uploadAt)}
              />
            ))
          )}
        </MessageList>

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_NAME.MESSAGE_LIST_SCREEN, {
              headerTitle: "내일 발송 예정",
            })
          }
        > */}
        <Prompt>
          <RowContainer>
            <PromptText>내일 발송 예정</PromptText>
            {/* <Ionicons
              name="chevron-forward"
              size={16}
              style={{ marginLeft: 5 }}
            /> */}
          </RowContainer>
        </Prompt>
        {/* </TouchableOpacity> */}
        <MessageList>
          {tomorrowMsgs.length === 0 ? (
            <NoMessageText>발송 예정 메세지가 없습니다</NoMessageText>
          ) : (
            tomorrowMsgs.map((message, index) => (
              <MessageItem
                familyCnt={familyCnt.data}
                sentCnt={message.messageFamily.length}
                key={index}
                id={message.id}
                title={message.payload}
                createdAt={new Date(message.createdAt)}
                uploadAt={new Date(message.uploadAt)}
              />
            ))
          )}
        </MessageList>

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_NAME.MESSAGE_LIST_SCREEN, {
              headerTitle: "2일 뒤 발송 예정",
            })
          }
        > */}
        <Prompt>
          <RowContainer>
            <PromptText>2일 뒤 발송 예정</PromptText>
            {/* <Ionicons
              name="chevron-forward"
              size={16}
              style={{ marginLeft: 5 }}
            /> */}
          </RowContainer>
        </Prompt>
        {/* </TouchableOpacity> */}
        <MessageList>
          {twoDaysMsgs.length === 0 ? (
            <NoMessageText>발송 예정 메세지가 없습니다</NoMessageText>
          ) : (
            twoDaysMsgs.map((message, index) => (
              <MessageItem
                familyCnt={familyCnt.data}
                sentCnt={message.messageFamily.length}
                key={index}
                id={message.id}
                title={message.payload}
                createdAt={new Date(message.createdAt)}
                uploadAt={new Date(message.uploadAt)}
              />
            ))
          )}
        </MessageList>

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_NAME.MESSAGE_LIST_SCREEN, {
              headerTitle: "3일 뒤 발송 예정",
            })
          }
        > */}
        <Prompt>
          <RowContainer>
            <PromptText>3일 뒤 발송 예정</PromptText>
            {/* <Ionicons
              name="chevron-forward"
              size={16}
              style={{ marginLeft: 5 }}
            /> */}
          </RowContainer>
        </Prompt>
        {/* </TouchableOpacity> */}
        <MessageList>
          {threeDaysMsgs.length === 0 ? (
            <NoMessageText>발송 예정 메세지가 없습니다</NoMessageText>
          ) : (
            threeDaysMsgs.map((message, index) => (
              <MessageItem
                familyCnt={familyCnt.data}
                sentCnt={message.messageFamily.length}
                key={index}
                id={message.id}
                title={message.payload}
                createdAt={new Date(message.createdAt)}
                uploadAt={new Date(message.uploadAt)}
              />
            ))
          )}
        </MessageList>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_NAME.MESSAGE_LIST_SCREEN, {
              headerTitle: "전체 이야기 목록",
            })
          }
        >
          <Prompt>
            <RowContainer>
              <PromptText>이야기 목록</PromptText>
              <Ionicons
                name="chevron-forward"
                size={16}
                style={{ marginLeft: 5 }}
              />
            </RowContainer>
          </Prompt>
        </TouchableOpacity>

        <MessageList>
          {messagesAll.data.map((message, index) => (
            <MessageItem
              familyCnt={familyCnt.data}
              sentCnt={message.messageFamCount}
              key={index}
              id={message.id}
              title={message.payload}
              createdAt={new Date(message.createdAt)}
              uploadAt={new Date(message.uploadAt)}
            />
          ))}
        </MessageList>
      </ScrollView>

      <NewThemeBtn onPress={() => navigation.navigate(ROUTE_NAME.MESSAGE_ADD)}>
        <NewThemeBtnText>{"이야기\n작성"}</NewThemeBtnText>
      </NewThemeBtn>
    </ScreenLayout>
  );
}

const dateFilter = ({ messages, dayAfter }) => {
  return messages.filter((message) => {
    const uploadDate = new Date(message.uploadAt);
    uploadDate.setHours(0);
    uploadDate.setMinutes(0);
    uploadDate.setSeconds(0);
    uploadDate.setMilliseconds(0);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayAfter);
    targetDate.setHours(0);
    targetDate.setMinutes(0);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);

    return uploadDate.getTime() == targetDate.getTime();
  });
};
