import styled from "styled-components/native";
import { Colors } from "../Config";

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Prompt = styled.View`
  padding: 10px 10px 0px 10px;
  margin-left: 7px;
`;

export const PromptText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

export const DetailModalContainer = styled.View`
  background-color: ${Colors.white};
  justify-content: center;
  border-radius: 15px;
  overflow: hidden;
  border: 0.5px solid ${Colors.borderLight};
  padding: 5px 10px;
  width: 140px;
`;

export const DetailModalRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 10px;
`;

export const DetailModalText = styled.Text`
  font-family: "nanum-regular";
`;

export const InputContainer = styled.View`
  margin: 10px 15px 20px 15px;
  padding: 12px 15px;
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 25px;
  height: 50px;
  justify-content: center;
`;

export const SelectionContainer = styled.TouchableOpacity`
  margin: 10px 15px 20px 15px;
  padding: 12px 15px;
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 25px;
  height: 50px;
  justify-content: center;
`;

export const SelectionText = styled.Text`
  font-family: "nanum-regular";
`;

export const Input = styled.TextInput`
  font-family: "nanum-regular";
`;

export const HeaderRightBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 8px;
  border-radius: 5px;
  margin: 0px 10px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const HeaderRightText = styled.Text`
  color: white;
  font-family: "nanum-regular";
`;

/** confirm modal */
export const ConfirmModalContainer = styled.View`
  background-color: white;
  width: 300px;
  border-radius: 7px;
`;

export const ConfirmModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: "nanum-regular";
`;

export const ConfirmModalBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
`;
