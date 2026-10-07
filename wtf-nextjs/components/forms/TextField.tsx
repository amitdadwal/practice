import React from 'react'
import MuiTextField from '@mui/material/TextField'
import type { IInputProps } from 'baseapp-nextjs-core'
import type { TextFieldProps } from '@mui/material'

export type ITextField = TextFieldProps & IInputProps

function TextField({name, formik, helperText, ...props}: ITextField) {
  const showError = (formik?.errors?.[name] && formik?.touched?.[name]) as boolean
  return (
    <MuiTextField
      name={name}
      onChange={formik.handleChange}
      value={formik.values?.[name]}
      error={showError}
      helperText={showError ? formik.errors?.[name] : helperText}
      {...props}
    />
  )
}

export default TextField
