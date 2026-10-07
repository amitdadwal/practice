import { ReactElement } from "react";
import styled from "@emotion/styled";
import { Typography, Modal, Box } from "@mui/material";
import Link from "next/link";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import colors from "styles/colors";
import { fontSize } from "styles/utils";
import { StyledLinkTextPurple } from "styles";

interface AdModalProps {
  open: boolean;
  onClose: () => void;
}

const AdModal = ({ open, onClose }: AdModalProps): ReactElement => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalTitle>Get One Month Free Trial!</ModalTitle>
        <Description>
          Enjoy 30 days free app trial when you complete the{" "}
          <Link href="https://wtfwhytheface.com/master-class/">
            <StyledLinkTextPurple variant="body2">
              Facial Analysis Master Class
            </StyledLinkTextPurple>
          </Link>
          <ul style={{paddingLeft: 20}}>
            <li>You will be provided with a coupon code at the end of the Master Class.</li>
            <li>You will add your credit card information and will receive an additional discount for the six months following your 30 day free trial and will be charged full price thereafter.</li>
            <li>You may cancel anytime before the 30 day trial ends.</li>
          </ul>
        </Description>
        <ButtonsWrapper>
          <Button onClick={() => onClose()}>Continue</Button>
        </ButtonsWrapper>
      </ModalBox>
    </Modal>
  );
};

export default AdModal;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
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
`;

const Description = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.25px;
`;
