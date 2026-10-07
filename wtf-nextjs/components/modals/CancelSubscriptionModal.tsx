import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import colors from "styles/colors";
import { Typography, Modal, Box, Theme, SxProps } from "@mui/material";
import { fontSize } from "styles/utils";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  mutateCancel: () => void;
  isCanceling: boolean;
}

const CancelSubscriptionModal = ({
  open,
  onClose,
  mutateCancel,
  isCanceling,
}: PaymentMethodModalProps): ReactElement => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <ModalTitle>Cancel Subscription?</ModalTitle>
        <CancelDescription>
          Your subscription will be canceled at the end of your billing period.
          You won’t be able to access your account after that date. You can
          change your mind any time before this date.
        </CancelDescription>
        <CancelButtonsWrapper>
          <CloseButton onClick={() => onClose()}>Close</CloseButton>
          <CancelButton onClick={() => mutateCancel()} isLoading={isCanceling}>Cancel Subscription</CancelButton>
        </CancelButtonsWrapper>
      </Box>
    </Modal>
  );
};

export default CancelSubscriptionModal;

const modalBoxStyle: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "432px",
  height: "278px",
  bgcolor: `${colors.background[50]}`,
  boxShadow: 24,
  borderRadius: "8px",
  padding: "32px 32px 32px 32px",
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
  color: ${colors.gray[700]};
  font-weight: 600;
  margin-bottom : 24px;
  font-size: 18px;
  line-height: 24px;
  font-size: ${fontSize(18)};
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(20)};
    line-height: 24px;
  } ;
`;

const CancelButton = styled(ButtonWithLoading)`
  background-color: ${colors.red[300]};
  text-transform: none;
  padding: 8px 12px;
  color: ${colors.surface[50]};
  height: 46px;
  width: 214px;
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
`;

const CloseButton = styled.div`
  width: 142px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0.25px;
  color: ${colors.gray[500]};
  cursor: pointer;
`;

const CancelButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const CancelDescription = styled.div`
  height: 88px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.25px;
`;
