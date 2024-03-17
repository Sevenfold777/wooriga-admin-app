import styled from "styled-components/native";
import { Colors } from "../../Config";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, AppState } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ROUTE_NAME } from "../../Strings";
import PropTypes from "prop-types";
import { RowContainer } from "../Shared";

export const ThemeContainer = styled.TouchableOpacity`
  background-color: white;
  justify-content: center;
  padding: 17px 20px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 3px 0px;
  border-radius: 10px;
`;

export const ThemeDetail = styled.View`
  padding: 0px 10px;
`;

export const ThemeTextBold = styled.Text`
  padding: 2px 0px;
  font-family: "nanum-bold";
`;

export const ThemeText = styled.Text`
  font-size: 13px;
  padding: 2px 0px;
  font-family: "nanum-regular";
`;

export const ProgressBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
  margin: 10px 0px;
  border-radius: 7px;
`;

export const Progress = styled.View`
  border-radius: 7px;
  padding: 5px 0px;
  flex: ${(props) => props.percentage};
  justify-content: center;
  align-items: center;
`;

export const ReceiverContainer = styled.View`
  justify-content: center;
  align-items: flex-end;
`;

export const ChgHashTagText = styled(ThemeText)`
  margin-right: 5px;
  color: ${Colors.main};
`;

export const HashTag = styled.View`
  justify-content: center;
  align-items: center;
  border: 1px solid ${Colors.borderDark};
  border-radius: 30px;
  padding: 10px;
  margin: 0px 5px;
`;

export const HashTagText = styled.Text`
  font-family: "nanum-regular";
`;

export function LetterTheme({ id, title, hashtags, isSelect, sentAmount }) {
  const navigation = useNavigation();

  return (
    <ThemeContainer
      onPress={() =>
        navigation.push(ROUTE_NAME.LETTER_THEME_DETAIL, {
          themeId: id,
          headerTitle: title,
          isSelect,
        })
      }
    >
      <RowContainer>
        <View style={{ flex: 1 }}>
          <RowContainer>
            <ThemeTextBold
              numberOfLines={1}
              style={{ flex: 1, marginRight: 3 }}
            >
              {title}
            </ThemeTextBold>
            <RowContainer
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                padding: 3,
                borderRadius: 5,
              }}
            >
              <Ionicons
                name="paper-plane-outline"
                color={"white"}
                style={{ marginRight: 3 }}
              />
              <HashTagText style={{ color: "white" }}>{sentAmount}</HashTagText>
            </RowContainer>
          </RowContainer>

          <RowContainer>
            <ThemeDetail style={{ flex: 1 }}>
              <RowContainer>
                {hashtags.map((tag, index) => (
                  <ChgHashTagText key={index}>{`#${tag.name} `}</ChgHashTagText>
                ))}
              </RowContainer>
            </ThemeDetail>
          </RowContainer>
        </View>
        {/* <Ionicons name="chevron-forward" size={15} color={Colors.borderDark} /> */}
      </RowContainer>
    </ThemeContainer>
  );
}

LetterTheme.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isSelect: PropTypes.bool.isRequired,
  hashtags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired, // 필요는 없음 raw 그냥 받음
    })
  ),
};
