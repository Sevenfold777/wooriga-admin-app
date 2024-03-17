import WebView from "react-native-webview";
import { Colors } from "../Config";
import { useEffect } from "react";

export default function WebViewScreen({ navigation, route: { params } }) {
  useEffect(() => {
    navigation.setOptions({ headerTitle: params?.headerTitle });
  }, []);

  return (
    <WebView
      source={{ uri: params?.url }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: Colors.white }}
    />
  );
}
