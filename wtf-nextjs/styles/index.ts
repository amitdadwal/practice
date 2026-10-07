import styled from "@emotion/styled";
import colors from "styles/colors";
import { headerHeight } from "components/Header/constants";
import { Button, Typography } from "@mui/material";
import { fontSize } from "styles/utils";
import { HTMLAttributes } from "react";
import { makeStyles } from "@mui/styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  background-color: ${colors.purple[600]};
  min-height: calc(100vh - ${headerHeight}px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type GroupProps = HTMLAttributes<HTMLDivElement> & { height?: number };

export const Group = styled.div<GroupProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 614px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(5, 2, 2, 2)};
    min-height: 100vh;
    justify-content: space-evenly;
  }
`;

export const Title = styled(Typography)`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: ${fontSize(60)};
  line-height: 81px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(30)};
    line-height: 41px;
  } ;
 ` as unknown as typeof Typography;

export const SubTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 600;
  font-size: ${fontSize(30)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(24)};
    line-height: 31px;
  } ;
`;

export const Text = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 400;
  font-size: ${fontSize(16)};
  line-height: 22px;
`;

export const ImageButtonGroup = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-top: 0;
  } ;
`;

export const StartedButton = styled(Button)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  margin-left: 50px;
  height: 46px;
  &:hover {
    background-color: ${colors.gray[200]};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0;
    max-width: calc(100vw - ${({ theme }) => theme.spacing(4)});
    bottom: ${({ theme }) => theme.spacing(2)};
    height: 46px;
    flex: 0;
  } ;
`;

export const TextGroup = styled.div`
  /* flex: 1; */
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 200px;
  max-height: 253px;
  z-index:1;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(5, 6, 0)};
    max-width: 400px;
    max-height: 506px;
    flex: 1;
  } ;
`;

export const InlineGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content:flex-start;
  gap: ${({ theme }) => theme.spacing(1)};
`

export const StyledLinkText = styled(Text)`
    color: ${colors.green[600]};
    &:hover {
      cursor: pointer;
      color: ${colors.green[700]};
  }
`

export const StyledLinkTextPurple = styled(Text)`
    color: ${colors.purple[700]};
    &:hover {
      cursor: pointer;
      color: ${colors.gray[700]};
  }
`

export const useStyles = makeStyles(() => ({
  inputField: {
    color: '#FBFBFB',
    borderColor: '#FBFBFB',
    '&:focused': {
      color: '#FBFBFB',
      borderColor: '#FBFBFB',
    },
    '&:hover $notchedOutline': {
      color: '#FBFBFB',
      borderColor: '#FBFBFB',
    },
  },
  notchedOutline: {
    borderColor: '#FBFBFB',
    '&:focused': {
      color: '#FBFBFB',
      borderColor: '#FBFBFB',
    },
    '&:hover': {
      color: '#FBFBFB',
      borderColor: '#FBFBFB',
    },
  },
  inputLabelField: { color: '#FBFBFB !important' },
  helperText: { color: '#FBFBFB !important' }
}));