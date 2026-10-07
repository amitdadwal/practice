import Link from 'next/link';
import { IUser, useQuery, useUser } from 'baseapp-nextjs-core';
import React, { ReactElement, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import LogoutIcon from '@mui/icons-material/Logout';

import { useStyles } from './styles';
import { HeaderVariant, HeaderProps, headerHeight } from './constants';
import {
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  Hidden,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
} from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { any } from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import DisplayName from './DisplayName';

export default function Header({
  variant = HeaderVariant.Default,
}: HeaderProps): ReactElement {
  const { query } = useRouter();

  const { data, isLoading: loadingPractitioner } = useQuery<{ data: { count: number, results: IUser[] } }>(
    `/users?q=${query?.username}`,
  );

  const practitioner = data?.data?.results[0]

  const { user, isLoading } = useUser();
  const router = useRouter();

  const classes = useStyles(any);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (router.pathname === "/signup" || router.pathname.includes("/subscription")) {
      return
    }
    if (user && user?.username !== practitioner?.username) {
      router.replace(`/${user?.username}/doctor`)
    }
  }, [user, practitioner, router])

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const headerEl = useRef(null);

  function logout() {
    router.push('/logout').then();
  }

  if (variant === HeaderVariant.Simple) {
    return (
      <StyledHeader>
        {practitioner && !loadingPractitioner ? <DisplayName user={practitioner} center /> : <Image
          src="/images/wtfheader.png"
          alt="Why the Face"
          width={78}
          height={39}
        />}
      </StyledHeader>
    );
  }

  return (
    <StyledHeader ref={headerEl}>
      <Toolbar
        className={clsx(classes?.toolbar, user && classes?.loggedToolbar)}
      >
        <div className={classes?.brandImageContainer}>
          <div className={classes?.headerGroup}>
            {isLoading ? (
              <Image
                src="/images/wtfheader.png"
                alt="Why the Face"
                width={78}
                height={39}
              />) :
              <DisplayName user={user} />}
          </div>
        </div>
        {user ? (
          <div className={classes?.headerGroup}>
            <Hidden smDown>
              {user?.subscriptionPlan && <Link href={`/${user?.username}/submit`} passHref>
                <Button className={classes?.linkButton} variant="text">
                  Create New
                </Button>
              </Link>}
              {user?.subscriptionPlan && <Link href={`/${user?.username}/doctor`} passHref>
                <Button className={classes?.linkButton} variant="text">
                  Submissions
                </Button>
              </Link>}
              {user?.subscriptionPlan && <Link href={`/${user?.username}/doctor/archived`} passHref>
                <Button className={classes?.linkButton} variant="text">
                  Archived
                </Button>
              </Link>}
              <Link href={`/${user?.username}/subscription`} passHref>
                <Button className={classes?.linkButton} variant="text">
                  Subscription
                </Button>
              </Link>
              <Link href="/logout" passHref>
                <Button className={classes?.linkButton} variant="text">
                  <StyledLogoutIcon />
                  Logout
                </Button>
              </Link>
            </Hidden>
            <Hidden smUp>
              <IconButton
                onClick={handleClick}
                className={classes.navbarProfile}
              >
                <MenuIcon />
              </IconButton>
              <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                className={classes?.navbarDropdown}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList>
                          {user?.subscriptionPlan && <Link href={`/${user?.username}/submit`} passHref>
                            <MenuItem onClick={handleClose}>
                              Create New
                            </MenuItem>
                          </Link>}
                          <Divider />
                          {user?.subscriptionPlan && <Link href={`/${user?.username}/doctor`} passHref>
                            <MenuItem onClick={handleClose}>
                              Submissions
                            </MenuItem>
                          </Link>}
                          <Divider />
                          {user?.subscriptionPlan && <Link href={`/${user?.username}/doctor/archived`} passHref>
                            <MenuItem onClick={handleClose}>
                              Archived
                            </MenuItem>
                          </Link>}
                          <Divider />
                          <Link href={`/${user?.username}/subscription`} passHref>
                            <MenuItem onClick={handleClose}>
                              Subscription
                            </MenuItem>
                          </Link>
                          <Divider />
                          <MenuItem
                            onClick={() => {
                              handleClose;
                              logout();
                            }}
                          >
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Hidden>
          </div>
        ) : (
          <Link href="/" passHref>
            <Button className={classes?.linkButton} variant="text">
              Login
            </Button>
          </Link>
        )}
      </Toolbar>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  background-color: ${colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${headerHeight}px;
  height: ${headerHeight}px;
  border-bottom: 1px solid ${colors.gray[200]};
`;

const Image = styled.img`
`;

const StyledLogoutIcon = styled(LogoutIcon)`
  margin-right: ${({ theme }) => theme.spacing(0.5)};
`;