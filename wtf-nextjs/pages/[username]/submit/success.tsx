import type { NextPage } from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { Button, Hidden, Typography } from '@mui/material';
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import { headerHeight, HeaderVariant } from 'components/Header/constants';
import Header from 'components/Header';
import { use100vh } from 'react-div-100vh';
import { HTMLAttributes } from 'react';
import { useUser } from 'baseapp-nextjs-core';
import { useRouter } from 'next/router';

const Success: NextPage = () => {
  const height = use100vh();
  const router = useRouter();

  const { user } = useUser();
  return (
    <Container>
       <Hidden smDown>
        <Header variant={user ? HeaderVariant.Default : HeaderVariant.Simple} />
      </Hidden>
      <Hidden mdUp>{user && <Header variant={HeaderVariant.Default} />}</Hidden>

      <Main>
        <Group height={height as number}>
          <TextGroup>
            <Title variant="h1">Thank you!</Title>
            <SubTitle variant="h4">Your request has been submitted.</SubTitle>
          </TextGroup>
          <Link href={`/${router?.query?.username}/submit/`} passHref>
            <DoneButton>Done</DoneButton>
          </Link>
        </Group>
      </Main>
    </Container>
  );
};

export default Success;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.purple[600]};
`;

const Main = styled.main`
  background-color: ${colors.purple[600]};
  min-height: calc(100vh - ${headerHeight}px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type GroupProps = HTMLAttributes<HTMLDivElement> & { height: number };

const Group = styled.div<GroupProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 614px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(5, 2, 2, 2)};
    height: ${({ height }) => height}px;
    width: 100%;
  }
`;

const Title = styled(Typography)`
  font-weight: bold;
  font-size: ${fontSize(60)};
  line-height: 81px;
  letter-spacing: 0.25px;
  color: ${colors.green.A400};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(36)};
    line-height: 41px;
    color: ${colors.gray[100]};
  } ;
`;

const SubTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 600;
  font-size: ${fontSize(30)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(20)};
    line-height: 31px;
  } ;
`;

const DoneButton = styled(Button)`
  background-color: ${colors.gray[100]};
  width: 100%;
  max-width: 358px;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(5)};
  &:hover {
    background-color: ${colors.gray[200]};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0;
    max-width: calc(100vw - ${({ theme }) => theme.spacing(4)});
    bottom: ${({ theme }) => theme.spacing(2)};
    height: 46px;
    flex: 0;
  } ;
`;

const TextGroup = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  } ;
`;
