import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { Typography, Skeleton } from '@mui/material';
import { fontSize } from 'styles/utils';
import Header from 'components/Header';
import { HeaderVariant, headerHeight } from 'components/Header/constants';
import { use100vh } from 'react-div-100vh';
import { useRouter } from 'next/router';

import {
  useUser,
  useQuery,
  loginRequiredServerSideProps,
} from 'baseapp-nextjs-core';
import BackToPage from 'components/BackToPage';
import ButtonWithLoading from 'components/buttons/ButtonWithLoading';
import React, { useEffect } from 'react';
import Link from 'next/link';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { format } from 'date-fns';
import DisplayName from 'components/Header/DisplayName';

interface IReport {
  report: {
    id: number;
    subComment?: string;
    subDescription?: string;
    subTitle?: string;
    title?: string;
    titleDescription?: string;
    subDescriptionPrimary?: string;
    subDescriptionSecondary?: string;
    subDescriptionTertiary?: string;
    subShapeDescriptionPrimary?: string;
    subShapeDescriptionSecondary?: string;
    subShapeDescriptionTertiary?: string;
    subShapeIconPrimary?: string;
    subShapeIconSecondary?: string;
    subShapeIconTertiary?: string;
    comment?: string;
    subTitlePrimary?: string;
    subTitleSecondary?: string;
    subTitleTertiary?: string;
    leftTitle?: string;
    leftTitleDescription?: string;
    rightTitle?: string;
    rightTitleDescription?: string;
    feature: number; // TODO-MG if you add the feature ID just uncoment this line, if you add just the number change it to "feature: number;" instead
  };
}
interface IReportResponse {
  data: {
    analysis: [IReport[]];
    defaults: {
      email: string;
      phoneNumber: string;
      frontViewPhoto: {
        fullSize: string,
        square: string
      };
      id: number;
      isCompleted: boolean;
      leftViewPhoto: { fullSize: string, square: string };
      name: string;
      rightViewPhoto: { fullSize: string, square: string };
      summary: string;
      created: '2022-02-09T20:47:16.794772Z';
      sub1: string;
      sub2: string;
      sub3: string;
      title: string;
    };
  };
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: '/',
  });
  return { ...props, props: { ...ctx.query } };
};

function Preview({
  submissionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const height = use100vh();
  const router = useRouter();
  const today = new Date();

  const { user } = useUser({
    redirectTo: '/',
  });

  const {
    data: report,
    isLoading,
    refetch,
  } = useQuery<IReportResponse>(
    `/submissions/${submissionId}/generate_preview_report`
  );

  useEffect(() => {
    refetch();
  }, [router, refetch]);

  const handleContinue = () => {
    router.push(`/${user?.username}/doctor/${submissionId}/summary`);
  };

  const defaults = report?.data?.defaults;
  const renderDefaults = () => {
    if (defaults) {
      return (
        <div>
          <Title variant="h5">{defaults.title}</Title>
          <ul>
            <li>
              {defaults.sub1 && (
                <Body variant="body1" sx={{ fontWeight: 500 }}>{defaults.sub1}</Body>
              )}
              <ul>
                <li>
                  {defaults.sub2 && (
                    <Body variant="body1">{defaults.sub2}</Body>
                  )}
                  <ul>
                    <li>
                      {defaults.sub3 && (
                        <Body variant="body1">{defaults.sub3}</Body>
                      )}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  };

  const faceShapes = report?.data?.analysis?.map(k => k.filter(({ report }) => report.title === 'Face Shapes:')).filter((a) => a.length > 0);
  const renderFaceShapes = () => {
    if (faceShapes && faceShapes?.length > 0) {
      const report = faceShapes[0][0].report;
      return (
        <>
          <Link
            passHref
            href={{
              pathname: '/[username]/doctor/[submissionId]/features/[featureId]',
              query: {
                submissionId,
                featureId: report?.feature,
                username: user?.username
              },
            }}
          >
            <FeatureTitleWrapper style={{ margin: 0 }}>
              <div style={{ height: '40px', marginRight: '16px' }}>
                <Icon src="/images/wtflogo.png" style={{ height: '40px' }} alt='wtflogo' />
              </div>
              <FeatureTitle>
                {
                  report.title
                }
              </FeatureTitle>
              <EditOutlinedIcon
                style={{ color: colors.gray[500] }}
                fontSize={'small'}
              />
            </FeatureTitleWrapper>
          </Link>
          <div>
            {report.subTitlePrimary && <ImgIcon src={report.subShapeIconPrimary} />}
            {report.subTitleSecondary && <ImgIcon src={report.subShapeIconSecondary} />}
            {report.subTitleTertiary && <ImgIcon src={report.subShapeIconTertiary} />}
          </div>
          <ul>
            {report.subTitlePrimary && (
              <>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    {report.subTitlePrimary}
                  </Body>
                  <ul>
                    {report.subDescriptionPrimary && (
                      <li>
                        <Body variant="body1">
                          {report.subDescriptionPrimary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    Characteristic:
                  </Body>
                  <ul>
                    {report.subShapeDescriptionPrimary && (
                      <li>
                        <Body variant="body1">
                          {report.subShapeDescriptionPrimary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
              </>
            )}
            {report.subTitleSecondary && (
              <>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    {report.subTitleSecondary}
                  </Body>
                  <ul>
                    {report.subDescriptionSecondary && (
                      <li>
                        <Body variant="body1">
                          {report.subDescriptionSecondary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    Characteristic:
                  </Body>
                  <ul>
                    {report.subShapeDescriptionSecondary && (
                      <li>
                        <Body variant="body1">
                          {report.subShapeDescriptionSecondary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
              </>
            )}
            {report.subTitleTertiary && (
              <>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    {report.subTitleTertiary}
                  </Body>
                  <ul>
                    {report.subDescriptionTertiary && (
                      <li>
                        <Body variant="body1">
                          {report.subDescriptionTertiary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
                <li>
                  <Body variant="body1" sx={{ fontWeight: 500 }}>
                    Characteristic:
                  </Body>
                  <ul>
                    {report.subShapeDescriptionTertiary && (
                      <li>
                        <Body variant="body1">
                          {report.subShapeDescriptionTertiary}
                        </Body>
                      </li>
                    )}
                  </ul>
                </li>
              </>
            )}
            {report.comment && (
              <li>
                <Body variant="body1" sx={{ fontWeight: 500 }}>
                  Other:
                </Body>
                <ul>
                  <li>
                    <Body variant="body1">
                      {report.comment}
                    </Body>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </>
      );

    }
  };
  const leftRightSides = report?.data?.analysis?.map(k => k.filter(({ report }) => report.title === 'Left & Right Sides:')).filter((a) => a.length > 0);
  const renderLeftRightSides = () => {
    if (leftRightSides && leftRightSides?.length > 0) {
      const report = leftRightSides[0][0].report;


      return (
        <>
          <Link
            passHref
            href={{
              pathname: '/[username]/doctor/[submissionId]/features/[featureId]',
              query: {
                submissionId,
                featureId: report.feature,
                username: user?.username
              },
            }}
          >
            <FeatureTitleWrapper>
              <FeatureTitle>{report.title}</FeatureTitle>
              <EditOutlinedIcon
                style={{ color: colors.gray[500] }}
                fontSize={'small'}
              />
            </FeatureTitleWrapper>
          </Link>
          <Description variant="body1">{report.titleDescription}</Description>
          <ul>
            <li>
              <Body variant="body1" sx={{ fontWeight: 500 }}>
                {report.leftTitle}
              </Body>
              <ul>
                {report.leftTitleDescription && (
                  <li>
                    <Body variant="body1">
                      {report.leftTitleDescription}
                    </Body>
                  </li>
                )}
              </ul>
            </li>
            <li>
              <Body variant="body1" sx={{ fontWeight: 500 }}>
                {report.rightTitle}
              </Body>
              <ul>
                {report.rightTitleDescription && (
                  <li>
                    <Body variant="body1">
                      {report.rightTitleDescription}
                    </Body>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </>
      );
    }
  };


  const renderRegularFeature = () => {
    const features = report?.data?.analysis?.map(k => k.filter(({ report }) => {
      if (faceShapes && faceShapes.length > 0 && leftRightSides && leftRightSides.length > 0) {
        return (
          report.id !== faceShapes[0][0].report?.id &&
          report.id !== leftRightSides[0][0].report?.id
        );
      }
      else if (faceShapes && faceShapes.length > 0) {
        return (
          report.id !== faceShapes[0][0].report?.id
        );
      }
      else if (leftRightSides && leftRightSides.length > 0) {
        return (
          report.id !== leftRightSides[0][0].report?.id
        );
      }
      return true
    })).filter((a) => a.length > 0);

    if (features?.length) {
      return features.map((feature) => {
        return (
          <React.Fragment key={feature[0]?.report.id}>
            <Link
              passHref
              href={{
                pathname: '/[username]/doctor/[submissionId]/features/[featureId]',
                query: {
                  submissionId,
                  featureId: feature[0]?.report.feature,
                  username: user?.username
                },
              }}
            >
              <FeatureTitleWrapper>
                <FeatureTitle >{
                  feature[0]?.report.title === "PTSD:"
                    ? "Post-traumatic Stress Disorder:" :
                    feature[0]?.report.title === "TBI:"
                      ? "Traumatic Brain Injury:" :
                      feature[0]?.report.title
                }</FeatureTitle>
                <EditOutlinedIcon
                  style={{ color: colors.gray[500] }}
                  fontSize={'small'}
                />
              </FeatureTitleWrapper>
            </Link>
            {
              feature[0]?.report?.titleDescription &&
              <Description style={{ whiteSpace: 'pre-line' }} variant="body1">{feature[0]?.report?.titleDescription}</Description>
            }
            {feature.map(({ report }) => {
              return (
                <ul key={report.id}>
                  <li>
                    <Body variant="body1" sx={{ fontWeight: 500 }}>
                      {report.subTitle}
                    </Body>
                    <ul>
                      {report.subDescription && (
                        <li>
                          <Body variant="body1">
                            {report.subDescription}
                          </Body>
                        </li>
                      )}
                      {report.subComment && (
                        <li>
                          <Body variant="body1">
                            {report.subComment}
                          </Body>
                        </li>
                      )}
                    </ul>
                    {report.subTitle === 'Notched helix' && <NotchedHelixImage>
                      <Image src={'/images/NotchedHelix.png'} alt="notched_helix" />
                    </NotchedHelixImage>}
                  </li>
                </ul>)
            })}
          </React.Fragment>
        );
      });
    }
  };

  return (
    <Container height={height}>
      <Header variant={HeaderVariant.Default} />

      <Main>
        <Group>
          <BackToPage label={'Select Shape & Features'} />
          <Section>
            <Title variant="h5">Preview Report</Title>
            <ReportContainer>
              {isLoading ? (
                <Skeleton height={40} variant="rectangular" animation="wave" />
              ) : (
                <ReportHeader>
                  {<DisplayName user={user} />}
                  {format(today, 'MM/dd/yyyy')}
                </ReportHeader>
              )}
              {isLoading ? (
                <Skeleton
                  sx={{ mt: 2 }}
                  height={32}
                  variant="rectangular"
                  animation="wave"
                />
              ) : (<>
                <ReportTitle>
                  <span>Facial Analysis:</span>
                  {report?.data?.defaults?.name && <span>{report?.data?.defaults?.name}</span>}
                </ReportTitle>
                <ReportSubTitle>
                  <span className="email" style={{ marginRight: report?.data?.defaults?.phoneNumber ? "22px" : 0 }}>
                    <Image src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTEgM0MxMSAyLjQ1IDEwLjU1IDIgMTAgMkgyQzEuNDUgMiAxIDIuNDUgMSAzVjlDMSA5LjU1IDEuNDUgMTAgMiAxMEgxMEMxMC41NSAxMCAxMSA5LjU1IDExIDlWM1pNMTAgM0w2IDUuNUwyIDNIMTBaTTEwIDlIMlY0TDYgNi41TDEwIDRWOVoiIGZpbGw9IiM5QzlDOUMiLz48L3N2Zz4=" alt="email_icon" />
                    {report?.data?.defaults?.email}
                  </span>
                  {report?.data?.defaults?.phoneNumber && (
                    <span className="phone">
                      <Image src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC43MyAyLjVDOC43IDIuOTQ1IDguNjI1IDMuMzggOC41MDUgMy43OTVMOS4xMDUgNC4zOTVDOS4zMSAzLjc5NSA5LjQ0IDMuMTYgOS40ODUgMi41SDguNzNaTTMuOCA4LjUxQzMuMzc1IDguNjMgMi45NCA4LjcwNSAyLjUgOC43MzVWOS40OEMzLjE2IDkuNDM1IDMuNzk1IDkuMzA1IDQuNCA5LjEwNUwzLjggOC41MVpNOC4yNSAxLjVIMTBDMTAuMjc1IDEuNSAxMC41IDEuNzI1IDEwLjUgMkMxMC41IDYuNjk1IDYuNjk1IDEwLjUgMiAxMC41QzEuNzI1IDEwLjUgMS41IDEwLjI3NSAxLjUgMTBWOC4yNTVDMS41IDcuOTggMS43MjUgNy43NTUgMiA3Ljc1NUMyLjYyIDcuNzU1IDMuMjI1IDcuNjU1IDMuNzg1IDcuNDdDMy44MzUgNy40NSAzLjg5IDcuNDQ1IDMuOTQgNy40NDVDNC4wNyA3LjQ0NSA0LjE5NSA3LjQ5NSA0LjI5NSA3LjU5TDUuMzk1IDguNjlDNi44MSA3Ljk2NSA3Ljk3IDYuODEgOC42OSA1LjM5NUw3LjU5IDQuMjk1QzcuNDUgNC4xNTUgNy40MSAzLjk2IDcuNDY1IDMuNzg1QzcuNjUgMy4yMjUgNy43NSAyLjYyNSA3Ljc1IDJDNy43NSAxLjcyNSA3Ljk3NSAxLjUgOC4yNSAxLjVaIiBmaWxsPSIjOUM5QzlDIi8+PC9zdmc+" alt="phone_icon" />
                      {report?.data?.defaults?.phoneNumber}
                    </span>)}
                </ReportSubTitle>
              </>)}
              <ImageGrid>
                {isLoading ? (
                  <Skeleton
                    sx={{ maxHeight: '300px' }}
                    height={'25vw'}
                    variant="rectangular"
                    animation="wave"
                  />
                ) : (
                  <a
                    href={
                      report?.data?.defaults?.frontViewPhoto?.fullSize ||
                      '/images/FrontPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        report?.data?.defaults?.frontViewPhoto?.square ||
                        '/images/FrontPlaceholder.png'
                      }
                      alt="Front View Photo"
                    />
                  </a>
                )}
                {isLoading ? (
                  <Skeleton
                    sx={{ maxHeight: '300px' }}
                    height={'25vw'}
                    variant="rectangular"
                    animation="wave"
                  />
                ) : (
                  <a
                    href={
                      report?.data?.defaults?.leftViewPhoto?.fullSize ||
                      '/images/LeftPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        report?.data?.defaults?.leftViewPhoto?.square ||
                        '/images/LeftPlaceholder.png'
                      }
                      alt="Left View Photo"
                    />
                  </a>
                )}
                {isLoading ? (
                  <Skeleton
                    sx={{ maxHeight: '300px' }}
                    height={'25vw'}
                    variant="rectangular"
                    animation="wave"
                  />
                ) : (
                  <a
                    href={
                      report?.data?.defaults?.rightViewPhoto?.fullSize ||
                      '/images/RightPlaceholder.png'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        report?.data?.defaults?.rightViewPhoto?.square ||
                        '/images/RightPlaceholder.png'
                      }
                      alt="Right View Photo"
                    />
                  </a>
                )}
              </ImageGrid>

              {isLoading ? (
                <Skeleton
                  sx={{ mt: 2 }}
                  height={32}
                  variant="rectangular"
                  width={'30vw'}
                  animation="wave"
                />
              ) : (
                renderDefaults()
              )}

              {isLoading ? (
                <Skeleton
                  height={40}
                  sx={{ mt: 2 }}
                  variant="rectangular"
                  animation="wave"
                />
              ) : (
                <>
                  {renderFaceShapes()}
                  {renderLeftRightSides()}
                  {renderRegularFeature()}
                </>
              )}
            </ReportContainer>
            <SubmitButton onClick={handleContinue}>Continue</SubmitButton>
          </Section>
        </Group>
        <StaticImageContainer height={height}>
          <StaticImageGrid>
            {isLoading ? (
              <Skeleton
                sx={{ maxHeight: '300px' }}
                height={'25vw'}
                variant="rectangular"
                animation="wave"
              />
            ) : (
              <a
                href={
                  report?.data?.defaults?.frontViewPhoto?.fullSize ||
                  '/images/FrontPlaceholder.png'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    report?.data?.defaults?.frontViewPhoto?.square ||
                    '/images/FrontPlaceholder.png'
                  }
                  alt="Front View Photo"
                />
              </a>
            )}
            {isLoading ? (
              <Skeleton
                sx={{ maxHeight: '300px' }}
                height={'25vw'}
                variant="rectangular"
                animation="wave"
              />
            ) : (
              <a
                href={
                  report?.data?.defaults?.leftViewPhoto?.fullSize ||
                  '/images/LeftPlaceholder.png'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    report?.data?.defaults?.leftViewPhoto?.square ||
                    '/images/LeftPlaceholder.png'
                  }
                  alt="Left View Photo"
                />
              </a>
            )}
            {isLoading ? (
              <Skeleton
                sx={{ maxHeight: '300px' }}
                height={'25vw'}
                variant="rectangular"
                animation="wave"
              />
            ) : (
              <a
                href={
                  report?.data?.defaults?.rightViewPhoto?.fullSize ||
                  '/images/RightPlaceholder.png'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    report?.data?.defaults?.rightViewPhoto?.square ||
                    '/images/RightPlaceholder.png'
                  }
                  alt="Right View Photo"
                />
              </a>
            )}
          </StaticImageGrid>
        </StaticImageContainer>
      </Main>
    </Container>
  );
}

export default Preview;

interface ContainerProps {
  height: number | null;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background-color: ${colors.gray[100]};
`;
const StaticImageContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 70px;
  // overflow: auto;
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
  color: #67A295;
  font-weight: bold;
  font-size: ${fontSize(20)};
  line-height: 32px;
  letter-spacing: 0.25px;
  margin: ${({ theme }) => theme.spacing(2, 0)};
  align-self: flex-start;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(18)};
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const Body = styled(Typography)`
  color: ${colors.gray[700]};
  font-size: ${fontSize(15)};
  letter-spacing: 0.25px;
`;

const Description = styled(Typography)`
  color: ${colors.gray[700]};
  font-size: ${fontSize(15)};
  letter-spacing: 0.25px;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.purple[600]};
  min-width: 356px;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(4)};
  justify-self: center;
  align-self: center;
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
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

const StaticImageGrid = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 176.5px;
  max-height: 176.5px;
  min-width: 100px;
  min-height: 100px;
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
  };
`;

const ReportContainer = styled.main`
  display: flex;
  border: 1px solid ${colors.gray[400]};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  flex-direction: column;
  overflow-y: auto;
  max-height: 620px;
  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray[300]};
    border-radius: 5px;
    &:hover {
      background-color: ${colors.gray[200]};
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(1.5)};
    max-height: 100%;
  }
  & ul {
    padding-inline-start: 25px;
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: ${colors.gray[600]};
  font-size: ${fontSize(14)};
`;

const Icon = styled.img`
  &:hover {
    cursor: pointer;
  }
`;

const ReportTitle = styled.div`
  background-color: ${colors.green.A400};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: ${colors.gray[100]};
  margin-top: ${({ theme }) => theme.spacing(2)};
  font-weight: bold;
  padding: 12px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  & span:first-child {
    font-weight: 500;
  }
`;

const ReportSubTitle = styled.div`
  background-color: #E6E6E6;
  padding: 12px 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: right;
  color: #434343;

  & img {
    margin-right: 5px;
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
`

const FeatureTitle = styled(Typography)`
  color: #67A295;
  font-size: ${fontSize(20)};
  font-weight: 600;
  margin-right: ${({ theme }) => theme.spacing(1)};
  &:hover {
    text-decoration: underline;
  }
`;

const FeatureTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const ImgIcon = styled.img`
  margin-top: 16px;
  margin-right: 10px;
  width: 50px;
  height: 50px;
`;

const NotchedHelixImage = styled.div`
  text-align: center;
  & img {
    width: 600px;
  }
`;
