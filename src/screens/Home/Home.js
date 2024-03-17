import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import { Prompt, PromptText, RowContainer } from "../../components/Shared";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../Config";
import GridBox from "../../components/GridBox";
import { useQueries } from "@tanstack/react-query";
import {
  getFamilyCntApi,
  getUserCntApi,
  getActiveUserApi,
  getFamilyWithUserApi,
  getPediaEdittedApi,
  getEmoSelectedApi,
} from "../../api/UserApi";
import { getPhotosCntApi, getPhotoCommentsCntApi } from "../../api/PhotoApi";
import { useState } from "react";
import { ROUTE_NAME } from "../../Strings";
import { getTodaySentApi } from "../../api/LetterApi";

export default function Home({ navigation, route }) {
  const result = useQueries({
    queries: [
      { queryKey: ["FamilyCnt"], queryFn: getFamilyCntApi },
      { queryKey: ["UserCnt"], queryFn: getUserCntApi },
      { queryKey: ["ActiveUser"], queryFn: getActiveUserApi },
      { queryKey: ["PhotosCnt"], queryFn: getPhotosCntApi },
      { queryKey: ["PhotosCommensts"], queryFn: getPhotoCommentsCntApi },
      { queryKey: ["PediaEditted"], queryFn: getPediaEdittedApi },
      { queryKey: ["EmoSelected"], queryFn: getEmoSelectedApi },
      { queryKey: ["LettersCnt"], queryFn: getTodaySentApi },
      // { queryKey: "FamilyWithUser", queryFn: getFamilyWithUserApi },
    ],
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    result[0].refetch();
    result[1].refetch();
    result[2].refetch();
    result[3].refetch();
    result[4].refetch();
    result[5].refetch();
    result[6].refetch();
    result[7].refetch();

    setRefreshing(false);
  };

  if (
    result[0].isLoading ||
    result[1].isLoading ||
    result[2].isLoading ||
    result[3].isLoading ||
    result[4].isLoading ||
    result[5].isLoading ||
    result[6].isLoading ||
    result[7].isLoading
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
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      >
        <Prompt>
          <PromptText>전체 사용자</PromptText>
        </Prompt>
        <RowContainer style={{ margin: 10, paddingBottom: 10 }}>
          <GridBox
            title={"사용자"}
            count={result[1].data?.data}
            isCompareText={false}
            onPress={() => navigation.navigate(ROUTE_NAME.USER_STAT)}
          />
          <GridBox
            title={"가족"}
            count={result[0].data?.data}
            isCompareText={false}
            onPress={() => navigation.navigate(ROUTE_NAME.FAMILY_WITH_USER)}
          />
        </RowContainer>

        <Prompt>
          <PromptText>일간 / 월간 사용자</PromptText>
        </Prompt>
        <RowContainer style={{ margin: 10, paddingBottom: 10 }}>
          <GridBox
            title={"DAU"}
            count={result[2].data?.data.dau}
            isCompareText={false}
            onPress={() => navigation.navigate(ROUTE_NAME.DAU)}
          />
          <GridBox
            title={"MAU"}
            count={result[2].data?.data.mau}
            isCompareText={false}
            onPress={() => navigation.navigate(ROUTE_NAME.MAU)}
          />
        </RowContainer>

        <Prompt>
          <PromptText>가족앨범</PromptText>
        </Prompt>
        <RowContainer style={{ margin: 10, paddingBottom: 10 }}>
          <GridBox title={"사진 게시"} count={result[3].data?.data} />
          <GridBox title={"사진 댓글"} count={result[4].data?.data} />
        </RowContainer>

        <Prompt>
          <PromptText>편지</PromptText>
        </Prompt>
        <RowContainer style={{ margin: 10, paddingBottom: 10 }}>
          <GridBox title={"편지 전송"} count={result[7].data?.data.all} />
          <GridBox
            title={"타임캡슐 전송"}
            count={result[7].data?.data.timeCapsules}
          />
        </RowContainer>

        <RowContainer>
          <View style={{ flex: 1 }}>
            <Prompt>
              <PromptText>감정</PromptText>
            </Prompt>
            <View
              style={{ marginVertical: 10, marginLeft: 10, paddingBottom: 10 }}
            >
              <GridBox title={"선택량"} count={result[6].data?.data} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Prompt>
              <PromptText>인물사전</PromptText>
            </Prompt>
            <View
              style={{ marginVertical: 10, marginRight: 10, paddingBottom: 10 }}
            >
              <GridBox title={"수정량"} count={result[5].data?.data} />
            </View>
          </View>
        </RowContainer>
      </ScrollView>
    </ScreenLayout>
  );
}
