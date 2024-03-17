import styled from "styled-components/native";
import { Colors } from "../Config";

export const EmotionWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin: 0px 10px;
`;

export const EmotionOwner = styled.Text`
  padding: 5px;
  font-family: "nanum-regular";
  text-align: center;
`;

export const Emotion = styled.Image`
  background-color: ${Colors.borderDark};
  border-width: 2px;
  border-color: ${Colors.main};
  border-radius: ${(props) => `${(props.pageWidth - 100) / 8}px`};
  width: ${(props) => `${(props.pageWidth - 100) / 4}px`};
  height: ${(props) => `${(props.pageWidth - 100) / 4}px`};
`;
