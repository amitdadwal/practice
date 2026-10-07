import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import colors from "styles/colors";
import {
  Typography,
  Modal,
  Box,
  Theme,
  SxProps,
  IconButton,
} from "@mui/material";
import { fontSize } from "styles/utils";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface FaceMapModalProps {
  open: boolean;
  onClose: () => void;
}

const FaceMapModal = ({ open, onClose }: FaceMapModalProps): ReactElement => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <ModalTitle variant="h5">Face Map</ModalTitle>
        <StyledIconButton onClick={onClose} name="close-button">
          <CloseOutlinedIcon sx={{ color: colors.surface[50] }} />
        </StyledIconButton>
        <ImageContainer>
          <Image src="/images/FaceMap.png" alt="Face Map" />
        </ImageContainer>
      </Box>
    </Modal>
  );
};

export default FaceMapModal;

const modalBoxStyle: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "762px",
  maxHeight: "95vh",
  width: "100%",
  bgcolor: "primary.main",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.5em",
    height: "0.5em",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.1)",
    borderRadius: "3px",
    "&:hover": {
      background: "rgba(255,255,255,.2)",
    },
  },
  [theme.breakpoints.down("md")]: {
    p: 2,
    maxWidth: "95%",
  },
});

const ModalTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(20)};
    line-height: 24px;
  } ;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: ${({ theme }) => theme.spacing(1)};
    right: ${({ theme }) => theme.spacing(1)};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 65px 52px 44px;
`;
