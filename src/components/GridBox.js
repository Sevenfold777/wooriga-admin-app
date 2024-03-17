import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import propTypes from "prop-types";
import { RowContainer } from "./Shared";
import { Colors } from "../Config";

const Container = styled.TouchableOpacity`
  flex: 1;
  /* aspect-ratio: ${4 / 3}; */
  border-radius: 10px;
  background-color: ${Colors.sub};
  margin: 0px 5px;
  padding: 20px;
`;

const BoxTitle = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

const BoxNumber = styled.Text`
  /* font-family: "nanum-bold"; */
  font-family: "nanum-regular";
  font-size: 22px;
`;

const BoxSubText = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
`;

export default function GridBox({
  title,
  count,
  onPress,
  isCompareText = true,
}) {
  return (
    <Container onPress={onPress}>
      <RowContainer>
        <BoxTitle>{title}</BoxTitle>
        {/* <BoxSubText>더보기</BoxSubText> */}
      </RowContainer>
      <RowContainer
        style={{
          paddingVertical: 5,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        {isCompareText && (
          <BoxSubText style={{ marginRight: 10, marginBottom: 2 }}>
            전날 대비
          </BoxSubText>
        )}

        <RowContainer style={{ justifyContent: "center" }}>
          <BoxNumber>{count}</BoxNumber>
          {isCompareText && (
            <Ionicons
              name={
                count === 0
                  ? "remove"
                  : count > 0
                  ? "chevron-up-circle"
                  : "chevron-down-circle"
              }
              size={18}
              style={{ marginLeft: 5 }}
            />
          )}
        </RowContainer>
      </RowContainer>
    </Container>
  );
}

GridBox.propTypes = {
  title: propTypes.string.isRequired,
  count: propTypes.number.isRequired,
  onPress: propTypes.func,
  isCompareText: propTypes.bool,
};
