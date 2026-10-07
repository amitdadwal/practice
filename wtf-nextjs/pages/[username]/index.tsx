import type { NextPage } from "next";
import styled from "@emotion/styled";
import colors from "styles/colors";
import { Button, Hidden, Typography, CircularProgress } from "@mui/material";
import { fontSize } from "styles/utils";
import { headerHeight, HeaderVariant } from "components/Header/constants";
import Header from "components/Header";
import { use100vh } from "react-div-100vh";
import { HTMLAttributes, useEffect, useState } from "react";
import { useQuery, useUser, IUser } from "baseapp-nextjs-core";
import { useRouter } from "next/router";
import PageLoader from "components/loaders/PageLoader";

const Home: NextPage = () => {
  const { user } = useUser();
  const { query, push } = useRouter();
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  useEffect(() => {
    if (user && !user?.subscriptionPlan) {
      push(`/${query?.username}/subscription`);
    }
  }, [user?.subscriptionPlan]);

  const { isLoading, refetch } = useQuery<{
    data: { count: number; results: IUser[] };
  }>(`/users?q=${query?.username}`, {
    onSuccess: ({ data }) => {
      if (data?.count === 1) {
        setIsUsernameValid(true);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [query?.username]);

  const height = use100vh() || 100;

  return (
    <Container>
      <Hidden smDown>
        <Header variant={user ? HeaderVariant.Default : HeaderVariant.Simple} />
      </Hidden>
      <Hidden smUp>{user && <Header variant={HeaderVariant.Default} />}</Hidden>

      <Main>
        {isLoading ? (
          <PageLoader
            component={<CircularProgress sx={{ color: "white" }} />}
          />
        ) : (
          <Group height={user ? height - headerHeight : height}>
            <div style={{ flex: 1 }}>
              <div>
                <Title variant="h1" sx={{ color: colors.green.A400 }}>
                  WTF?
                </Title>
                <Title variant="h1" sx={{ color: colors.gray[100] }}>
                  Why the Face:
                </Title>
                <SubTitle variant="h4">
                  Understanding Health & Personality Through Facial Analysis
                </SubTitle>
              </div>
              <ImageButtonGroup>
                <Image src="/images/wtflogo.png" alt="Why the Face" />
                <Hidden smDown>
                  <ButtonGroup>
                    <StartedButton
                      onClick={() =>
                        isUsernameValid
                          ? push(`/${query?.username}/submit`)
                          : null
                      }
                      disabled={!isUsernameValid}
                    >
                      {isUsernameValid
                        ? "Get Started"
                        : "Practitioner is not valid"}
                    </StartedButton>
                    <Text>
                      You will be submitting your photos to your practitioner
                      for analysis. WTF is not responsible for the analysis.
                    </Text>
                  </ButtonGroup>
                </Hidden>
              </ImageButtonGroup>
            </div>
            <Hidden smUp>
              <ButtonGroup>
                <StartedButton
                  onClick={() =>
                    isUsernameValid ? push(`/${query?.username}/submit`) : null
                  }
                  disabled={!isUsernameValid}
                >
                  {isUsernameValid
                    ? "Get Started"
                    : "Practitioner is not valid"}
                </StartedButton>
                <Text>
                  You will be submitting your photos to your practitioner for
                  analysis. WTF is not responsible for the analysis.
                </Text>
              </ButtonGroup>
            </Hidden>
          </Group>
        )}
      </Main>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.purple[600]};
`;

const Main = styled.main`
  background-color: ${colors.purple[600]};
  min-height: calc(100vh - ${headerHeight}px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type GroupProps = HTMLAttributes<HTMLDivElement> & { height: number | null };

const Group = styled.div<GroupProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 614px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(5, 2, 2, 2)};
    height: ${({ height }) => height}px;
    justify-content: space-evenly;
  }
`;

const Title = styled(Typography)`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: ${fontSize(60)};
  line-height: 81px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(30)};
    line-height: 41px;
  } ;
` as unknown as typeof Typography;

const SubTitle = styled(Typography)`
  color: ${colors.gray[100]};
  font-weight: 600;
  font-size: ${fontSize(30)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(24)};
    line-height: 31px;
  } ;
`;

const ImageButtonGroup = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-top: 0;
    flex: 1;
  } ;
`;

const StartedButton = styled(Button)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  &:hover {
    background-color: ${colors.gray[200]};
  }
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 0;
    max-width: calc(100vw - ${({ theme }) => theme.spacing(4)});
    bottom: ${({ theme }) => theme.spacing(2)};
    margin-bottom: 0;
    height: 46px;
    flex: 0;
  } ;
`;

const Text = styled(Typography)`
  color: ${colors.purple[50]};
  font-size: ${fontSize(14)};
  line-height: 130%;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 200px;
  max-height: 253px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(5, 10, 0)};
    max-width: 400px;
    max-height: 506px;
  } ;
`;

const ButtonGroup = styled.div`
  display: "flex";
  flex-direction: "column";
  padding-left: 50px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;
