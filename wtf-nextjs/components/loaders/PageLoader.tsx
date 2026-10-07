import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import styled from '@emotion/styled';

export default function PageLoader({ label, component = <CircularProgress /> }: { label?: string, component?: JSX.Element }) {
  return (
    <Wrapper>
      {component}
      {label && <Label>{label}</Label>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  margin-top: theme.spacing(6);
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

const Label = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;