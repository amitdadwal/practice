import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { ReactElement } from 'react';

function BackToPage({
  label,
  to,
}: {
  label: string;
  to?: string;
}): ReactElement {
  const router = useRouter();
  const goTo = () => (to ? router.push(to) : router.back());
  return (
    <Wrapper onClick={goTo}>
      <ArrowBackIcon />
      <Text variant="body1">{label}</Text>
    </Wrapper>
  );
}

export default BackToPage;

const Text = styled(Typography)`
  text-transform: capitalize;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const Wrapper = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(0, 1, 1, 0)};
  color: ${colors.gray[700]};

  &:hover {
    cursor: pointer;
    color: ${colors.gray[500]};
  }
`;
