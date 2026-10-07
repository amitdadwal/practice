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
} from '../../styles';
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
        <Group height={height as number} style={{ maxWidth: "400px", width: "358px" }}>
          <InlineGroup style={{ justifyContent: "center", fontSize: fontSize(14) }}>
            <Image
              src={'/images/Email.svg'}
              alt={'Email Icon'}
              width={150}
              height={64}
            />
          </InlineGroup>

          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <SubTitle sx={{ marginTop: "56px" }} variant="h4">
              Check your email
            </SubTitle>
            <BodyText variant="body2">
              We sent a password link to <EmailText>
                {router.query.email}
              </EmailText>

            </BodyText>
            {loginLink()}
          </form>
        </Group>
      </Main>
    </Container >
  );
};

export default SignUp;

const BodyText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  font-weight: 500;
  font-size: 15px;
  `

const EmailText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  font-weight: 600;
  font-size: 14px;
  color:  ${colors.green[600]};
`

const LinkText = styled(Text)`
  &:hover {
    color: ${colors.gray[200]};
    cursor: pointer;
  }
`