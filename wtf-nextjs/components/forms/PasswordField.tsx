import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { ITextField } from './TextField';
import styled from '@emotion/styled';
import TextField from './TextField';
import colors from '../../styles/colors';

import { ClassNameMap } from '@mui/styles';

interface WithClasses {
  classes: ClassNameMap<"inputField" | "notchedOutline" | "inputLabelField">
}

export type IPasswordField = ITextField & WithClasses

function PasswordField({ name = 'Password', classes, formik, ...props }: IPasswordField) {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <StyledTextField
      label="Password"
      placeholder="Password"
      type={viewPassword ? 'text' : 'password'}
      name={name}
      formik={formik}
      InputLabelProps={{
        classes: {
          root: classes?.inputLabelField,
          focused: classes?.inputLabelField,
        },
      }}
      InputProps={{
        classes: {
          root: classes?.inputField,
          notchedOutline: classes?.notchedOutline,
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setViewPassword((state) => !state)}
              edge="end"
            >
              {viewPassword ? (
                <VisibilityOff
                  htmlColor={colors.gray[100]}
                  sx={{ marginRight: '4px' }}
                />
              ) : (
                <Visibility
                  htmlColor={colors.gray[100]}
                  sx={{ marginRight: '4px' }}
                />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export default PasswordField;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(3)};
  color: ${colors.gray[100]};
` as typeof TextField;