import { ReactElement } from "react";
import styled from "@emotion/styled";
import { Typography, Modal, Box } from "@mui/material";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import colors from "styles/colors";
import { fontSize } from "styles/utils";

interface PromotionalCodeModalProps {
  open: boolean;
  onClose: () => void;
  error?: "Empty coupon" | "Coupon already used" | "Invalid coupon";
  price: number;
}

const PromotionalCodeModal = ({
  open,
  onClose,
  error,
  price,
}: PromotionalCodeModalProps): ReactElement => {
  const errorMessages = {
    "Empty coupon": 'The promotional code you have entered is invalid. You will be charged the full subscription fee.',
    "Coupon already used": 'This promotion code has already been used. You will be charged the full subscription fee.',
    "Invalid coupon": 'The promotional code you have entered is invalid. You will be charged the full subscription fee.'
  }

  const description = (error && errorMessages[error]) || `The promotional code you entered gives you one month of our subscription for free. You can cancel any time. After the trial ends you will be charged $${price}/month.`

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalTitle>
          {!!error ? "Warning! Invalid promotional code" : "One month trial!"}
        </ModalTitle>
        <Description>
          {description}
        </Description>
        <ButtonsWrapper>
          <Button onClick={() => onClose()}>Continue</Button>
        </ButtonsWrapper>
      </ModalBox>
    </Modal>
  );
};

export default PromotionalCodeModal;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 278px;
  background-color: ${colors.background[50]};
  box-shadow: 24;
  border-radius: 8px;
  padding: 32px;
  overflow-y: auto;
  &::-webkit-scrollbar: {
    width: 0.5em;
    height: 0.5em;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    p: 2;
    max-width: 95%;
  } ;
`;

const ModalTitle = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: 600;
  margin-bottom: 24px;
  font-size: 18px;
  line-height: 24px;
  font-size: ${fontSize(18)};
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(20)};
    line-height: 24px;
  } ;
`;

const Button = styled(ButtonWithLoading)`
  background-color: ${colors.purple[700]};
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

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const Description = styled.div`
  height: 88px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.25px;
`;
