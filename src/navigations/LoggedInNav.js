import { createStackNavigator } from "@react-navigation/stack";
import MainTabNav from "./MainTabNav";
import { ROUTE_NAME } from "../Strings";
import WebViewScreen from "../screens/WebViewScreen";
import MessageAdd from "../screens/Message/MessageAdd";
import MessageScreen from "../screens/Message/MessageScreen";
import MessageListScreen from "../screens/Message/MessageListScreen";
import MessageComments from "../screens/Message/MessageComments";
import { Platform } from "react-native";
import FamilyWithUser from "../screens/Home/FamilyWithUser";
import UserStat from "../screens/Home/UserStat";
import MessageInstaThumbnail from "../screens/Message/MessageInstaThumbnail";
import Dau from "../screens/Home/Dau";
import Mau from "../screens/Home/Mau";

const Stack = createStackNavigator();

export default function LoggedInNav({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: "#23222b",
        animation: "none",
        headerTitleStyle: { fontFamily: "nanum-bold" },
        headerTitleAlign: "left",
        ...(Platform.OS === "ios" && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 400,
          gestureVelocityImpact: 1,
        }),
      }}
      // initialRouteName={initialRoute}
    >
      <Stack.Screen
        name={ROUTE_NAME.MAIN_TAB_NAV}
        component={MainTabNav}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ROUTE_NAME.WEB_VIEW_SCREEN}
        component={WebViewScreen}
        options={{ headerTitle: "웹뷰" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_ADD}
        component={MessageAdd}
        options={{
          headerTitle: "이야기 작성",
          ...(Platform.OS === "ios" && { gestureEnabled: false }),
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_SCREEN}
        component={MessageScreen}
        options={{ headerTitle: "우리가 이야기" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_LIST_SCREEN}
        component={MessageListScreen}
        options={{ headerTitle: "우리가 이야기" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_COMMENTS}
        component={MessageComments}
        options={{ headerTitle: "이야기 댓글" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.FAMILY_WITH_USER}
        component={FamilyWithUser}
        options={{ headerTitle: "가족 목록" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.USER_STAT}
        component={UserStat}
        options={{ headerTitle: "사용자 통계" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_INSTA_THUMBNAIL}
        component={MessageInstaThumbnail}
        options={{ headerTitle: "인스타 썸네일" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.DAU}
        component={Dau}
        options={{ headerTitle: "일간 활성 사용자" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MAU}
        component={Mau}
        options={{ headerTitle: "월간 활성 사용자" }}
      />
    </Stack.Navigator>
  );
}
