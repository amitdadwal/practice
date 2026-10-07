import type { NextPage } from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { Button, Typography } from '@mui/material';
import { fontSize } from 'styles/utils';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import TextField from 'components/forms/TextField';
import { useFormik, FormikProps } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import PhotoRequirementsModal from 'components/modals/PhotoRequirementsModal';
import { useRouter } from 'next/router';
import ImageUploader from 'components/forms/ImageUploader';
import {
  axios,
  useMutation,
} from 'baseapp-nextjs-core';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import { useSnackbar } from 'notistack';
import { SnackbarEnum } from 'common/enums';
import { AxiosError } from 'axios';
interface SubmitFormValues {
  email: string;
  frontViewPhoto?: File | string;
  leftViewPhoto?: File | string;
  rightViewPhoto?: File | string;
  practitioner?: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  frontViewPhoto: Yup.mixed().required('Front View Photo is required'),
  leftViewPhoto: Yup.mixed().required('Left View Photo is required'),
  rightViewPhoto: Yup.mixed().required('Right View Photo is required'),
  practitioner: Yup.string()
});

const ClientsSubmit: NextPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(true);

  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const initialValues: SubmitFormValues = {
    email: '',
    frontViewPhoto: '',
    leftViewPhoto: '',
    rightViewPhoto: '',
    practitioner: "drtoddfrisch"
  };

  const formik: FormikProps<SubmitFormValues> = useFormik<SubmitFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  });

  const mutationFn = (data: SubmitFormValues) =>
    axios.post('/submissions', data);

  const { mutate } = useMutation(mutationFn, {
    onError: (error: AxiosError) => {
      formik.setErrors(error?.response?.data);
      const errorVariant = { variant: SnackbarEnum.Error };
      let message;
      switch (error?.response?.status) {
        case 400:
          message = `Invalid submission. Please change: ${Object.keys(
            error.response.data
          )
            .join(', ')
            .toString()}.`;
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        default:
          message = 'Something went wrong. Please try again.';
          break;
      }
      enqueueSnackbar(message, errorVariant);
    },
    onSuccess: () => {
      const successVariant = { variant: SnackbarEnum.Success };
      const message = 'Successfully Submitted';
      enqueueSnackbar(message, successVariant);
      router.push('/study/success');
    },
    onSettled: () => formik.setSubmitting(false),
  });

  return (
    <Container>
      <Main>
        <Group>
          <Title variant="h5">TBI PTSD STUDY</Title>
          <PhotoReqButton onClick={handleOpen}>
            <CameraAltOutlinedIcon sx={{ marginRight: 1 }} />
            Photo Requirements
          </PhotoReqButton>
          <PhotoRequirementsModal open={open} onClose={handleClose} />

          <Form onSubmit={formik.handleSubmit}>
            <SubTitle variant="h6">General Info</SubTitle>
            <StyledTextField
              label="Enter Email*"
              name="email"
              type="email"
              placeholder="Email"
              formik={formik}
              helperText=""
            />

            <SubTitle variant="h6">Image 1 (Front View)</SubTitle>
            <ImageUploader name="frontViewPhoto" formik={formik} />

            <SubTitle variant="h6">Image 2 (Left Side View)</SubTitle>
            <ImageUploader name="leftViewPhoto" formik={formik} />

            <SubTitle variant="h6">Image 3 (Right Side View)</SubTitle>
            <ImageUploader name="rightViewPhoto" formik={formik} />

            <SubmitButton formik={formik} type="submit">
              Submit
            </SubmitButton>
          </Form>
        </Group>
      </Main>
    </Container>
  );
};

export default ClientsSubmit;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: ${colors.gray[100]};
`;

const Main = styled.main`
  background-color: ${colors.gray[100]};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: ${({ theme }) => theme.spacing(4, 0)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 100%;
    padding: ${({ theme }) => theme.spacing(0)};
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 358px;
  overflow-y: auto;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

const Title = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  text-align: center;
  letter-spacing: 0.25px;
`;

const PhotoReqButton = styled(Button)`
  background-color: ${colors.blue[800]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[100]};
  height: 46px;
  max-width: 227px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.blue[900]};
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const SubTitle = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: 500;
  font-size: ${fontSize(20)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.purple[600]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
`;
