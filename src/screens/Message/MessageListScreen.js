import { ActivityIndicator, FlatList, ScrollView } from "react-native";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import Message from "../../components/message/Message";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import { findMessagesApi, getAllFamiliesCntApi } from "../../api/MessageApi";
import { useQuery } from "@tanstack/react-query";
import NoContent from "../../components/NoContent";
import { MessageItem } from "../../components/message/MessageList";

const MessageHeader = styled.View`
  padding: 5px 7px;
  border-color: ${Colors.borderLight};
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
  padding: 15px 8px;
`;

export default function MessageListScreen({ navigation, route: { params } }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {
    data: familyCnt,
    isLoading: familyCntLoading,
    refetch: familyCntRefetch,
  } = useQuery(["familyCnt"], getAllFamiliesCntApi);

  const {
    data,
    isLoading: Loading,
    refetch,
  } = useQuery(["messagesAll", { prev }], () => findMessagesApi({ prev }), {
    onSuccess: ({ data }) => {
      if (data.length === 0) {
        setIsLast(true);
      } else {
        setPrev(prev + 1);
        setMessages([...messages, ...data]);
      }

      setQueryEnable(false);
      setIsLoading(false);
    },

    enabled: queryEnable,
  });

  const onRefresh = async () => {
    setRefreshing(true);

    setMessages([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetch();
    setRefreshing(false);
  };

  const renderMessage = ({ item: message, index }) => (
    <MessageItem
      familyCnt={familyCnt.data}
      sentCnt={message.messageFamCount}
      key={message.id}
      id={message.id}
      title={message.payload}
      createdAt={new Date(message.createdAt)}
      uploadAt={new Date(message.uploadAt)}
    />
  );

  useEffect(() => {
    navigation.setOptions({ headerTitle: params?.headerTitle });
  }, []);

  if (familyCntLoading || messages.length === 0) {
    if (isLast) {
      return <NoContent payload={"등록된 이야기가 없습니다"} />;
    } else {
      return (
        <ScreenLayout>
          <ActivityIndicator />
        </ScreenLayout>
      );
    }
  }

  return (
    <ScreenLayout>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
      {/* <ScrollView showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => (
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
      </ScrollView> */}
    </ScreenLayout>
  );
}
