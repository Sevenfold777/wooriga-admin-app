import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "../components/nav/TabIcon";
import { ROUTE_NAME } from "../Strings";
import Home from "../screens/Home/Home";
import MessageHome from "../screens/Message/MessageHome";
import Etc from "../screens/ETC/Etc";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function MainTabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: "nanum-bold" },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name={ROUTE_NAME.HOME}
        component={Home}
        options={({ navigation }) => ({
          // headerTitle: "메세지",
          headerTitle: "홈",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="home" isFocused={focused} />
          ),
        })}
      />

      <Tab.Screen
        name={ROUTE_NAME.MESSAGE_HOME}
        component={MessageHome}
        options={({ navigation }) => ({
          // headerTitle: "메세지",
          headerTitle: "우리가 이야기",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="chatbubbles" isFocused={focused} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTE_NAME.MESSAGE_INSTA_THUMBNAIL)
              }
            >
              <Ionicons
                name="logo-instagram"
                // name="easel-outline"
                style={{ paddingRight: 15, paddingLeft: 7 }}
                size={24}
              />
            </TouchableOpacity>
          ),
        })}
      />

      {/* <Tab.Screen
        name={ROUTE_NAME.PHOTO_HOME}
        component={PhotoHome}
        options={({ navigation }) => ({
          // headerTitle: "메세지",
          headerTitle: "가족앨범",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="images" isFocused={focused} />
          ),
        })}
      /> */}

      <Tab.Screen
        name={ROUTE_NAME.ETC}
        component={Etc}
        options={({ navigation }) => ({
          // headerTitle: "메세지",
          headerTitle: "기타",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="ellipsis-horizontal" isFocused={focused} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
