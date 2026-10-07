import type { NextPage } from 'next';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import { fontSize } from 'styles/utils';
import { use100vh } from 'react-div-100vh';
import { HTMLAttributes } from 'react';

const Success: NextPage = () => {
  const height = use100vh();
  return (
    <Container>
      <Main>
        <Group height={height as number}>
          <TextGroup>
            <SubTitle variant="h4">Thank You. Your submission was successful!</SubTitle>
            <Text>
              Your participation in this study will help millions of people worldwide.
            </Text>
            <Text>
              Your personal report will be emailed to you once it&apos;s available. Please allow 2-3 weeks.
            </Text>
            <Text>
              If you know of other people who can help in this study, please share <Link href={"https://www.tbiptsdstudy.com"} passHref><Url href="https://www.tbiptsdstudy.com">tbiptsdstudy.com</Url></Link> on social media, via email, text or just tell them.
            </Text>
            <Text>
              Let&apos;s help the world!
            </Text>
          </TextGroup>

          <Link href="/study" passHref>
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
  height: 100vh;
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

const SubTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 600;
  font-size: ${fontSize(30)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(20)};
    line-height: 31px;
  } ;
`;

const Text = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 500;
  font-size: ${fontSize(18)};
  margin: ${({ theme }) => theme.spacing(2, 0)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${fontSize(16)};
    line-height: 31px;
    margin: ${({ theme }) => theme.spacing(1, 0)};
  } ;
`;

const Url = styled.a`
  color: ${colors.blue[500]};
  font-weight: 600;
  &:hover {
    color: ${colors.blue[600]};
    cursor: pointer;
  }
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
