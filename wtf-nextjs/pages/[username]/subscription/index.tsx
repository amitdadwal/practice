import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "react-query";
import { useUser } from "baseapp-nextjs-core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Main, SubTitle, useStyles } from "styles";
import colors from "styles/colors";
import { fontSize } from "styles/utils";
import styled from "@emotion/styled";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Checkbox, Hidden, TextField, InputAdornment, Icon, CircularProgress } from "@mui/material";
import Check from "@mui/icons-material/Check";
import X from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "components/Header";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import { HeaderVariant } from "components/Header/constants";
import PaymentMethodModal from "components/modals/PaymentMethodModal";
import CancelSubscriptionModal from "components/modals/CancelSubscriptionModal";
import PromotionalCodeModal from "components/modals/PromotionalCodeModal";
import AdModal from "components/modals/AdModal";
import PaymentsApi from "pages/api/payments";
import { useSnackbar } from "notistack";
import { SnackbarEnum } from "common/enums";
import { IPlan } from "common/types";
import useDebounce from "hooks/useDebounce";
import useValidateCode from "hooks/useValidateCode";

const Subscription: NextPage = () => {
  const classes = useStyles();
  const { user, refetchUser, isLoading: isLoadingUser } = useUser();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelSubscription, setCancelSubscription] = useState(false);
  const [promoCodeModal, setPromoCodeModal] = useState(false);
  const [adModal, setAdModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const isComingFromRegister = router.query.isFromRegister;

  const debouncedPromoCode = useDebounce(promoCode, 500);
  const { ok: isValidPromoCode, error: promoCodeError, isLoading: isValidatingPromoCode } =
    useValidateCode(debouncedPromoCode, setPromoCodeModal);

  const { data: { data: customer } = {}, refetch: refetchCustomer } = useQuery(
    ["customer"],
    PaymentsApi.getCustomer
  );

  const { data: { data: isCouponEnabled } = {}, isLoading } = useQuery(
    ["isCouponEnabled"],
    PaymentsApi.getIsCuponEnabled
  );

  const { data: { data: plans } = {} } = useQuery(
    ["plans"],
    PaymentsApi.getPlans
  );

  const premiumPlan = useMemo(() => plans?.results?.find((plan: IPlan) => plan.slug === "premium"), [plans])

  const price = useMemo(() => (premiumPlan?.price?.amount || 0) / 100, [premiumPlan])

  useEffect(() => {
    if (!user?.subscriptionPlan && !isLoadingUser) {
      setAdModal(true);
    }
  }, [user?.subscriptionPlan, isLoadingUser])

  const { mutateAsync: mutateSubscribe, isLoading: isSubscribing } =
    useMutation(PaymentsApi.subscribe, {
      onSuccess: () => {
        const message = "Subscription Successfully Purchased";
        enqueueSnackbar(message, { variant: SnackbarEnum.Success });
        refetchUser();
      },
      onError: () => {
        const message = "We could not process your card. Try again or use a new credit card"
        enqueueSnackbar(message, { variant: SnackbarEnum.Error });
      },
    });

  const onSubmit = async () => {
    try {
      await mutateSubscribe({
        plan: "premium",
        payment_method_id: customer?.defaultPaymentMethod?.stripeId,
        coupon: isValidPromoCode ? promoCode : null,
      });
    } catch (error) {
      return;
    }
  };

  const { isLoading: isCanceling, mutateAsync: mutateCancel } = useMutation(
    PaymentsApi.cancelSubscription,
    {
      onSuccess: () => {
        setCancelSubscription(false);
        const message = "Your subscription was successfully canceled";
        enqueueSnackbar(message, { variant: SnackbarEnum.Success });
        refetchUser();
      },
      onError: () => {
        const message = "We could not cancel your subscription...";
        enqueueSnackbar(message, { variant: SnackbarEnum.Error });
      },
    }
  );

  return (
    <Container>
      <Header variant={isComingFromRegister && !user?.subscriptionPlan ? HeaderVariant.Simple : HeaderVariant.Default} />
      <StyledMain>
        <BrandContainer>
          <Hidden smDown>
            <Image src="/images/wtflogo.png" alt="Why the Face" />
          </Hidden>
          <StyledSubtitle variant="h5">
            Understanding{" "}
            <span style={{ color: colors.green[600] }}>
              Health & Personality
            </span>{" "}
            <Hidden smDown>
              <div>Through Facial Analysis</div>
            </Hidden>
            <Hidden smUp>
              <span>Through Facial Analysis</span>
            </Hidden>
          </StyledSubtitle>
        </BrandContainer>
        <SubscriptionContainer>
          <PriceContainer>
            <div>
              <SubscriptionPeriodUpper>Monthly</SubscriptionPeriodUpper>
              <SubscriptionPeriodLower>Subscription</SubscriptionPeriodLower>
            </div>
            <PriceToPayContainer>
              <Currency>$</Currency>
              <PriceNumber>{price}</PriceNumber>
              <RecurrencePeriod>/ per month</RecurrencePeriod>
            </PriceToPayContainer>
          </PriceContainer>
          <SubscriptionContainerDivider />
          <OffersList>
            <OfferItem>
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: "large",
                  color: colors.green[600],
                  marginRight: 1,
                }}
              />
              <OfferItemDescription>
                Full access and functionality to the WTF Facial Analysis app.
              </OfferItemDescription>
            </OfferItem>
            <OfferItem>
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: "large",
                  color: colors.green[600],
                  marginRight: 1,
                }}
              />
              <OfferItemDescription>
                Your patients/clients can submit photos to you for analysis.
              </OfferItemDescription>
            </OfferItem>
            <OfferItem>
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: "large",
                  color: colors.green[600],
                  marginRight: 1,
                }}
              />
              <OfferItemDescription>
                View and analyze all facial characteristic for each of your
                patients/clients submissions.
              </OfferItemDescription>
            </OfferItem>
            <OfferItem>
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: "large",
                  color: colors.green[600],
                  marginRight: 1,
                }}
              />
              <OfferItemDescription>
                Assess potential health concerns and download the full patient/client
                report PDF that you can share with each patient/client.
              </OfferItemDescription>
            </OfferItem>
          </OffersList>
        </SubscriptionContainer>
        <Terms>
          I understand and agree to the legal terms required by law to collect & protect patient/client personal information under HIPAA rules and regulations. I understand all submitted photos will be accessible & archived within my app subscription, are the property of WTF? Why the Face and can be used for app improvements & research.
        </Terms>
        <PurchaseContainer>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              sx={{
                color: colors.purple[50],
                "&.Mui-checked": {
                  color: colors.purple[50],
                },
                "&.MuiCheckbox-root": {
                  paddingLeft: "3px",
                },
              }}
              disabled={!!user?.subscriptionPlan}
              checked={checked || !!user?.subscriptionPlan}
              onChange={() => setChecked(!checked)}
            />
            <div>I agree to these <TermsDownload href="/terms/WTF-Application-Services-Agreement.pdf" target="_blank" rel="noopener noreferrer">terms and conditions
            </TermsDownload>.</div>
          </div>

          {isLoading && <CircularProgress style={{ "alignSelf": 'center', "marginTop": 8, "marginBottom": 8 }} size={48} color="info" />}
          {isCouponEnabled && (
            <StyledTextField
              error={
                !!promoCode.length &&
                !isValidPromoCode &&
                !isValidatingPromoCode &&
                isValidPromoCode !== null
              }
              label="Promotional Code"
              fullWidth
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
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
                endAdornment: !!promoCode.length && isValidPromoCode !== null && (
                  <InputAdornment position="end">
                    {isValidatingPromoCode ? (
                      <CircularProgress size={24} color="info" />
                    ) : (
                      <Icon>
                        {isValidPromoCode ? (
                          <Check color="success" />
                        ) : (
                          <X color="error" />
                        )}
                      </Icon>
                    )}
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                classes: {
                  error: classes?.helperText,
                },
              }}
            />
          )}
          {user && customer?.defaultPaymentMethod ? (
            <SavedCard>
              <div>
                <CardDigits>
                  •••• •••• •••• {customer?.defaultPaymentMethod?.last4}
                </CardDigits>
                <CardFlag>
                  {customer?.defaultPaymentMethod?.brand?.toUpperCase()}
                </CardFlag>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setModalVisible(true)}
              >
                <EditOutlinedIcon
                  sx={{
                    color: colors.blue[600],
                    height: "18px",
                    width: "18px",
                    marginRight: "4px",
                  }}
                />
                <EditCard>Edit</EditCard>
              </div>
            </SavedCard>
          ) : (
            <AddPaymentButton onClick={() => setModalVisible(true)}>
              Add Payment Method
            </AddPaymentButton>
          )}
          {!user?.subscriptionPlan ? (
            <SubscribeButton
              disabled={!customer?.defaultPaymentMethod || !checked || isSubscribing}
              onClick={() => onSubmit()}
              isLoading={isSubscribing}
            >
              Subscribe
            </SubscribeButton>
          ) : (
            <CancelSubscription
              style={{ cursor: user?.subscriptionPlan?.status === 'will_cancel' ? 'auto' : 'pointer' }}
              onClick={() => setCancelSubscription(user?.subscriptionPlan?.status !== 'will_cancel')}
            >
              {user?.subscriptionPlan?.status === 'will_cancel' ? 'Your subscription will be canceled at the end of the billing cycle' : 'Cancel Subscription'}
            </CancelSubscription>
          )}
          {user && (
            <PaymentMethodModal
              user={user}
              open={modalVisible}
              onClose={() => setModalVisible(false)}
              refetch={refetchCustomer}
            />
          )}
        </PurchaseContainer>
        <CancelSubscriptionModal
          open={cancelSubscription}
          onClose={() => setCancelSubscription(false)}
          mutateCancel={mutateCancel}
          isCanceling={isCanceling}
        />
        <PromotionalCodeModal
          open={promoCodeModal}
          onClose={() => setPromoCodeModal(false)}
          error={promoCodeError}
          price={price}
        />
        <AdModal
          open={adModal}
          onClose={() => setAdModal(false)}
        />
      </StyledMain>
    </Container>
  );
};

export default Subscription;

const PriceToPayContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Currency = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: ${colors.purple[50]};
  margin-right: 6px;
`;

const PriceNumber = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 60px;
  line-height: 81px;
  letter-spacing: 0.25px;
  color: ${colors.gray[100]};
`;

const RecurrencePeriod = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${colors.purple[50]};
`;

const PriceContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: ${({ theme }) => theme.spacing(1)};
  } ;
`;

const SubscriptionPeriodUpper = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.25px;
  color: ${colors.gray[100]};
`;

const SubscriptionPeriodLower = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.25px;
  color: ${colors.purple[50]};
`;

const StyledMain = styled(Main)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(23.75)};
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(6)};
  font-size: ${fontSize(24)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    align-self: center;
    width: 343px;
    height: 96px;
    margin-top: ${({ theme }) => theme.spacing(3)};
  } ;
`;

const Image = styled.img`
  width: 75.91px;
  height: 96px;
  margin-right: ${({ theme }) => theme.spacing(3)};
`;

const StyledSubtitle = styled(SubTitle)`
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${fontSize(24)};
  line-height: 32px;
  letter-spacing: 0.25px;
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(0, 6, 1)};
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(6)};
  width: ${({ theme }) => theme.spacing(49)};
  border-radius: 16px;
  background-color: ${colors.purple[800]};
  gap: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: ${({ theme }) => theme.spacing(4)};
    width: ${({ theme }) => theme.spacing(43)};
    padding: ${({ theme }) => theme.spacing(3, 4)};
  } ;
`;

const OffersList = styled.div`
  color: ${colors.gray[100]};
`;

const OfferItem = styled.div`
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 12px;
  } ;
`;

const OfferItemDescription = styled.div`
  font-weight: 500;
  font-size: ${fontSize(14)};
  line-height: 19px;
  letter-spacing: 0.25px;
`;

const SubscriptionContainerDivider = styled.hr`
  width: ${({ theme }) => theme.spacing(37)};
  border: 1px solid ${colors.purple[600]};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: ${({ theme }) => theme.spacing(35)};
  } ;
`;

const Terms = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(49)};
  font-weight: 500;
  font-size: ${fontSize(15)};
  line-height: 20px;
  letter-spacing: 0.25px;
  color: ${colors.gray[100]};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: ${({ theme }) => theme.spacing(43)};
  } ;
`;

const PurchaseContainer = styled.div`
  width: ${({ theme }) => theme.spacing(49)};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacing(2.25)};
  color: ${colors.gray[100]};
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: ${({ theme }) => theme.spacing(43)};
  } ;
`;

const AddPaymentButton = styled(ButtonWithLoading)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.gray[200]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
  }
`;

const SubscribeButton = styled(ButtonWithLoading)`
  background-color: ${colors.gray[100]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.gray[800]};
  height: 46px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.purple[800]};
    color: ${colors.purple[50]};
  }
`;

const SavedCard = styled.div`
  width: ${({ theme }) => theme.spacing(49)};
  height: ${({ theme }) => theme.spacing(8.3)};
  background-color: ${colors.gray[100]};
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 12px 24px 12px 24px;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3.5)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: ${({ theme }) => theme.spacing(43)};
  } ;
`;

const CardDigits = styled.div`
  height: 22px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.25px;
  color: ${colors.gray[800]};
`;

const CardFlag = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.25px;
  color: ${colors.gray[600]};
`;

const EditCard = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.25px;
  color: ${colors.blue[900]};
`;

const CancelSubscription = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: ${fontSize(16)};
  line-height: 22px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.25px;
  color: ${colors.purple[50]};
  cursor: pointer;
  justify-content: center;
  align-self: center;
`;

const StyledTextField = styled(TextField)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const TermsDownload = styled.a`
    color: ${colors.purple[50]};
    &:hover {
    color: ${colors.purple[900]};
  }
`