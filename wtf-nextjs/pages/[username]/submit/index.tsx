import type { NextPage } from "next";
import styled from "@emotion/styled";
import colors from "styles/colors";
import { Button, Typography, Hidden, Checkbox } from "@mui/material";
import { fontSize } from "styles/utils";
import Header from "components/Header";
import { headerHeight, HeaderVariant } from "components/Header/constants";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import TextField from "components/forms/TextField";
import { useFormik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import PhotoRequirementsModal from "components/modals/PhotoRequirementsModal";
import { useRouter } from "next/router";
import ImageUploader from "components/forms/ImageUploader";
import {
  axios,
  useMutation,
  useUser,
  useQuery,
  IUser,
} from "baseapp-nextjs-core";
import "yup-phone";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import { useSnackbar } from "notistack";
import { SnackbarEnum } from "common/enums";
import { AxiosError } from "axios";
import { EmptyMessage } from "../doctor";
interface SubmitFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  frontViewPhoto?: File | string;
  leftViewPhoto?: File | string;
  rightViewPhoto?: File | string;
  practitioner: string;
  trackingCode: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .phone("US", false, "Please use a valid Phone Number"),
  frontViewPhoto: Yup.mixed().required("Front View Photo is required"),
  leftViewPhoto: Yup.mixed().required("Left View Photo is required"),
  rightViewPhoto: Yup.mixed().required("Right View Photo is required"),
  practitioner: Yup.string(),
  trackingCode: Yup.string(),
});

const ClientsSubmit: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [open, setOpen] = useState<boolean>(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (user && !user?.subscriptionPlan) {
      router.push(`/${user?.username}/subscription`);
    }
  }, [user]);

  const { data, isLoading: loadingPractitioner } = useQuery<{
    data: { count: number; results: IUser[] };
  }>(`/users?q=${router?.query?.username}`);

  const practitioner = data?.data?.results[0];

  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const initialValues: SubmitFormValues = {
    name: (router?.query?.name as string) || "",
    email: (router?.query?.email as string) || "",
    phoneNumber: (router?.query?.phone as string) || "",
    frontViewPhoto: "",
    leftViewPhoto: "",
    rightViewPhoto: "",
    practitioner: (router?.query?.username as string) || "",
    trackingCode: (router?.query?.code as string) || "",
  };

  const formik: FormikProps<SubmitFormValues> = useFormik<SubmitFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  });

  useEffect(() => {
    formik.setFieldValue("practitioner", router?.query?.username);
  }, [router?.query?.username]);

  useEffect(() => {
    formik.setFieldValue("name", router?.query?.name);
  }, [router?.query?.name]);

  useEffect(() => {
    formik.setFieldValue("email", router?.query?.email);
  }, [router?.query?.email]);

  useEffect(() => {
    formik.setFieldValue("phoneNumber", router?.query?.phone);
  }, [router?.query?.phone]);

  useEffect(() => {
    formik.setFieldValue("trackingCode", router?.query?.code);
  }, [router?.query?.code]);

  const mutationFn = (data: SubmitFormValues) =>
    axios.post("/submissions", data);

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
            .join(", ")
            .toString()}.`;
          break;
        case 500:
          message = "Internal server error. Please try again later.";
          break;
        default:
          message = "Something went wrong. Please try again.";
          break;
      }
      enqueueSnackbar(message, errorVariant);
    },
    onSuccess: () => {
      const successVariant = { variant: SnackbarEnum.Success };
      const message = "Successfully Submitted";
      enqueueSnackbar(message, successVariant);
      router.push(`/${router?.query?.username}/submit/success`);
    },
    onSettled: () => formik.setSubmitting(false),
  });

  if (loadingPractitioner) return <Container />

  return (
    <Container>
      <Hidden smDown>
        <Header variant={user ? HeaderVariant.Default : HeaderVariant.Simple} />
      </Hidden>
      <Hidden smUp>{user && <Header variant={HeaderVariant.Default} />}</Hidden>

      {practitioner?.subscriptionPlan ? (
        <Main>
          <Group>
            <Title variant="h5">Get Started</Title>
            <PhotoReqButton onClick={handleOpen}>
              <CameraAltOutlinedIcon sx={{ marginRight: 1 }} />
              Photo Requirements
            </PhotoReqButton>
            <PhotoRequirementsModal open={open} onClose={handleClose} />

            <form onSubmit={formik.handleSubmit}>
              <SubTitle variant="h6">General Info</SubTitle>
              <StyledTextField
                label="Enter Name*"
                name="name"
                type="text"
                placeholder="Name"
                formik={formik}
                helperText=""
              />
              <StyledTextField
                label="Enter Email*"
                name="email"
                type="email"
                placeholder="Email"
                formik={formik}
                helperText=""
              />
              <StyledTextField
                label="Enter Phone*"
                name="phoneNumber"
                type="phoneNumber"
                placeholder="Phone Number"
                formik={formik}
                helperText=""
              />

              <SubTitle variant="h6">Image 1 (Front View)</SubTitle>
              <ImageUploader name="frontViewPhoto" formik={formik} />

              <SubTitle variant="h6">Image 2 (Left Side View)</SubTitle>
              <ImageUploader name="leftViewPhoto" formik={formik} />

              <SubTitle variant="h6">Image 3 (Right Side View)</SubTitle>
              <ImageUploader name="rightViewPhoto" formik={formik} />

              <HiddenField
                label="Tracking Code"
                name="trackingCode"
                type="text"
                placeholder="Tracking Code"
                formik={formik}
                helperText=""
              />

              <TermsWrapper style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  sx={{
                    color: colors.purple[800],
                    "&.Mui-checked": {
                      color: colors.purple[800],
                    },
                    "&.MuiCheckbox-root": {
                      paddingLeft: "3px",
                    },
                  }}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
                <div>
                  I agree to these{" "}
                  <TermsDownload
                    href="/terms/WTF-Image-License-Agreement.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    terms and conditions
                  </TermsDownload>
                </div>
              </TermsWrapper>

              <SubmitButton formik={formik} type="submit" disabled={!checked}>
                Submit
              </SubmitButton>
            </form>
          </Group>
        </Main>
      ) : (
        <EmptyMessage>Sorry, looks like your practitioner does not have an active account</EmptyMessage>
      )}
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
  height: calc(100vh - ${headerHeight});
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(4, 0)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down("sm")} {
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
  ${({ theme }) => theme.breakpoints.down("sm")} {
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

const HiddenField = styled(StyledTextField)`
  display: none;
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

const TermsDownload = styled.a`
  color: ${colors.purple[700]};
  font-weight: 500;
  &:hover {
    color: ${colors.purple[600]};
  }
`;

const TermsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;
