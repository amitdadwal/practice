// Example of SSR page
import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';

import StyledEmotionButton from 'components/StyledEmotionExampleButton';

const SSRPage: FC = () => {
  return (
    <>
      <Typography variant="h4">Welcome to the server!</Typography>
      <Button type="button" variant="contained" color="primary">
        Server Rendered Button
      </Button>
      <StyledEmotionButton />
    </>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  return {
    props: ctx.query,
  };
};

export default SSRPage;
