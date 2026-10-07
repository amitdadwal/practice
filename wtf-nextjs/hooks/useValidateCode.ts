import { useQuery } from "react-query";

export default function useValidateCode(coupon: string, setModal: (arg: boolean) => void) {
    const {
      data: {
        data: { ok, error },
      } = {data: { ok: false }},
      isLoading,
    } = useQuery<{  data: { ok: boolean, error: "Empty coupon" | "Coupon already used" | "Invalid coupon" } }>(
      `/subscriptions/validate-coupon?coupon=${coupon}`,
      {
        enabled: !!coupon,
        onSuccess: () => {
            setModal(true)
        }
      }
    );
  if (!coupon || !coupon.length) return { result: null, isLoading: false }
  return { ok, error, isLoading };
}
