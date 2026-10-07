import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import { fontSize } from 'styles/utils';
import { IUser } from 'baseapp-nextjs-core';

export default function DisplayName({user, center}: {user?: IUser | null, center?: boolean }) {
  return (
    <Wrapper style={{alignItems: center ? "center": "flex-start"}}>
      <DoctorName variant='subtitle1'>{user?.displayName}</DoctorName>
      <Partnership variant='caption'>In partnership with WTF? Why the Face</Partnership>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const DoctorName = styled(Typography)`
  color: ${colors.green.A600};
  font-weight: 700;
  letter-spacing: 0.25px;
  line-height: ${fontSize(24)};
  text-transform: capitalize;
`

const Partnership = styled(Typography)`
  color: ${colors.gray[400]};
  font-weight: 500;
  line-height: ${fontSize(16)};
  letter-spacing: 0.25px;
`