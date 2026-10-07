import type { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import colors from 'styles/colors';
import { fontSize } from 'styles/utils';
import { Pagination, Typography } from '@mui/material';
import styled from '@emotion/styled';
import {
  useQuery,
  useUser,
  loginRequiredServerSideProps,
} from 'baseapp-nextjs-core';
import parsePhoneNumber from 'libphonenumber-js';
import { format } from 'date-fns';
import Header from 'components/Header';
import { headerHeight, HeaderVariant } from 'components/Header/constants';
import { HTMLAttributes, useEffect, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import PageLoader from 'components/loaders/PageLoader';
import FaceMapIcon from 'components/buttons/FaceMapIcon';

interface Response {
  data: {
    count: number;
    results: Submission[];
  };
}
interface Submission {
  id: number;
  name?: string;
  phoneNumber?: string;
  email?: string;
  created: string | number | Date;
  frontViewPhoto: ImageFile;
}

interface ImageFile {
  miniSquare: string;
}

export const PAGE_SIZE = 10;

const DoctorSubmissionsList: NextPage = () => {
  const [page, setPage] = useState(1);

  const { user } = useUser({
    redirectTo: '/',
  });

  const showPaymentMethodActionBanner = user?.showPaymentMethodActionBanner;

  const { data, isLoading, refetch } = useQuery<Response>(
    `/submissions?is_incomplete=true&page=${page}&page_size=${PAGE_SIZE}`
  );
  const height = use100vh();
  const router = useRouter();

  useEffect(() => {
    if (user && !user?.subscriptionPlan) {
      router.push(`/${user?.username}/subscription`)
    }
  }, [user])

  useEffect(() => {
    refetch();
  }, [router, refetch, page]);

  const onClickSubmission = (id: number) =>
    router.push(`/${user?.username}/doctor/${id}`);

  return (
    <Container>
      <Header variant={HeaderVariant.Default} />
      <Main>
        <Group height={height as number}>
          <Title variant='h5'>New Submissions</Title>
          <Divider />
          {showPaymentMethodActionBanner ? (
            <EmptyMessage>
              We couldn&apos;t process your payment.<br></br>
              <Link href={`/${user?.username}/subscription`} passHref>
                <span style={{ color: colors.green.A600, cursor: 'pointer' }}>
                  Please update your payment method.
                </span>
              </Link>
            </EmptyMessage>
          ) : isLoading ? (
            <Center>
              <PageLoader />
            </Center>
          ) : (
            <List>
              {data?.data?.results?.length ? (
                data?.data?.results?.map((submission) => (
                  <Card
                    key={submission?.id}
                    onClick={() => onClickSubmission(submission?.id)}
                    data-cy='submission_card'
                  >
                    <CardImage>
                      <Image
                        alt=''
                        src={
                          submission?.frontViewPhoto?.miniSquare ||
                          '/images/FrontAlpha.png'
                        }
                      />
                    </CardImage>
                    <CardContent>
                      <CardName>
                        {submission?.name || submission?.email}
                      </CardName>
                      <CardPhone>
                        {submission?.phoneNumber
                          ? parsePhoneNumber(
                              submission?.phoneNumber
                            )?.formatNational()
                          : '-'}
                      </CardPhone>
                      <CardDate>
                        <CardDateBold>Submission Date: </CardDateBold>
                        {format(new Date(submission?.created), 'MM/dd/yyyy')}
                      </CardDate>
                    </CardContent>
                    <CardIcon>
                      <Icon alt='' src='/images/SubmissionStartProfiling.svg' />
                    </CardIcon>
                  </Card>
                ))
              ) : (
                <EmptyMessage>All done, lean back and smile!</EmptyMessage>
              )}
            </List>
          )}
          <Center>
            {!!data?.data?.results?.length && (
              <Pagination
                page={page}
                count={Math.ceil(Number(data?.data?.count) / PAGE_SIZE)}
                sx={{ mt: 1 }}
                onChange={(event, value) => {
                  setPage(value);
                  refetch();
                }}
              />
            )}
          </Center>{' '}
        </Group>
      </Main>
      <FaceMapIcon />
    </Container>
  );
};

export default DoctorSubmissionsList;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: '/',
  });
  return { ...props, props: {} };
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: ${colors.gray[100]};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const Main = styled.main`
  background-color: ${colors.gray[100]};
  height: calc(100vh - ${headerHeight});
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(2, 0)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down('md')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

type GroupProps = HTMLAttributes<HTMLDivElement> & { height: number };

const Group = styled.div<GroupProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 748px;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-height: ${({ height }) => height}px;
    justify-content: flex-start;
  }
`;

const Title = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32.4px;
  text-align: center;
  letter-spacing: 0.25px;
`;

const Divider = styled.hr`
  border: 1px solid ${colors.gray[300]};
  width: 100%;
  margin: ${({ theme }) => theme.spacing(2, 0, 3)};
`;

const List = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  ${({ theme }) => theme.breakpoints.down('md')} {
    gap: ${({ theme }) => theme.spacing(2)};
  }
`;

const Card = styled.div`
  display: flex;
  background-color: ${colors.surface[50]};
  border-radius: ${({ theme }) => theme.spacing(1)};
  outline: 1px solid ${colors.purple[50]};
  box-shadow: 0px 0px 2px rgba(0, 163, 255, 0.25),
    0px 0.5px 2px rgba(96, 97, 112, 0.08), 0px 0px 1px rgba(40, 41, 61, 0.2);
  /* max-width: 358px; */
  height: 90px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
    outline: 1px solid ${colors.gray[300]};
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
const CardImage = styled.div`
  width: 90px;
  height: 90px;
`;

const Image = styled.img`
  object-fit: cover;
  width: 90px;
  height: 90px;
  border-bottom-left-radius: ${({ theme }) => theme.spacing(1)};
  border-top-left-radius: ${({ theme }) => theme.spacing(1)};
`;

const CardContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  margin-left: ${({ theme }) => theme.spacing(1)};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CardName = styled(Typography)`
  color: ${colors.gray[600]};
  font-size: ${fontSize(16)};
  font-weight: bold;
  line-height: 22px;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardPhone = styled(Typography)`
  color: ${colors.blue[900]};
  font-size: ${fontSize(16)};
  font-weight: 500;
  line-height: 21.6px;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

const CardDateBold = styled(Typography)`
  color: ${colors.gray[500]};
  font-size: ${fontSize(14)};
  font-weight: 500;
  line-height: 18.9px;
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(13)};
  }
`;

const CardDate = styled.div`
  display: inline-flex;
  color: ${colors.gray[500]};
  font-size: ${fontSize(14)};
  font-weight: normal;
  line-height: 18.9px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(13)};
  }
`;

const CardIcon = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.img`
  width: ${({ theme }) => theme.spacing(1.5)};
  height: ${({ theme }) => theme.spacing(2.5)};
`;

export const EmptyMessage = styled(Typography)`
  color: ${colors.gray[500]};
  font-size: ${fontSize(36)};
  margin-top: ${({ theme }) => theme.spacing(3)};
  text-align: center;
  align-self: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(24)};
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
