import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Auth/Login";
import { ROUTE_NAME } from "../Strings";

/* create Stack Navigator */
const Stack = createStackNavigator();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "default",
        headerTitleStyle: { fontFamily: "nanum-bold" },
        headerTintColor: "#23222b",
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: "left",
        ...(Platform.OS === "ios" && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 400,
        }),
      }}
    >
      <Stack.Screen
        name={ROUTE_NAME.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
