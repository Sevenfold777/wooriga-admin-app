import { useState } from "react";
import ScreenLayout from "../../components/ScreenLayout";
import { getFamilyWithUserApi } from "../../api/UserApi";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { NoContentContainer, NoContentText } from "../../components/NoContent";
import styled from "styled-components/native";
import { RowContainer } from "../../components/Shared";

const FamilyContainer = styled.TouchableOpacity`
  padding: 15px;
  border: 1px solid #aeaeae;
  border-radius: 10px;
  margin: 5px 0px;
`;

const FamilyId = styled.Text`
  font-family: "nanum-bold";
  font-size: 15px;
`;

const MemeberId = styled.Text`
  padding: 5px 0px 0px 5px;
  font-family: "nanum-regular";
  font-size: 14px;
`;

export default function FamilyWithUser({ navigation, route }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [families, setFamilies] = useState([]);
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
  } = useQuery(
    ["FamilyWithUser", { prev }],
    () => getFamilyWithUserApi({ prev }),
    {
      onSuccess: ({ data }) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setFamilies([...families, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    }
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setFamilies([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchFamilies();

    setRefreshing(false);
  };

  const renderFamily = ({ item: family }) => (
    <FamilyContainer disabled={true}>
      <RowContainer>
        <FamilyId style={{ flex: 1 }}>{`가족 번호: ${family.id}`}</FamilyId>
        <MemeberId>
          {`생성일: ${new Date(family.createdAt).toLocaleDateString("ko-KR")}`}
        </MemeberId>
      </RowContainer>
      <MemeberId>{`구성원: ${family.users.map((user) => user.id)}`}</MemeberId>
    </FamilyContainer>
  );

  if (families.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={families}
        renderItem={renderFamily}
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
      />
    </ScreenLayout>
  );
}
