import type { NextPage } from 'next';
import {
  Hidden,
} from '@mui/material';
import {
  Container,
  Main,
  Group,
  Text,
  SubTitle,
  InlineGroup,
} from '../../styles';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import Header from 'components/Header';
import { HeaderVariant } from 'components/Header/constants';
import { use100vh } from 'react-div-100vh';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import Image from "next/image"

const SignUp: NextPage = () => {
  const height = use100vh();

  return (
    <Container>
      <Hidden smDown>
        <Header variant={HeaderVariant.Simple} />
      </Hidden>
      <Main>
        <Group height={height as number} style={{ maxWidth: "400px", width: "358px" }}>
          <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
            <Image
              src={'/images/Confirmation.svg'}
              alt={'Confirmation Icon'}
              width={150}
              height={64}
            />
          </InlineGroup>

          <form style={{ width: "100%" }}>
            <SubTitle sx={{ marginTop: "56px" }} variant="h4">
              Password reset
            </SubTitle>
            <BodyText variant="body2">
              Your password has been successfully reset. Click below to log in.
            </BodyText>
            <Link href="/" passHref>
              <SubmitButton type="submit" variant="contained">
                Continue
              </SubmitButton>
            </Link>
          </form>
        </Group>
      </Main>
    </Container >
  );
};

export default SignUp;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom:  ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.gray[200]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
  }
`;

const BodyText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  font-weight: 500;
  font-size: 15px;
  `
