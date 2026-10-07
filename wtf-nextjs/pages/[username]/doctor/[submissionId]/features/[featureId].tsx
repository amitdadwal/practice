import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import styled from "@emotion/styled";
import colors from "styles/colors";
import {
  ToggleButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider,
  Box,
} from "@mui/material";
import { fontSize } from "styles/utils";
import Header from "components/Header";
import { HeaderVariant, headerHeight } from "components/Header/constants";
import { use100vh } from "react-div-100vh";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  axios,
  useUser,
  useMutation,
  useQuery,
  loginRequiredServerSideProps,
} from "baseapp-nextjs-core";
import { AxiosError } from "axios";
import { useFormik, FormikProps, FormikValues } from "formik";
import PageLoader from "components/loaders/PageLoader";
import BackToPage from "components/BackToPage";
import { makeStyles, createStyles } from "@mui/styles";
import { AnalysisFields } from "common/constants";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import { SnackbarEnum } from "common/enums";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import type {
  IAnalysis,
  ICharacteristic,
  IFeature,
  IShapes,
} from "common/types";
import TextField from "components/forms/TextField";
import FaceMapIcon from "components/buttons/FaceMapIcon";

interface ISubmissionResponse {
  data: {
    email: string;
    frontViewPhoto: {
      fullSize: string;
      square: string;
    };
    id: number;
    isCompleted: boolean;
    leftViewPhoto: { fullSize: string; square: string };
    name: "Masud";
    rightViewPhoto: { fullSize: string; square: string };
  };
}

export interface IAnalysisResponse {
  data: { results: IAnalysis[] };
}

interface ICharacteristicResponse {
  data: {
    results: ICharacteristic[];
  };
}

interface IShapesResponse {
  data: {
    results: IShapes[];
  };
}

type AnalysisFormValues = (FormikProps<IAnalysis> & IAnalysis[]) | undefined;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const props = await loginRequiredServerSideProps(ctx, {
    redirectTo: "/",
  });
  return { ...props, props: { ...ctx.query } };
};

function Features({
  featureId,
  submissionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const height = use100vh();
  const classes = useStyles();
  const router = useRouter();
  const [isMultipleShapes, setIsMultipleShapes] = useState(false);
  const allowedKeyPress = ["Backspace", "Delete", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

  const { user } = useUser({
    redirectTo: "/",
  });

  const [analysis, setAnalysis] = useState<IAnalysis[]>([]);

  const { isLoading: isLoadingAnalysis, refetch } = useQuery<IAnalysisResponse>(
    `/analysis?expand=characteristic&submission__id=${submissionId}&characteristic__feature__id=${featureId}`,
    {
      onSuccess: ({ data }) => {
        const { results } = data;
        setAnalysis(results);
      },
    }
  );

  const { isLoading: isLoadingShapes, data: shapes } =
    useQuery<IShapesResponse>(`/shapes`);

  useEffect(() => {
    refetch();
  }, [router, refetch]);

  const { enqueueSnackbar } = useSnackbar();

  const { data: submission, isLoading: isLoadingSubmission } =
    useQuery<ISubmissionResponse>(`/submissions/${submissionId}`);

  const { data: characteristics, isLoading: isLoadingCharacteristics } =
    useQuery<ICharacteristicResponse>(
      `/characteristics?expand=feature&feature__id=${featureId}`
    );

  const featureName =
    characteristics?.data?.results[0]?.feature?.name === "PTSD"
      ? "Post-traumatic Stress Disorder (PTSD)"
      : characteristics?.data?.results[0]?.feature?.name === "TBI"
        ? "Traumatic Brain Injury (TBI)"
        : characteristics?.data?.results[0]?.feature?.name;

  const isFaceShapes = !!(characteristics?.data?.results[0]?.id === 130);
  const isLeftRightSides = featureId === "2";
  const isPTSDorTBI =
    characteristics?.data?.results[0]?.feature?.name === "PTSD" ||
    characteristics?.data?.results[0]?.feature?.name === "TBI";

  const isLoading =
    isLoadingCharacteristics ||
    isLoadingSubmission ||
    isLoadingAnalysis ||
    isLoadingShapes;

  const filterAllFalses = (
    analysisValues: IAnalysis[] | AnalysisFormValues | FormikValues
  ): IAnalysis[] | AnalysisFormValues => {
    return analysisValues?.filter?.((analysis: IAnalysis) => {
      return (
        analysis.isSelected ||
        analysis.isExcessive ||
        analysis.isGreaterOnLeft ||
        analysis.isGreaterOnRight ||
        analysis.isSlight ||
        !!analysis.comment ||
        !!analysis.id
      );
    });
  };

  const handleChange = (
    event: React.SyntheticEvent,
    expanded: boolean,
    id: number,
    index: number
  ) => formik.setFieldValue(`${index}.isSelected`, expanded);

  const getInitialValues = () =>
    characteristics?.data?.results.map(({ id }: ICharacteristic) => {
      const currAnalysis = analysis?.find?.(
        ({ characteristic }) => characteristic.id === id
      );
      return {
        id: currAnalysis?.id || null,
        submission: submissionId,
        characteristic: id,
        comment: currAnalysis?.comment || "",
        isSlight: !!currAnalysis?.isSlight,
        isExcessive: !!currAnalysis?.isExcessive,
        isGreaterOnRight: !!currAnalysis?.isGreaterOnRight,
        isGreaterOnLeft: !!currAnalysis?.isGreaterOnLeft,
        isSelected: !!currAnalysis?.isSelected,
        faceShapePrimary: currAnalysis?.faceShapePrimary || null,
        faceShapeSecondary: currAnalysis?.faceShapeSecondary || null,
        faceShapeTertiary: currAnalysis?.faceShapeTertiary || null,
        leftEyeNotes: currAnalysis?.leftEyeNotes || null,
        rightEyeNotes: currAnalysis?.rightEyeNotes || null,
        age: currAnalysis?.age || null,
      };
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues() as FormikValues,
    onSubmit: (values: FormikValues) => {
      console.log(values)
      values.find((analysis: { age: number | string | null }) => {
        if (analysis?.age === "") {
          analysis.age = null;
        }
      });
      if (isLeftRightSides) {
        values.find(
          (analysis: {
            characteristic: ICharacteristic;
            leftEyeNotes: string | null;
            rightEyeNotes: string | null;
            isSelected: boolean;
          }) => {
            if (analysis?.leftEyeNotes && analysis?.rightEyeNotes) {
              analysis.isSelected = true;
            } else {
              analysis.isSelected = false;
            }
          }
        );
      }
      return mutate(filterAllFalses(values));
    },
  }) as any; //eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (isFaceShapes && formik?.values?.length) {
      if (
        !!formik.values[0]["faceShapeSecondary"] ||
        !!formik.values[0]["faceShapeTertiary"]
      ) {
        setIsMultipleShapes(true);
      }
    }
  }, [formik.values, isFaceShapes]);

  const createAnalysis = (data: IAnalysis[] | AnalysisFormValues) => {
    return axios.post("/analysis/batch_create_update", data);
  };

  const { mutate } = useMutation(createAnalysis, {
    onError: (error: AxiosError) => {
      formik.setErrors(error?.response?.data);
      const errorVariant = { variant: SnackbarEnum.Error };
      let message;
      switch (error?.response?.status) {
        case 500:
          message = "Internal server error. Please try again later.";
          break;
        default:
          message = "Something went wrong. Please try again.";
          break;
      }
      enqueueSnackbar(message, errorVariant);
    },
    onSuccess: () => {
      const successVariant = { variant: SnackbarEnum.Success };
      const message = "Successfully Submitted";
      enqueueSnackbar(message, successVariant);
      router.push(`/${user?.username}/doctor/${submissionId}`);
    },
    onSettled: () => formik.setSubmitting(false),
  });

  const notRelevant = () => {
    return axios.post(`analysis/not_relevant`, {
      feature_id: featureId,
      submission_id: submissionId,
    });
  };

  const { mutate: mutateNotRelevant } = useMutation(notRelevant, {
    onError: (error: AxiosError) => {
      formik.setErrors(error?.response?.data);
      const errorVariant = { variant: SnackbarEnum.Error };
      let message;
      switch (error?.response?.status) {
        case 500:
          message = "Internal server error. Please try again later.";
          break;
        default:
          message = "Something went wrong. Please try again.";
          break;
      }
      enqueueSnackbar(message, errorVariant);
    },
    onSuccess: () => {
      const successVariant = { variant: SnackbarEnum.Success };
      const message = "Successfully Submitted";
      enqueueSnackbar(message, successVariant);
      router.push(`/${user?.username}/doctor/${submissionId}`);
    },
    onSettled: () => formik.setSubmitting(false),
  });

  const handleNotRelevant = () => {
    mutateNotRelevant();
  };

  const renderCheckboxes = (index: number) => {
    return AnalysisFields.map(({ label, key }) => (
      <FormControlLabel
        key={label}
        label={label}
        control={
          <Checkbox
            name={`${index}.${key}`}
            size="small"
            checked={formik?.values[index] && !!formik?.values[index][key]}
            onChange={formik.handleChange}
          />
        }
      />
    ));
  };

  const handleMultipleShapes = () => {
    if (isMultipleShapes) {
      formik.setFieldValue(`0.faceShapeSecondary`, null);
      formik.setFieldValue(`0.faceShapeTertiary`, null);
    }
    setIsMultipleShapes(!isMultipleShapes);
  };

  const handleShapeChange = (
    event: React.MouseEvent<HTMLElement>,
    id: number,
    faceShape: string
  ) => {
    if (formik.values[0][faceShape] === id) {
      formik.setFieldValue(`0.${faceShape}`, null);
      if (faceShape === "faceShapePrimary") {
        formik.setFieldValue(`0.faceShapeSecondary`, null);
        formik.setFieldValue(`0.faceShapeTertiary`, null);
        formik.setFieldValue("0.isSelected", false);
      }
      if (faceShape === "faceShapeSecondary") {
        formik.setFieldValue(`0.faceShapeTertiary`, null);
      }
    } else {
      formik.setFieldValue(`0.${faceShape}`, id);
      formik.setFieldValue("0.isSelected", true);
    }
  };



  const renderShapesButtons = () => {
    if (isFaceShapes) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Title variant="h5">
            {isMultipleShapes ? "Primary" : "Select Feature"}
          </Title>

          <ButtonGroup>
            {shapes?.data?.results.map(({ name, id, icon }) => {
              return (
                <FeatureButton
                  key={name + id + "primary"}
                  value={id}
                  name={String(name)}
                  className={
                    formik?.values && formik?.values[0]?.faceShapePrimary === id
                      ? classes?.selected
                      : ""
                  }
                  onChange={(event: React.MouseEvent<HTMLElement>) =>
                    handleShapeChange(event, id, "faceShapePrimary")
                  }
                >
                  {name}
                  <Icon src={icon?.fullSize} alt={name} />
                </FeatureButton>
              );
            })}
          </ButtonGroup>
          {isMultipleShapes && formik?.values[0]?.faceShapePrimary && (
            <>
              <Title variant="h5">Secondary</Title>

              <ButtonGroup>
                {shapes?.data?.results.map(({ name, id, icon }) => {
                  return (
                    <FeatureButton
                      key={name + id + "secondary"}
                      value={id}
                      name={String(name)}
                      className={
                        formik?.values &&
                          formik?.values[0]?.faceShapeSecondary === id
                          ? classes?.selected
                          : ""
                      }
                      onChange={(event: React.MouseEvent<HTMLElement>) =>
                        handleShapeChange(event, id, "faceShapeSecondary")
                      }
                    >
                      {name}
                      <Icon src={icon?.fullSize} alt={name} />
                    </FeatureButton>
                  );
                })}
              </ButtonGroup>
              {formik?.values[0]?.faceShapeSecondary && (
                <>
                  <Title variant="h5">Tertiary</Title>

                  <ButtonGroup>
                    {shapes?.data?.results.map(({ name, id, icon }) => {
                      return (
                        <FeatureButton
                          key={name + id + "tertiary"}
                          value={id}
                          name={String(name)}
                          className={
                            formik?.values &&
                              formik?.values[0]?.faceShapeTertiary === id
                              ? classes?.selected
                              : ""
                          }
                          onChange={(e) =>
                            handleShapeChange(e, id, "faceShapeTertiary")
                          }
                        >
                          {name}
                          <Icon src={icon?.fullSize} alt={name} />
                        </FeatureButton>
                      );
                    })}
                  </ButtonGroup>
                </>
              )}
            </>
          )}
        </div>
      );
    }
  };

  return (
    <Container height={height} >
      <Header variant={HeaderVariant.Default} />

      <Main >
        <Group >
          <Section
            style={{
              position: 'fixed',
              top: "65px",
              maxWidth: "inherit",
              backgroundColor: "#FBFBFB",
              zIndex: 999
            }}
          >
            {/* <BackToPage label={"Select Shape & Feature"} /> */}
            <ImageGrid>
              <a
                href={
                  submission?.data?.frontViewPhoto?.fullSize ||
                  "/images/FrontPlaceholder.png"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    submission?.data?.frontViewPhoto?.square ||
                    "/images/FrontPlaceholder.png"
                  }
                  alt="Front View Photo"
                />
              </a>
              <a
                href={
                  submission?.data?.leftViewPhoto?.fullSize ||
                  "/images/LeftPlaceholder.png"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    submission?.data?.leftViewPhoto?.square ||
                    "/images/LeftPlaceholder.png"
                  }
                  alt="Left View Photo"
                />
              </a>
              <a
                href={
                  submission?.data?.rightViewPhoto?.fullSize ||
                  "/images/RightPlaceholder.png"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={
                    submission?.data?.rightViewPhoto?.square ||
                    "/images/RightPlaceholder.png"
                  }
                  alt="Right View Photo"
                />
              </a>
            </ImageGrid>
          </Section>
          {isLoading ? (
            <PageLoader />
          ) : (
            <HeaderSection>
              <Title variant="h5">{featureName}</Title>
              <>
                <Form
                  color="success"
                  className={classes.buttonGroup}
                  onSubmit={formik.handleSubmit}
                  id="analysis"
                >
                  {isFaceShapes && (
                    <FaceShapesSection>
                      <MultipleShapesButton
                        value={isMultipleShapes}
                        style={{
                          backgroundColor: isMultipleShapes
                            ? colors.red[200]
                            : colors.blue[800],
                        }}
                        onClick={handleMultipleShapes}
                      >
                        {isMultipleShapes ? (
                          <>
                            <CloseIcon />
                            Combination Mode
                          </>
                        ) : (
                          "Combination"
                        )}
                      </MultipleShapesButton>
                      {renderShapesButtons()}
                      <Title variant="h5">Other</Title>
                      <StyledFaceShapesField
                        label=""
                        name={`0.comment`}
                        type="textarea"
                        multiline
                        value={
                          formik?.values ? formik?.values[0]["comment"] : ""
                        }
                        rows={3}
                        placeholder="Start writing your comment..."
                        formik={formik}
                        helperText=""
                      />
                    </FaceShapesSection>
                  )}
                  {isLeftRightSides && (
                    <LeftRightSidesSection>
                      <ImageWrapper>
                        <a
                          href="/images/Caraça.svg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image src="/images/Caraça.svg" alt="face-image" />
                        </a>
                      </ImageWrapper>
                      <CommentsWrapper>
                        <LeftRightSideText variant="body1">
                          The two sides of the face have significance. The right
                          side is how we present ourselves energetically and is
                          what we project to the public; it also represents our
                          mother’s influence. The left side represents our
                          truer, inner private self and our father’s influence.
                          When looking at an individual, there is so much energy
                          being projected from the right side that we truly
                          don’t “see” the left inner private self.
                        </LeftRightSideText>
                        <LeftRightSideNotesText variant="h6">
                          Right Side
                        </LeftRightSideNotesText>
                        <StyledTextField
                          label=""
                          name={`0.rightEyeNotes`}
                          type="textarea"
                          multiline
                          value={
                            formik?.values
                              ? formik?.values[0]["rightEyeNotes"]
                              : ""
                          }
                          rows={3}
                          placeholder="Start writing your comment..."
                          formik={formik}
                          helperText=""
                        />
                        <LeftRightSideNotesText variant="h6">
                          Left Side
                        </LeftRightSideNotesText>
                        <StyledTextField
                          label=""
                          name={`0.leftEyeNotes`}
                          type="textarea"
                          multiline
                          value={
                            formik?.values
                              ? formik?.values[0]["leftEyeNotes"]
                              : ""
                          }
                          rows={3}
                          placeholder="Start writing your comment..."
                          formik={formik}
                          helperText=""
                        />
                      </CommentsWrapper>
                    </LeftRightSidesSection>
                  )}
                  {!isFaceShapes &&
                    !isLeftRightSides &&
                    characteristics?.data?.results?.map(
                      ({ name, id }: IFeature, index: number) => {
                        return (
                          <Accordion
                            key={name + id}
                            sx={{ border: 0 }}
                            className={classes.accordion}
                            onChange={(event, expanded) =>
                              handleChange(event, expanded, id, index)
                            }
                            expanded={
                              (formik?.values &&
                                formik?.values[index]["isSelected"]) ||
                              false
                            }
                            disableGutters
                          >
                            <AccordionSummary
                              sx={{ p: 0 }}
                              className={classes.summary}
                            >
                              <FeatureButton
                                value={id}
                                name={name}
                                className={
                                  formik?.values &&
                                    formik?.values[index]["isSelected"]
                                    ? classes?.selected
                                    : ""
                                }
                              >
                                {name}
                              </FeatureButton>
                            </AccordionSummary>
                            {id === 13 ? (
                              <>
                                <NotchedHelixImageWrapper
                                  href={"/images/NotchedHelix.png"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <NotchedHelixImage
                                    src={"/images/NotchedHelix.png"}
                                  />
                                </NotchedHelixImageWrapper>
                                <StyledTextField
                                  label=""
                                  name={`${index}.age`}
                                  // type="number"
                                  min={0}
                                  max={1000}
                                  value={
                                    formik?.values &&
                                      formik?.values[index]["age"] !== ""
                                      ? formik?.values[index]["age"]
                                      : null
                                  }
                                  placeholder="Enter age"
                                  formik={formik}
                                  helperText=""
                                  inputProps={{
                                    // pattern: "^(?!0*(?:,0*)?$)(?:[1-9][0-9]{0,2}(?:,[0-9]{3})*|0)$", // Regex pattern for numbers with comma separators between 0 and 999
                                    title: "Please enter numbers with comma separators only between 0 and 999",
                                  }}
                                  onKeyDown={(event) => {
                                    const regex = new RegExp("[0-9,]");
                                    if (
                                      !regex.test(event.key) &&
                                      !allowedKeyPress.includes(event.key)
                                    ) {
                                      event.preventDefault();
                                    }
                                  }}
                                />
                                <Text variant="body2">Custom Comment</Text>
                                <StyledTextField
                                  label=""
                                  name={`${index}.comment`}
                                  type="textarea"
                                  multiline
                                  value={
                                    formik?.values
                                      ? formik?.values[index]["comment"]
                                      : ""
                                  }
                                  rows={3}
                                  placeholder="Start writing your comment..."
                                  formik={formik}
                                  helperText=""
                                />
                              </>
                            ) : (
                              <>
                                {!isPTSDorTBI && (
                                  <Properties>
                                    {formik?.values && renderCheckboxes(index)}
                                  </Properties>
                                )}
                                <Divider />
                                <Text variant="body2">Custom Comment</Text>
                                <StyledTextField
                                  label=""
                                  name={`${index}.comment`}
                                  type="textarea"
                                  multiline
                                  value={
                                    formik?.values
                                      ? formik?.values[index]["comment"]
                                      : ""
                                  }
                                  rows={3}
                                  placeholder="Start writing your comment..."
                                  formik={formik}
                                  helperText=""
                                />
                              </>
                            )}
                          </Accordion>
                        );
                      }
                    )}
                </Form>
              </>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                {!isFaceShapes && !isLeftRightSides && (
                  <SubmitButton
                    formik={formik}
                    type="button"
                    form="analysis"
                    onClick={handleNotRelevant}
                  >
                    Not Relevant
                  </SubmitButton>
                )}
                <SubmitButton formik={formik} type="submit" form="analysis">
                  Finish {characteristics?.data?.results[0]?.feature?.name}
                </SubmitButton>
              </Box>
            </HeaderSection>
          )}
        </Group>
      </Main>
      <FaceMapIcon />
    </Container>
  );
}

export default Features;

const useStyles = makeStyles(() =>
  createStyles({
    buttonGroup: {},
    accordion: {
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
      border: 0,
      "&.MuiAccordion-root": {
        boxShadow: "none",
      },
      "&.css-1y16736-MuiToggleButtonGroup-root-ButtonGroup": {
        border: "none",
      },
      "&:before": {
        height: 0,
      },
    },
    summary: {
      "& > .MuiAccordionSummary-content": {
        margin: 0,
      },
    },
    selected: {
      background: colors.green[50],
      border: `1px solid ${colors.green[900]}`,
      color: colors.gray[600],
    },
  })
);
interface ContainerProps {
  height: number | null;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background-color: ${colors.gray[100]};
`;

const Main = styled.main`
  background-color: ${colors.gray[100]};
  height: calc(100vh - ${headerHeight});
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(4, 2)};
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(0)};
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1030px;
  overflow-y: auto;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

const Section = styled.section`
  display: flex;
  width: inherit;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const HeaderSection = styled.section`
  display: flex;
  width: inherit;
  margin-top: 392px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  text-align: center;
  letter-spacing: 0.25px;
  margin: ${({ theme }) => theme.spacing(2, 0)};
  align-self: flex-start;
`;

const SubmitButton = styled(ButtonWithLoading)`
  background-color: ${colors.purple[600]};
  min-width: 356px;
  flex: 1;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(4)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    min-width: 100%;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    grid-gap: ${({ theme }) => theme.spacing(2)};
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.spacing(1)};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const NotchedHelixImageWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: ${({ theme }) => theme.spacing(1, 0)};
`;

const NotchedHelixImage = styled.img`
  width: 100%;
  max-width: 243px;
  aspect-ratio: 1;
  margin: auto;
  align-self: center;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
    filter: grayscale(100%);
  }
`;

const FeatureButton = styled(ToggleButton)`
  min-height: 60px;
  width: 100%;
  font-size: ${fontSize(18)};
  text-transform: capitalize;
  border: 1px solid;
`;

const Form = styled.form`
  flex-wrap: wrap;
  display: grid;
  width: 100%;
  flex-direction: row;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  grid-gap: ${({ theme }) => theme.spacing(1.5)};
`;

const Properties = styled(AccordionDetails)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-flow: column wrap;
  height: fit-content;
  max-height: 110px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledFaceShapesField = styled(TextField)`
  width: 100%;
  margin-top: 0;
`;

const Text = styled(Typography)`
  color: ${colors.gray[600]};
  font-size: ${fontSize(14)};
  margin: ${({ theme }) => theme.spacing(1.5, 0, 0, 1.5)};
`;

const ButtonGroup = styled.div`
  flex-wrap: wrap;
  display: grid;
  width: 100%;
  flex-direction: row;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  grid-gap: ${({ theme }) => theme.spacing(1.5)};
`;

const Icon = styled.img`
  max-width: 30px;
  max-height: 30px;
  margin-left: ${({ theme }) => theme.spacing(3)};
`;

const MultipleShapesButton = styled(ToggleButton)`
  height: 46px;
  max-width: 280px;
  text-transform: capitalize;
  color: ${colors.gray[100]};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing(0, 4)};
  font-size: ${fontSize(16)};
  border-radius: ${({ theme }) => theme.spacing(1)};
`;

const FaceShapesSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

const LeftRightSidesSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 260px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(0, 2)};
`;

const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;

const LeftRightSideText = styled(Typography)`
  color: ${colors.gray[700]};
  font-size: ${fontSize(16)};
`;

const LeftRightSideNotesText = styled(Typography)`
  color: ${colors.gray[700]};
  font-size: ${fontSize(20)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  font-weight: 500;
`;
