import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Hidden,
  MenuItem,
} from '@mui/material';
import {
  Container,
  Main,
  Group,
  Text,
  SubTitle,
  InlineGroup,
  StyledLinkText,
  useStyles
} from '../styles';
import TextField from 'components/forms/TextField';
import PasswordField from 'components/forms/PasswordField';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import { useSignUp, useLogin, useUser } from 'baseapp-nextjs-core';
import Header from 'components/Header';
import { HeaderVariant } from 'components/Header/constants';
import { use100vh } from 'react-div-100vh';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from "yup"
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import { useEffect } from 'react';
import { SnackbarEnum } from 'common/enums';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';


export const signUpValidationSchema = Yup.object().shape({
  prefix: Yup.string(),
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  password: Yup.string().required('This field is required'),
  email: Yup.string()
    .email('Please provide a properly formatted email address')
    .required('This field is required'),
  username: Yup.string()
    .min(3, "Please enter a username with at least 3 characters")
    .max(20, "Plase enter a username with max 20 characters")
    .required('This field is required'),
  suffix: Yup.string(),
})

const defaultInitialValues = {
  prefix: '',
  firstName: '',
  lastName: '',
  password: '',
  email: '',
  username: '',
  suffix: ''
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const height = use100vh();
  const classes = useStyles();
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const { mutation: loginMutation, formik: loginFormik } = useLogin({
  });

  useEffect(() => {
    user && router.push({ pathname: `/${user?.username}/subscription`, query: { isFromRegister: true } });
  }, [user]
  )

  const { formik } = useSignUp({
    validationSchema: signUpValidationSchema,
    initialValues: defaultInitialValues,
    onSuccess: (response: any, variables: any) => { //eslint-disable-line @typescript-eslint/no-explicit-any
      const successVariant = { variant: SnackbarEnum.Success };
      const message = 'Successfully Registered';
      enqueueSnackbar(message, successVariant);
      loginMutation.mutate(variables as unknown as void);
    },
    onError: (error: AxiosError) => {
      formik.setErrors(error?.response?.data);
      const errorVariant = { variant: SnackbarEnum.Error };
      let message;
      switch (error?.response?.status) {
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        default:
          message = 'Something went wrong. Please try again.';
          break;
      }
      enqueueSnackbar(message, errorVariant);
    },
  });

  const loginLink = () => (
    <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
      <Text variant="body2">Already registered?</Text>
      <Link href="/" passHref>
        <StyledLinkText variant="body2">Login</StyledLinkText>
      </Link>
    </InlineGroup>
  )

  return (
    <Container>
      <Hidden smDown>
        <Header variant={HeaderVariant.Simple} />
      </Hidden>
      <Main>
        <Group height={height as number} style={{ maxWidth: "400px" }}>
          <form onSubmit={formik.handleSubmit}>
            <SubTitle variant="h4">
              Register
            </SubTitle>
            <StyledTextField
              label="Email Address*"
              name="email"
              type="email"
              placeholder="Email"
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
              label="Password*"
              name="password"
              formik={formik}
              fullWidth
              classes={classes}
            />

            <InlineGroup style={{ alignItems: "flex-start" }}>
              <StyledTextField
                label="Prefix"
                name="prefix"
                placeholder="Prefix"
                formik={formik}
                variant='outlined'
                fullWidth
                sx={{ width: "250px" }}
                select
                SelectProps={{
                  IconComponent: ExpandMoreIcon,
                  classes: {
                    icon: classes?.inputLabelField
                  },
                }}
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
              >
                <MenuItem value="">
                  None
                </MenuItem>
                <MenuItem value={"Dr."}>
                  Dr.
                </MenuItem>
              </StyledTextField>

              <StyledTextField
                label="First Name*"
                name="firstName"
                placeholder="First Name"
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
            </InlineGroup>
            <InlineGroup>
              <StyledTextField
                label="Last Name*"
                name="lastName"
                placeholder="Last Name"
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
              <StyledTextField
                label="Suffix"
                name="suffix"
                placeholder="Suffix"
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
            </InlineGroup>
            <InlineGroup style={{ alignItems: "center" }}>
              <Domain>
                whythefaceapp.com/
              </Domain>

              <StyledTextField
                label="Username*"
                name="username"
                placeholder="Username"
                formik={formik}
                fullWidth
                onFocus={() => {
                  const username = String(formik?.values["firstName"] + formik?.values["lastName"]).toLowerCase()
                  formik.setFieldValue("username", username.replace(/[\W_]+/g, ""))
                }}
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

            </InlineGroup>

            <SubmitButton type="submit" formik={formik} variant="contained" isLoading={loginFormik.isLoading}>
              Sign Up
            </SubmitButton>

            {loginLink()}
          </form>
        </Group>
      </Main>
    </Container >
  );
};

export default SignUp;

const StyledTextField = styled(TextField)`
    margin-top: ${({ theme }) => theme.spacing(3)};
`

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

const Domain = styled(Text)`
    margin-top: ${({ theme }) => theme.spacing(3)};
`
