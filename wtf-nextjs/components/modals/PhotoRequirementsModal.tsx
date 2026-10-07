import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import {
  Typography,
  Modal,
  Box,
  Theme,
  SxProps,
  IconButton,
} from '@mui/material';
import { fontSize } from 'styles/utils';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface PhotoRequirementsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ImageWithIconProps {
  src: string;
  alt: string;
  isValidImage?: boolean;
}

const PhotoRequirementsModal = ({
  open,
  onClose,
}: PhotoRequirementsModalProps): ReactElement => {
  const ImageWithIcon = (({ src, isValidImage, alt }: ImageWithIconProps) => {
    return (
      <ImageContainer>
        <Image src={src} alt={alt} />
        {isValidImage ? (
          <CheckCircleRoundedIcon
            sx={{ ...iconStyle, color: colors.green[900] }}
          />
        ) : (
          <CancelRoundedIcon sx={{ ...iconStyle, color: colors.red[100] }} />
        )}
      </ImageContainer>
    );
  }) as React.FC<ImageWithIconProps>;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <ModalTitle variant="h5">Photo Requirements</ModalTitle>
        <StyledIconButton onClick={onClose} name='close-button'>
          <CloseOutlinedIcon sx={{ color: colors.surface[50] }} />
        </StyledIconButton>

        <ImageGroup>
          <ImageWithIcon
            src={'/images/Front.png'}
            alt={'Front View Example'}
            isValidImage
          />
          <ImageWithIcon
            src={'/images/Left.png'}
            alt={'Left View Example'}
            isValidImage
          />
          <ImageWithIcon
            src={'/images/Right.png'}
            alt={'Right View Example'}
            isValidImage
          />
        </ImageGroup>

        <ImageGroup>
          <ImageWithIcon
            src={'/images/Blur.png'}
            alt={'Blur Image Bad Example'}
          />
          <ImageWithIcon
            src={'/images/Covered.png'}
            alt={'Covered Image Bad Example'}
          />
          <ImageWithIcon
            src={'/images/Selfie.png'}
            alt={'Selfie Image Bad Example'}
          />
        </ImageGroup>

        <div></div>
        <ModalText variant="subtitle1">
          <ul>
            <li>No selfies as facial distortion is common.</li>
            <li>Remove all face and ear jewelry.</li>
            <li>Neutral expression will render the most accurate read.</li>
            <li>Close-up, looking straight at camera Minimal to no makeup.</li>
            <li>Avoid digital manipulation, such as filters.</li>
            <li>Three photos:</li>
            <LiIdented>Frontal - non-smiling; </LiIdented>
            <LiIdented>
              Right side profile - hair pulled back from ear, full ear exposed;
            </LiIdented>
            <LiIdented>
              Left side profile - hair pulled back from ear, full ear exposed;
            </LiIdented>
          </ul>
        </ModalText>
      </Box>
    </Modal>
  );
};

export default PhotoRequirementsModal;

const modalBoxStyle: SxProps<Theme> = (theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '90vh',
  maxWidth: '618px',
  width: '100%',
  bgcolor: 'primary.main',
  boxShadow: 24,
  borderRadius: '8px',
  p: 4,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.5em',
    height: '0.5em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderRadius: '3px',
    '&:hover': {
      background: 'rgba(255,255,255,.2)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    p: 2,
    maxWidth: '95%',
  },
});

const ModalTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(20)};
    line-height: 24px;
  } ;
`;

const LiIdented = styled.li`
  margin-left: ${({ theme }) => theme.spacing(4)}; ;
`;

const ModalText = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: normal;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(18)};
  } ;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`;

const ImageGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(4, 0, 2)};
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 153px;
  max-height: 153px;
  &:not(:last-child) {
    margin-right: ${({ theme }) => theme.spacing(1)};
  }
`;

const iconStyle = {
  position: 'absolute',
  right: -10,
  top: -10,
  backgroundColor: colors.gray[100],
  borderRadius: '50%',
  outline: 0,
};

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: ${({ theme }) => theme.spacing(1)};
    right: ${({ theme }) => theme.spacing(1)};
  }
`;
