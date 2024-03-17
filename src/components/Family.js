import styled from "styled-components/native";
import { RowContainer } from "./Shared";
import { Colors } from "../Config";

const FamilyContainer = styled.TouchableOpacity`
  background-color: white;
  justify-content: center;
  padding: 17px 20px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 3px 0px;
  border-radius: 10px;
`;

const FamilyId = styled.Text`
  padding: 2px 0px;
  font-family: "nanum-bold";
`;

const UserId = styled.Text`
  font-size: 13px;
  padding: 2px 0px;
  font-family: "nanum-regular";
  margin-right: 5px;
`;

export default function FamilyItem({ id, users }) {
  return (
    <FamilyContainer>
      <FamilyId>{`가족 ID :${id}`}</FamilyId>
      <RowContainer style={{ paddingHorizontal: 5 }}>
        <UserId>구성원: </UserId>
        {users.map((user, index) => (
          <UserId key={index}>{user}</UserId>
        ))}
      </RowContainer>
    </FamilyContainer>
  );
}
