import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PasswordField from 'components/forms/PasswordField';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import { IUser, useLogin, useUser } from 'baseapp-nextjs-core';
import { Hidden } from '@mui/material';
import { HeaderVariant } from 'components/Header/constants';
import Header from 'components/Header';
import colors from '../styles/colors';
import {
  Container,
  Main,
  Group,
  TextGroup,
  Title,
  SubTitle,
  ImageButtonGroup,
  InlineGroup,
  Text,
  StyledLinkText,
  useStyles
} from '../styles';
import styled from '@emotion/styled';
import { use100vh } from 'react-div-100vh';
import TextField from 'components/forms/TextField';
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import { useEffect } from 'react';

const Login: NextPage = () => {
  const height = use100vh();
  const classes = useStyles();

  const { user } = useUser();

  useEffect(() => {
    if (user?.username) {
      router.push(`/${user?.username}/doctor`);
    }
  })

  const router = useRouter();
  const defaultInitialValues = {
    email: '',
    password: '',
  };
  const { formik } = useLogin({
    onSuccess: ({ data }: { data: IUser }) => {
      router.push(`/${data.username}/doctor`);
    },
    initialValues: defaultInitialValues,
  });

  const registerLink = () => (
    <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
      <Text variant="body2">Don’t have an account?</Text>
      <Link href="/signup" passHref>
        <StyledLinkText variant="body2">Register</StyledLinkText>
      </Link>
    </InlineGroup>
  )

  const resetPassword = () => (
    <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
      <Text variant="body2">Forgot your password?</Text>
      <Link href="/forgot-password" passHref>
        <StyledLinkText variant="body2">Reset</StyledLinkText>
      </Link>
    </InlineGroup>
  )

  return (
    <Container>
      <Hidden smDown>
        <Header variant={HeaderVariant.Simple} />
      </Hidden>
      <Main>
        <Group height={height as number}>
          <div style={{ flex: 2 }}>
            <TextGroup>
              <Title variant="h1" sx={{ color: colors.green.A400 }}>
                WTF?
              </Title>
              <Title variant="h1" sx={{ color: colors.gray[100] }}>
                Why the Face:
              </Title>
              <SubTitle variant="h4">
                Understanding Health & Personality Through Facial Analysis
              </SubTitle>
            </TextGroup>
            <ImageButtonGroup>
              <Image src="/images/wtflogo.png" alt="Why the Face" />
              <Hidden smDown>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    formik={formik}
                    fullWidth
                    InputLabelProps={{
                      classes: {
                        root: classes?.inputLabelField,
                        focused: classes?.inputLabelField,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes?.inputField,
                        notchedOutline: classes?.notchedOutline,
                      },
                    }}
                  />
                  <PasswordField
                    label="Password"
                    name="password"
                    formik={formik}
                    classes={classes}
                  />

                  <SubmitButton
                    type="submit"
                    formik={formik}
                    variant="contained"
                  >
                    Login
                  </SubmitButton>
                  {registerLink()}
                  {resetPassword()}
                </form>
              </Hidden>
            </ImageButtonGroup>
            <Hidden smUp>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  formik={formik}
                  fullWidth
                  InputLabelProps={{
                    classes: {
                      root: classes?.inputLabelField,
                      focused: classes?.inputLabelField,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes?.inputField,
                      notchedOutline: classes?.notchedOutline,
                    },
                  }}
                />
                <PasswordField
                  label="Password"
                  name="password"
                  formik={formik}
                  classes={classes}
                />

                <SubmitButton type="submit" formik={formik}>
                  Login
                </SubmitButton>
                {registerLink()}
                {resetPassword()}
              </form>
            </Hidden>
          </div>
        </Group>
      </Main>
    </Container>
  );
};

export default Login;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.gray[200]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
  }
`;
export const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 200px;
  max-height: 253px;
  margin-right: 100px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-self: center;
    padding: ${({ theme }) => theme.spacing(5, 10, 5)};
    max-width: 400px;
    max-height: 506px;
    flex: 1;
    margin-right: 0;
  }
`;

