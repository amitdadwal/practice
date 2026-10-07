import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import {
  gray,
  purple,
  green,
  red,
  orange,
  blue,
  background,
  surface,
} from './colors';
import { fontSize } from './utils';

/*
  To customize the palette, you can set the main, light, dark, and contrastText.
  You can also not set them to use the MUI default palette. Or you can also not 
  set light for instance, and it will use the main color as reference to calc 
  light.

  More info: https://mui.com/pt/customization/palette/
 */

const palette = {
  primary: {
    main: purple[600],
    light: purple[50],
    dark: purple[900],
    contrastText: gray[100],
  },
  success: {
    main: green[800],
    light: green[600],
    dark: green[900],
    contrastText: gray[100],
  },
  divider: gray[300],
  info: {
    main: blue[700],
    light: blue[500],
    dark: blue[900],
    contrastText: gray[100],
  },
  warning: {
    main: orange[700],
    light: orange[500],
    dark: orange[900],
    contrastText: gray[100],
  },
  error: {
    main: red[500],
    light: red[100],
    dark: red[700],
    contrastText: gray[100],
  },
  text: {
    primary: gray[900],
    secondary: gray[600],
    disabled: gray[400],
  },
  background: {
    default: background[50],
    paper: surface[50],
  },
};

/* 
    For typography you can set any of the following variants: h1, h2, h3, h4,
    h5, h6, subtitle1, subtitle2, body1, body2, button, caption, overline,

    More info: https://mui.com/pt/customization/typography/
*/

const typography = {
  fontFamily: 'GeneralSans-Variable, GeneralSans-Regular',
  lg: {
    fontSize: fontSize(72),
  },
  h1: {
    fontSize: fontSize(60),
  },
  h2: {
    fontSize: fontSize(48),
  },
  h3: {
    fontSize: fontSize(36),
  },
  h4: {
    fontSize: fontSize(30),
  },
  subtitle1: {
    fontSize: fontSize(18),
  },
  body1: {
    fontSize: fontSize(16),
  },
  body2: {
    fontSize: fontSize(14),
  },
};

const theme: Theme = createTheme({
  palette,
  typography,
  spacing: 8,
  components: {
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          margin: 0,
        },
        grouped: {
          border: `1px solid ${gray[300]}`,
          margin: 0,
          borderRadius: '8px',
          '&:last-child, &:first-of-type, &:not(:last-of-type),&:not(:first-of-type) ':
          {
            border: `1px solid ${gray[300]}`,
            borderRadius: '8px',
          },
          '&.Mui-selected, &.Mui-selected+.MuiToggleButtonGroup-grouped.Mui-selected':
          {
            margin: 0,
            background: green[50],
            border: `1px solid ${green[900]}`,
            color: gray[600],
            '&:last-child, &:first-of-type, &:not(:last-of-type), &:not(:first-of-type), &:first-of-type':
            {
              margin: 0,
              background: green[50],
              border: `1px solid ${green[900]}`,
            },
          },
        },
      },
    },
  },
});

export default theme;
