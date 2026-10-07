/* 
  This file is the main source of colors, but it's also an alternative to MUI 
  colors (https://mui.com/customization/color/)
  When setting up the colors for the current project theme, you may also use 
  some of the colors from MUI colors.
  
  >> import { red } from '@mui/material/colors',

  More information: (https://mui.com/customization/palette/)
*/

/* 
  Surface: Used in neutral backgrounds, typography and components. It is the 
  base color that makes elements be perceived as with no color. 
*/
export const surface = {
  50: '#F5F9FC',
}

export const background = {
  50: '#FDFEFF',
}

export const gray = {
  100: '#FBFBFB',
  200: '#E5E5E5',
  300: '#C6C6C6',
  400: '#9C9C9C',
  500: '#777777',
  600: '#5E5E5E',
  700: '#434343',
  800: '#242424',
  900: '#161616',
};

/*
  Primary: Used to represent primary interface elements for a user. It's the 
  color displayed most frequently across your app's screens and components.
*/

export const purple = {
  50: '#BFC2E1',
  600: '#575B7B',
  700: '#515582',
  800: '#42466F',
  900: '#33375A',
};

/*
  Secondary: Used to represent secondary interface elements for a user. It 
  provides more ways to accent and distinguish your product. Having it is 
  optional.
*/

// export const secondary = {
//   50: '#f3e5f5',
//   100: '#e1bee7',
//   200: '#ce93d8',
//   300: '#ba68c8',
//   400: '#ab47bc',
//   500: '#9c27b0',
//   600: '#8e24aa',
//   700: '#7b1fa2',
//   800: '#6a1b9a',
//   900: '#4a148c',
//   A100: '#ea80fc',
//   A200: '#e040fb',
//   A400: '#d500f9',
//   A700: '#aa00ff',
// };

/*
  Error: Used to represent interface elements that the user should be made 
  aware of.
*/

export const red = {
  100: '#F44336',
  200: '#E33A35',
  300: '#D33233',
  400: '#C22A31',
  500: '#D2222F',
  600: '#A11B2C',
  700: '#911529',
  800: '#810E25',
  900: '#710821',
};

/*
  Success: Used to indicate the successful completion of an action that user 
  triggered.
*/

export const green = {
  50: '#F5FFF9',
  600: '#BAFFD7',
  700: '#58F69A',
  800: '#29E075',
  900: '#00C853',
  A400: '#87B8AD',
  A600: '#67A295',
};

/*
  Warning: Used to represent potentially dangerous actions or important 
  messages.
*/

export const orange = {
  500: '#F5D7B3',
  600: '#FCCB92',
  700: '#F4BC79',
  800: '#F3B061',
  900: '#ECA24B',
};

/*
  Info: Used to present information to the user that is neutral and not 
  necessarily important.
*/

export const blue = {
  500: '#8ABBE2',
  600: '#6CA3D4',
  700: '#4F8CC6',
  800: '#3075B7',
  900: '#015EA8',
};


export default {
  gray,
  purple,
  red,
  green,
  orange,
  blue,
  surface,
  background
};
