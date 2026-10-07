import React from 'react';
import { Button, CircularProgress as MuiCircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import type { IButtonWithLoadingProps } from 'baseapp-nextjs-core';
import type { ButtonProps } from '@mui/material';
import type { Overwrite } from '@mui/types';
import colors from '../../styles/colors';

type IMuiButtonWithLoadingProps = Overwrite<IButtonWithLoadingProps, ButtonProps>;

const CircularProgress = styled(MuiCircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
  color: ${colors.gray[100]};
`;

function ButtonWithLoading({
  formik,
  isLoading = false,
  children,
  ...props
}: IMuiButtonWithLoadingProps) {
  const _isLoading = formik ? formik.isSubmitting : isLoading;
  return (
    <Button disabled={_isLoading} {...props}>
      {children}
      {_isLoading && <CircularProgress size="20px" />}
    </Button>
  );
}

export default ButtonWithLoading;
