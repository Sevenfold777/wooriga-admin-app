import { useQuery } from "@tanstack/react-query";
import ScreenLayout from "../../components/ScreenLayout";
import { getCommentedUserFamCntApi } from "../../api/MessageApi";
import { ActivityIndicator, View } from "react-native";
import GridBox from "../../components/GridBox";

export default function MessageComments({ navigation, route }) {
  const { data, isLoading } = useQuery(
    ["CommentsCnt"],
    getCommentedUserFamCntApi
  );

  if (isLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View style={{ padding: 10, flexDirection: "column", height: "40%" }}>
        <View style={{ marginBottom: 10, flex: 1 }}>
          <GridBox
            title={"댓글 작성 사용자"}
            count={data.data.userCnt}
            isCompareText={false}
          />
        </View>

        <View style={{ marginBottom: 10, flex: 1 }}>
          <GridBox
            title={"댓글 작성 가족"}
            count={data.data.familyCnt}
            isCompareText={false}
          />
        </View>

        <View style={{ marginBottom: 10, flex: 1 }}>
          <GridBox
            title={"댓글 작성 가족 (관리자 제외)"}
            count={data.data.familyNotAdmin}
            isCompareText={false}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
