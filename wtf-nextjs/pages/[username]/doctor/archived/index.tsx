import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import colors from 'styles/colors';
import { fontSize } from 'styles/utils';
import { InputAdornment, Pagination, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import {
  useQuery,
  useUser,
  loginRequiredServerSideProps,
  axios,
} from 'baseapp-nextjs-core';
import parsePhoneNumber from 'libphonenumber-js';
import { format } from 'date-fns';
import Header from 'components/Header';
import { headerHeight, HeaderVariant } from 'components/Header/constants';
import { ChangeEvent, HTMLAttributes, useEffect, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import PageLoader from 'components/loaders/PageLoader';
import FaceMapIcon from 'components/buttons/FaceMapIcon';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';
import { PAGE_SIZE } from '..';
import { cleanEmail } from 'common/utils';
import useDebounce from 'hooks/useDebounce';
import SearchIcon from '@mui/icons-material/Search';

interface Response {
  data: {
    count: number;
    results: Submission[];
  };
}
interface Submission {
  completedAt: string | number | Date;
  id: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  modified: string;
  frontViewPhoto: ImageFile;
}

interface ImageFile {
  miniSquare: string;
}

const ArchivedSubmissionsList: NextPage = () => {
  const [exportPDF, setExportPDF] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { user } = useUser({
    redirectTo: '/',
  });

  const { data, isLoading, refetch } = useQuery<Response>(
    `/submissions?is_archived=true&page=${page}&page_size=${PAGE_SIZE}&order_by=name&q=${debouncedSearchQuery}`
  );
  const height = use100vh();
  const router = useRouter();

  useEffect(() => {
    if (page === undefined || !page) {
      setPage(1)
    }
    refetch();
  }, [router, refetch, page, debouncedSearchQuery]);

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setPage(Number(event.target.value))
    }, 500)
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  };

  const onClickSubmission = (id: number) => router.push({
      pathname:
      `/${user?.username}/doctor/${id}`,
      query: {
        edit: true,
      },
    });

  const onClickDownload = async (name: string, id: number) => {
    setExportPDF(true)
    const response = await axios({
      method: 'GET',
      url: `/submissions/${id}/export_pdf`,
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(response.data)
    const dateStr = moment().format('YYYY-MM-DD')
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}-${dateStr}`
    a.click()
    window.URL.revokeObjectURL(url);
    a.remove()
    setExportPDF(false)
  }

  return (
    <Container>
      <Header variant={HeaderVariant.Default} />
      <Main>
        <Group height={height as number}>
          <Title variant="h5">Archived Submissions</Title>
          <Divider />

          <SearchInput
            variant="outlined"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {isLoading || exportPDF ? (
            <Center>
              <PageLoader />
            </Center>
          ) : (
            <List>
              {data?.data?.results?.length ? (
                data?.data?.results?.map((submission) => (
                  <Card
                    key={submission.id}
                    onClick={() => onClickSubmission(submission.id)}
                    data-cy="submission_card"
                  >
                    <CardImage>
                      <Image
                        alt=""
                        src={
                          submission.frontViewPhoto?.miniSquare ||
                          '/images/FrontAlpha.png'
                        }
                      />
                    </CardImage>
                    <CardContent>
                      <CardName>{submission?.name || submission?.email}</CardName>
                      <CardPhone>
                        {submission.phoneNumber
                          ? parsePhoneNumber(
                              submission.phoneNumber
                            )?.formatNational()
                          : '-'}
                      </CardPhone>
                      <CardDate>
                        <CardDateBold>Completion Date: </CardDateBold>
                        {format(new Date(submission?.completedAt), 'MM/dd/yyyy')}
                      </CardDate>
                    </CardContent>
                    <CardIcon onClick={
                      (event) => {
                        event.stopPropagation()
                        onClickDownload(cleanEmail(submission.name || submission.email), submission.id)
                      }
                    }>
                      <DownloadIcon />
                    </CardIcon>
                  </Card>
                ))
              ) : (
                <EmptyMessage>No archived submissions to show!</EmptyMessage>
              )}
            </List>)}
          <Center>
            {!!data?.data?.results?.length && <Pagination
                page={page}
                count={Math.ceil(Number(data?.data?.count) / PAGE_SIZE)}
                sx={{ mt: 1 }}
                onChange={(event, value) => {
                setPage(value)
                refetch()
                }}
            />}
            {
              isLoading ? "" : !!data?.data?.results?.length ? (
              <Inputdiv>
                  <Input type="text" placeholder="Page no." onChange={handlePageChange} />
              </Inputdiv>
              ) : ""
            }
          </Center>
        </Group>
      </Main>
      <FaceMapIcon />
    </Container>
  );
};

export default ArchivedSubmissionsList;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: '/',
  });
  return { ...props, props: {} };
};

const Inputdiv = styled.div`
  position: relative;
  top: 4px;
`

const Input = styled.input`
  padding: 10px;
  margin: 5px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  width: 50%;
`;

const SearchInput = styled(TextField)`
  width: 100%;
  margin-bottom: 20px; 
  box-sizing: border-box;
  & .MuiInputBase-root {
    height: 40px; 
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${colors.gray[100]};
  height: 100%;
  overflow: hidden;
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
  background-color: ${colors.green[50]};
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

const CardIcon = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  padding: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  justify-content: center;
  align-items: center;
  color: ${colors.gray[600]};
  font-size: ${fontSize(12)};
  &:hover {
  cursor: pointer;
    opacity: 0.8;
  }
`;

const EmptyMessage = styled(Typography)`
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
  flex-wrap: wrap;
`;
