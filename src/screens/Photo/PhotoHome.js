import { Text, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";

export default function PhotoHome({ navigation, route }) {
  return (
    <ScreenLayout>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text
          style={{
            fontFamily: "nanum-regular",
            fontSize: 16,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          {"편지 주제말고는 생각 안남\n그런데 주제는 해야하나? 싶기도"}
        </Text>
      </View>
    </ScreenLayout>
  );
}
