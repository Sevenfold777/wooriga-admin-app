import { useState } from "react";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import { useQuery } from "@tanstack/react-query";
import { getUserStatApi } from "../../api/UserApi";
import styled from "styled-components/native";
import { RowContainer } from "../../components/Shared";
import { FlatList } from "react-native";
import { NoContentContainer, NoContentText } from "../../components/NoContent";
import { ActivityIndicator } from "react-native";
import GridBox from "../../components/GridBox";

const UserContainer = styled.TouchableOpacity`
  padding: 15px;
  border: 1px solid #aeaeae;
  border-radius: 10px;
  margin: 5px 0px;
`;

const UserId = styled.Text`
  font-family: "nanum-bold";
  font-size: 15px;
`;

const DetailText = styled.Text`
  padding: 5px 0px 0px 5px;
  font-family: "nanum-regular";
  font-size: 14px;
`;

export default function UserStat({ navigation, route }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query: get letters */
  const {
    data,
    isLoading: familyIsLoading,
    refetch: refetchFamilies,
  } = useQuery(["UserStat", prev], () => getUserStatApi({ prev }), {
    onSuccess: ({ data }) => {
      if (data.length === 0) {
        setIsLast(true);
      } else {
        setPrev(prev + 1);
        setUsers([...users, ...data]);
      }

      setQueryEnable(false);
      setIsLoading(false);
    },
    enabled: queryEnable,
  });

  // const {
  //   data: birthUsers,
  //   isLoading: birthdayLoading,
  //   refetch: refetchBirthday,
  // } = useQuery(["Birthday"], getBirthUsersApi);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setUsers([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    // await refetchBirthday();
    await refetchFamilies();

    setRefreshing(false);
  };

  const renderUser = ({ item: user }) => (
    <UserContainer disabled={true}>
      <UserId>{`사용자 번호: ${user.id}`}</UserId>
      <DetailText>
        {`가입일: ${new Date(user.createdAt).toLocaleDateString("ko-KR")}`}
      </DetailText>
      <DetailText>{`마지막 접속: ${new Date(user.lastLogin).toLocaleDateString(
        "ko-KR"
      )}`}</DetailText>
      <DetailText>{`이야기 댓글 작성: ${user.messageCommentCnt}`}</DetailText>
      <DetailText>{`편지 작성: ${user.letterSentCnt}`}</DetailText>
      <DetailText>{`사진 업로드: ${user.photoUploadCnt}`}</DetailText>
      <DetailText>{`사진 댓글 작성: ${user.photoCommentCnt}`}</DetailText>
      <DetailText>{`감정선택: ${user.dailyEmotionCnt} / ${parseInt(
        (new Date() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24) +
          1
      )}`}</DetailText>
    </UserContainer>
  );

  // if ((users.length === 0 && !isLast) || birthdayLoading) {
  if (users.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={users}
        renderItem={renderUser}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
        ListEmptyComponent={() => (
          <NoContentContainer style={{ paddingVertical: 200 }}>
            <NoContentText>{"등록된 가족이 없습니다"}</NoContentText>
          </NoContentContainer>
        )}
        // ListHeaderComponent={
        //   <RowContainer style={{ paddingBottom: 10 }}>
        //     <GridBox
        //       title={"오늘 생일"}
        //       count={birthUsers.data}
        //       isCompareText={false}
        //       onPress={() => {}}
        //     />
        //     <GridBox
        //       title={"내일 생일"}
        //       count={birthUsers.data}
        //       isCompareText={false}
        //       onPress={() => {}}
        //     />
        //   </RowContainer>
        // }
      />
    </ScreenLayout>
  );
}
