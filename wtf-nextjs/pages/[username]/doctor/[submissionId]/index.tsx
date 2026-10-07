import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from '@mui/material';
import { fontSize } from 'styles/utils';
import Header from 'components/Header';
import { headerHeight, HeaderVariant } from 'components/Header/constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  useQuery,
  useUser,
  loginRequiredServerSideProps,
} from 'baseapp-nextjs-core';
import PageLoader from 'components/loaders/PageLoader';
import BackToPage from 'components/BackToPage';
import FaceMapIcon from 'components/buttons/FaceMapIcon';
import { unique } from 'common/utils';
import { IFeature } from 'common/types';

interface IFeaturesResponse {
  data: {
    results: IFeature[];
  };
}

interface ISubmissionsFeatures {
  feature: IFeature;
}

type ISubmissionsFeaturesResponse = {
  data: ISubmissionsFeatures[];
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: '/',
  });
  return { ...props, props: { ...ctx.query } };
};

function Features({
  submissionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { edit } = router.query;
  const { user } = useUser({
    redirectTo: '/',
  });

  const [finishedFeatures, setFinishedFeatures] = useState<string[]>([]);

  const { data: features, isLoading: isLoadingGetFeatures } =
    useQuery<IFeaturesResponse>('/features');

  const { isLoading: isLoadingAnalysis, refetch } =
    useQuery<ISubmissionsFeaturesResponse>(
      `submissions/${submissionId}/completed_features`,
      {
        onSuccess: ({ data }) => {
          if (data.length) {
            const selectedFeatures = data?.map(({ feature }) => {
              return String(feature.id);
            });
            setFinishedFeatures([...unique(selectedFeatures)]);
          }
        },
      }
    );

  useEffect(() => {
    refetch();
  }, [router, refetch]);

  const isLoading = isLoadingAnalysis || isLoadingGetFeatures;

  const handleSubmit = () => {
    router.push(`/${user?.username}/doctor/${submissionId}/preview`);
  }

  return (
    <Container>
      <Header variant={HeaderVariant.Default} />

      <Main>
        <Group>
          <BackToPage label={edit ? 'Go to Archived' : 'Get Started'} to={edit ? `/${user?.username}/doctor/archived` : `/${user?.username}/doctor`} />
          <Title variant="h5">Select Shape & Features</Title>
          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              <ButtonGroup
                color="success"
                value={finishedFeatures}
                orientation="vertical"
              >
                {Array.isArray(features?.data?.results) &&
                  features?.data?.results?.map(
                    ({ name, id, icon }: IFeature) => (
                      <FeatureButton
                        data-cy="feature-button"
                        value={String(id)}
                        key={name}
                        onClick={() =>
                          router.push({
                            pathname: '/[username]/doctor/[submissionId]/features/[featureId]',
                            query: {
                              submissionId,
                              featureId: id,
                              username: user?.username
                            },
                          })
                        }
                      >
                        {id === 2 && icon ? (
                          <Image src={icon?.fullSize} alt={name} />
                        ) : (
                          name
                        )}
                      </FeatureButton>
                    )
                  )}
              </ButtonGroup>
              <SubmitButton onClick={handleSubmit} type="submit">Submit</SubmitButton>
            </>
          )}
        </Group>
      </Main>
      <FaceMapIcon />
    </Container>
  );
}

export default Features;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background-color: ${colors.gray[100]};
`;

const Main = styled.main`
  background-color: ${colors.gray[100]};
  height: calc(100vh - ${headerHeight});
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(4, 2)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(0)};
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1030px;
  overflow-y: auto;
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
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  align-self: flex-start;
`;

const SubmitButton = styled(Button)`
  background-color: ${colors.purple[600]};
  min-width: 356px;
  flex: 1;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(4)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: 100%;
  }
`;

const FeatureButton = styled(ToggleButton)`
  height: 56px;
  width: 100%;
  font-size: ${fontSize(18)};
  text-transform: capitalize;
  border: 1px solid;
`;

const ButtonGroup = styled(ToggleButtonGroup)`
  flex-wrap: wrap;
  display: grid;
  width: 100%;
  flex-direction: row;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  grid-gap: ${({ theme }) => theme.spacing(1.5)};
`;

const Image = styled.img`
  height: 46px;
`;
