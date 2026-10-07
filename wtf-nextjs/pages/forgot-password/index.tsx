import type { NextPage } from 'next';
import { useRouter } from 'next/router';
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
  useStyles,
} from '../../styles';
import TextField from 'components/forms/TextField';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import { useMutation } from 'baseapp-nextjs-core';
import Header from 'components/Header';
import { HeaderVariant } from 'components/Header/constants';
import { use100vh } from 'react-div-100vh';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import * as Yup from "yup"
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { axios } from "baseapp-nextjs-core";
import { SnackbarEnum } from 'common/enums';
import Image from "next/image"

interface SubmitFormValues {
  email: string;
}

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a properly formatted email address')
    .required('This field is required'),
})

const initialValues: SubmitFormValues = {
  email: '',
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const height = use100vh();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  })

  const mutationFn = (data: SubmitFormValues) =>
    axios.post('/forgot-password', data);


  const { mutate } = useMutation(mutationFn, {
    onSuccess: () => {
      const message = "Please verify your email";
      enqueueSnackbar(message, { variant: SnackbarEnum.Success });
      router.push({
        pathname: "/forgot-password/sent",
        query: { email: formik?.values?.email },
      })
    },
    onError: (error: AxiosError) => {
      console.log(error);
    },
  });


  const loginLink = () => (
    <Link href="/" passHref>
      <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
        <ArrowBackIcon sx={{ color: colors.gray[400] }} fontSize={"small"} />
        <LinkText variant="body2">Back to login</LinkText>
      </InlineGroup>
    </Link>
  )

  return (
    <Container>
      <Hidden smDown>
        <Header variant={HeaderVariant.Simple} />
      </Hidden>
      <Main>
        <Group height={height as number} style={{ maxWidth: "400px" }}>
          <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
            <Image
              src={'/images/Password.svg'}
              alt={'Password Icon'}
              width={150}
              height={64}
              />
          </InlineGroup>

          <form onSubmit={formik.handleSubmit}>
            <SubTitle sx={{ marginTop: "56px" }} variant="h4">
              Forgot password?
            </SubTitle>
            <BodyText variant="body2">
              No worries, enter your email and we&apos;ll send you reset instructions.
            </BodyText>
            <StyledTextField
              label="Email Address"
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

            <SubmitButton type="submit" formik={formik} variant="contained">
              Reset password
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

const BodyText = styled(Text)`
    margin-top: ${({ theme }) => theme.spacing(3)};
    margin-bottom: ${({ theme }) => theme.spacing(6)};
`
const LinkText = styled(Text)`
  &:hover {
    color: ${colors.gray[200]};
    cursor: pointer;
  }
`