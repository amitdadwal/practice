import React from "react";
import { IconButton } from "@mui/material";
import Face from "@mui/icons-material/Face";
import styled from "@emotion/styled";
import colors from "styles/colors";
import FaceMapModal from "components/modals/FaceMapModal";

const ButtonContainer = styled(IconButton)`
  position: absolute;
  bottom: 32px;
  right: 32px;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: 50%;
  background-color: ${colors.orange[900]};
  width: 60px;
  height: 60px;
  &:hover {
    background-color: ${colors.orange[800]};
  }
`;

const FaceIcon = styled(Face)`
  width: 38px;
  height: 38px;
  object-fit: cover;
  color: ${colors.gray[100]};
`;

function ButtonWithLoading() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <ButtonContainer onClick={() => setIsOpen(true)}>
        <FaceIcon />
      </ButtonContainer>
      <FaceMapModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default ButtonWithLoading;
