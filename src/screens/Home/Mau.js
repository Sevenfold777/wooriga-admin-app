import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import ScreenLayout from "../../components/ScreenLayout";
import { useQuery } from "@tanstack/react-query";
import { getDAUApi, getMAUApi } from "../../api/UserApi";
import NoContent from "../../components/NoContent";

const BarItem = styled.View`
  padding: 10px;
  background-color: ${Colors.sub};
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  margin: 0px 5px;
`;

export default function Mau({ navigation, route: { params } }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [maus, setMaus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {} = useQuery(["DAU", { prev }], () => getMAUApi({ prev }), {
    onSuccess: ({ data }) => {
      if (data.length === 0) {
        setIsLast(true);
      } else {
        setPrev(prev + 1);
        setMaus([...maus, ...data]);
      }

      setQueryEnable(false);
      setIsLoading(false);
    },

    enabled: queryEnable,
  });

  const { width: pageWidth, height: pageHeight } = useWindowDimensions();

  const [data, setData] = useState([]);

  const max = 40;

  const renderBar = ({ item }) => (
    <BarItem
      style={{
        height: (item.count / (parseInt(max / pageHeight) + 1)) * 3,
        width: 50,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "nanum-regular",
          position: "absolute",
          left: 5,
          top: 5,
          fontSize: 11,
        }}
      >
        {item.count}
      </Text>
      <Text
        style={{
          fontFamily: "nanum-regular",
          position: "absolute",
          left: "50%",
          bottom: -25,
          fontSize: 11,
        }}
      >
        {`${new Date(item.date).getMonth()}월`}
      </Text>
    </BarItem>
  );

  if (maus.length === 0) {
    if (isLast) {
      return <NoContent payload={"내일까지 기다려주세요"} />;
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
      <View>
        <FlatList
          data={maus}
          renderItem={renderBar}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-end",
            borderBottomWidth: 1,
            borderBottomColor: Colors.borderDark,
            paddingHorizontal: 10,
            marginTop: 50,
            marginBottom: 100,
            minWidth: pageWidth,
          }}
          inverted={true}
          onEndReached={() => {
            if (!isLast && !isLoading) {
              fetchMore();
            }
          }}
          onEndReachedThreshold={0.01}
          ListEmptyComponent={
            <Text style={{ fontFamily: "nanum-regular" }}>
              기록 중입니다. 내일 확인해주세요.
            </Text>
          }
          bounces={false}
        />
      </View>
    </ScreenLayout>
  );
}
