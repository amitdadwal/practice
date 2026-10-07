import colors from 'styles/colors';
import { fontSize } from 'styles/utils';
export const headerHeight = '65px';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';

export const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    margin: theme.spacing(0, 6),
    padding: 0,
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',

    width: '100%',
    [theme.breakpoints.down('sm')]: {
      gap: '24px',
      margin: theme.spacing(0, 3),
    },
  },
  loggedToolbar: {
    maxWidth: '1408px',
  },
  navbarTitle: {
    flex: 1,
  },
  navbarProfile: {
    height: '36px',
    padding: 0,
    color: colors.gray[700],
  },
  navbarDropdown: {
    zIndex: 100,
    minWidth: '12em',
  },
  brandImageContainer: {
    flex: 1,
  },
  brandImage: {
    height: '36px',
    width: 'auto',
    [theme.breakpoints.down('xs')]: {
      height: '24px',
    },
  },
  registerBtn: {
    marginLeft: '15px',
  },
  inputRoot: {
    color: 'inherit',
    borderRadius: '24px',
  },
  inputInput: {
    color: colors.gray[400],
    fontSize: fontSize(14),
    fontWeight: 400,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 180,
      '&:focus': {
        width: 260,
      },
    },
  },
  menuEmail: {
    marginTop: '0',
    marginBottom: '12px',
    minHeight: '0',
  },
  menuName: {
    marginBottom: '0',
    minHeight: '0',
  },
  linkButton: {
    color: colors.gray[600],
    textTransform: 'none',
    fontWeight: 500,
    fontSize: fontSize(16),
    fontHeight: fontSize(24),
  },
  headerGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      gap: '16px',
    },
  },
  avatarImage: {
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      height: '32px',
      width: '32px',
    },
  },
}));
