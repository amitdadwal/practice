import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { Typography, Hidden } from '@mui/material';
import { fontSize } from 'styles/utils';
import Header from 'components/Header';
import { HeaderVariant, headerHeight } from 'components/Header/constants';
import { use100vh } from 'react-div-100vh';
import { useRouter } from 'next/router';
import moment from 'moment'

import {
  axios,
  useUser,
  useMutation,
  useQuery,
  loginRequiredServerSideProps,
} from 'baseapp-nextjs-core';
import { AxiosError } from 'axios';
import { SnackbarEnum } from 'common/enums';
import { useFormik, FormikProps, FormikValues } from 'formik';
import PageLoader from 'components/loaders/PageLoader';
import BackToPage from 'components/BackToPage';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import { useSnackbar } from 'notistack';
import DownloadIcon from '@mui/icons-material/Download';
import FaceMapIcon from 'components/buttons/FaceMapIcon';
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic';
import { cleanEmail } from 'common/utils';


interface IFinishSubmissionRequest {
  summary: string;
}

interface ISubmissionResponse {
  data: {
    email: string;
    frontViewPhoto: {
      fullSize: string, square: string
    };
    id: number;
    isCompleted: boolean;
    leftViewPhoto: { fullSize: string, square: string };
    name?: string;
    rightViewPhoto: { fullSize: string, square: string };
    summary: string;
  };
}

type SubmissionFormValues = FormikProps<IFinishSubmissionRequest> &
  IFinishSubmissionRequest;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: '/',
  });
  return { ...props, props: { ...ctx.query } };
};

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

function Summary({
  submissionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const height = use100vh();
  const router = useRouter();
  const [exportingMeet, setExportingMeet] = useState(false)

  const modules = {
    toolbar: [
      [{size: []}],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline',
    'list', 'bullet'
  ];

  const { user } = useUser({
    redirectTo: '/',
  });

  const { enqueueSnackbar } = useSnackbar();

  const { data: submission, isLoading: isLoadingSubmission, refetch } =
    useQuery<ISubmissionResponse>(`/submissions/${submissionId}`);

  useEffect(() => {
    refetch();
  }, [router, refetch]);

  const getInitialValues = () => ({ summary: submission?.data?.summary || '' });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues() as FormikValues,
    onSubmit: (values: FormikValues) => mutate(values),
  }) as any; //eslint-disable-line @typescript-eslint/no-explicit-any

  const finishSubmission = (
    data: IFinishSubmissionRequest | SubmissionFormValues | FormikValues
  ) => {
    return axios.patch(`/submissions/${submissionId}/finish_submission`, {
      summary: data.summary,
    });
  };

  const { mutate } = useMutation(finishSubmission, {
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
    onSuccess: async ({ data }) => {
      const successVariant = { variant: SnackbarEnum.Success };
      const message = 'Successfully Submitted. Downloading the report...';
      enqueueSnackbar(message, successVariant)
      setExportingMeet(true)
      const response = await axios({
        method: 'GET',
        url: `/submissions/${submissionId}/export_pdf`,
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(response.data)
      const dateStr = moment().format('YYYY-MM-DD')
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanEmail(data.name || data.email)}-${dateStr}`
      a.click()
      window.URL.revokeObjectURL(url);
      a.remove()
      setExportingMeet(false)
      router.push(`/${user?.username}/doctor`);
    },
    onSettled: () => formik.setSubmitting(false),
  });

  return (
    <Container height={height}>
      <Header variant={HeaderVariant.Default} />

      <Main>
        <Group>
          <BackToPage label={'Preview Report'} />
          {isLoadingSubmission ? (
            <PageLoader />
          ) : (
            <Section>
              <Hidden smDown>
                <ImageGrid>
                  <a
                    href={
                      submission?.data?.frontViewPhoto?.fullSize ||
                      '/images/FrontPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        submission?.data?.frontViewPhoto?.square ||
                        '/images/FrontPlaceholder.png'
                      }
                      alt="Front View Photo"
                    />
                  </a>
                  <a
                    href={
                      submission?.data?.leftViewPhoto?.fullSize ||
                      '/images/LeftPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        submission?.data?.leftViewPhoto?.square ||
                        '/images/LeftPlaceholder.png'
                      }
                      alt="Left View Photo"
                    />
                  </a>
                  <a
                    href={
                      submission?.data?.rightViewPhoto?.fullSize ||
                      '/images/RightPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        submission?.data?.rightViewPhoto?.square ||
                        '/images/RightPlaceholder.png'
                      }
                      alt="Right View Photo"
                    />
                  </a>
                </ImageGrid>
              </Hidden>
              <Title variant="h5">Potential Health Concerns</Title>
              {!submission?.data?.name && (
                <Text>
                  Potential Health Concerns are not applicable for this submission.
                </Text>)}
              <>
                <Form
                  id="summary"
                  color="success"
                  onSubmit={formik.handleSubmit}
                  style={{ flex: 1 }}
                >
                  <QuillNoSSRWrapper
                    theme="snow"
                    style={!submission?.data?.name ? { opacity: 0.3, cursor: "not-allowed" } : {}}
                    value={formik.values.summary}
                    onChange={(content) => {
                      formik.setFieldValue('summary', content)
                    }}
                    readOnly={!submission?.data?.name}
                    modules={modules}
                    formats={formats}
                  />
                </Form>
              </>
              {exportingMeet ? (
                <Loader>
                  <PageLoader />
                </Loader>
              )
                : (
                  <SubmitButton formik={formik} type="submit" form="summary">
                    <DownloadIcon fontSize="small" style={{ marginRight: 4 }} />
                    Finish & Download PDF
                  </SubmitButton>)}
            </Section>
          )}
        </Group>
      </Main>
      <FaceMapIcon />
    </Container>
  );
}

export default Summary;

interface ContainerProps {
  height: number | null;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background-color: ${colors.gray[100]};
`;

const Main = styled.main`
  background-color: ${colors.gray[100]};
  height: calc(100vh - ${headerHeight}px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(4, 2)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1030px;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
    height: 100%;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  letter-spacing: 0.25px;
  margin: ${({ theme }) => theme.spacing(2, 0)};
  align-self: flex-start;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(18)};
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    
`;

const Text = styled(Typography)`
  color: ${colors.red[500]};
  font-size: ${fontSize(14)};
  line-height: 24px;
  letter-spacing: 0.25px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  align-self: flex-start;
`;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.purple[600]};
  min-width: 356px;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(8)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: ${({ theme }) => theme.spacing(10)};
    min-width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }  
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-gap: ${({ theme }) => theme.spacing(2)};
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.spacing(1)};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const Form = styled.form`
  flex-wrap: wrap;
  display: grid;
  width: 100%;
  flex-direction: row;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  grid-gap: ${({ theme }) => theme.spacing(1.5)};
`;

const Loader = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: ${({ theme }) => theme.spacing(10)};
  }
`;