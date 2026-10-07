import React, { ElementType, ReactElement, useState } from "react";
import styled from "@emotion/styled";
import colors from "styles/colors";
import {
  Typography,
  Modal,
  Box,
  Theme,
  SxProps,
  IconButton,
  TextField,
  InputBaseComponentProps,
} from "@mui/material";
import { fontSize } from "styles/utils";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import StripeInput from "components/forms/StripeInput";
import ButtonWithLoading from "components/buttons/ButtonWithLoading";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PaymentsApi from "../../pages/api/payments";
import FormikTextField from "components/forms/TextField";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
  refetch: () => void;
}

interface onSubmitValues {
  cardHolder: string;
}

import * as Yup from "yup";
import { IUser } from "baseapp-nextjs-core";
import { useSnackbar } from "notistack";
import { SnackbarEnum } from "common/enums";
import { PaymentMethodResult } from "@stripe/stripe-js";

const validation = Yup.object().shape({
  cardHolder: Yup.string()
    .max(40, "This field should not have more than 40 characters")
    .required("This field is required"),
});

const PaymentMethodModal = ({
  open,
  onClose,
  user,
  refetch,
}: PaymentMethodModalProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync } = useMutation(PaymentsApi.addPaymentMethod, {
    onSuccess: () => {
      const message = "Payment Method Successfully Created";
      enqueueSnackbar(message, { variant: SnackbarEnum.Success });
      refetch();
      onClose();
    },
    onError: () => {
      const message = "We could not process your card. Try again or use a new credit card."
      enqueueSnackbar(message, { variant: SnackbarEnum.Error });
    },
  });

  const onSubmit = async (values: onSubmitValues) => {
    setIsLoading(true);
    try {
      const card = elements?.getElement(CardNumberElement);
      if (card) {
        const { paymentMethod, error }: PaymentMethodResult =
          (await stripe?.createPaymentMethod({
            type: "card",
            card,
            billing_details: {
              name: values.cardHolder,
              email: user?.email,
            },
          })) || ({} as PaymentMethodResult);

        if (error) {
          const message = "Error when creating Payment Method";
          enqueueSnackbar(message, { variant: SnackbarEnum.Error });
        } else {
          await mutateAsync({
            stripe_id: paymentMethod?.id,
            is_default: true,
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      refetch();
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { cardHolder: "" },
    validationSchema: validation,
    onSubmit,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <ModalTitle variant="h5">Enter Payment Method</ModalTitle>
        <StyledIconButton onClick={onClose} name="close-button">
          <CloseOutlinedIcon sx={{ color: colors.gray[400] }} />
        </StyledIconButton>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            label="Card Holder"
            name="cardHolder"
            variant="outlined"
            required
            fullWidth
            formik={formik}
            sx={{
              marginBottom: "24px",
              marginTop: "48px",
              height: "48px",
            }}
          />
          <TextField
            label="Credit Card Number"
            name="ccnumber"
            variant="outlined"
            required
            fullWidth
            InputProps={{
              inputComponent:
                StripeInput as unknown as ElementType<InputBaseComponentProps>,
              inputProps: {
                component: CardNumberElement,
              },
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              marginBottom: "24px",
              height: "48px",
            }}
          />
          <CardDetails>
            <TextField
              label="Expiration Date"
              name="ccexp"
              variant="outlined"
              required
              fullWidth
              InputProps={{
                inputComponent:
                  StripeInput as unknown as ElementType<InputBaseComponentProps>,
                inputProps: {
                  component: CardExpiryElement,
                },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                marginBottom: "24px",
                marginRight: "6px",
                height: "48px",
              }}
            />
            <TextField
              label="CVC"
              name="cvc"
              variant="outlined"
              required
              fullWidth
              InputProps={{
                inputComponent:
                  StripeInput as unknown as ElementType<InputBaseComponentProps>,
                inputProps: {
                  component: CardCvcElement,
                },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                marginBottom: "48px",
                marginLeft: "6px",
                height: "48px",
              }}
            />
          </CardDetails>
          <AddCreditCardButton
            type="submit"
            formik={formik}
            isLoading={isLoading}
          >
            Add Credit Card
          </AddCreditCardButton>
        </form>
      </Box>
    </Modal>
  );
};

export default PaymentMethodModal;

const modalBoxStyle: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "496px",
  height: "462px",
  bgcolor: `${colors.background[50]}`,
  boxShadow: 24,
  borderRadius: "8px",
  padding: "48px 48px 48px 48px",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.5em",
    height: "0.5em",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.1)",
    borderRadius: "3px",
    "&:hover": {
      background: "rgba(255,255,255,.2)",
    },
  },
  [theme.breakpoints.down("md")]: {
    p: 2,
    maxWidth: "95%",
  },
});

const ModalTitle = styled(Typography)`
  color: ${colors.gray[700]};
  font-weight: bold;
  font-size: ${fontSize(24)};
  line-height: 32px;
  letter-spacing: 0.25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: ${fontSize(20)};
    line-height: 24px;
  } ;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  color: ${colors.background[50]};
  right: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: ${({ theme }) => theme.spacing(1)};
    right: ${({ theme }) => theme.spacing(1)};
  }
`;

const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AddCreditCardButton = styled(ButtonWithLoading)`
  background-color: ${colors.purple[800]};
  width: 100%;
  flex: 1;
  text-transform: none;
  color: ${colors.surface[50]};
  height: 46px;
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.surface[50]};
  }
`;
