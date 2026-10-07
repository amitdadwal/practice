import { axios } from "baseapp-nextjs-core";

export default class PaymentsApi {
  static addPaymentMethod(params: {stripe_id: string | undefined, is_default: boolean}) {
    return axios.post('/payment-methods', params);
  }

  static getCustomer() {
    return axios.get('/customers');
  }

  static getIsCuponEnabled() {
    return axios.get('/subscriptions/is-coupon-enabled');
  }

  static getPlans() {
    return axios.get('/plans')
  }

  static subscribe(params: { plan: string, payment_method_id: string | undefined, coupon: string | undefined |null}) {
    return axios.post('/subscriptions', params);
  }

  static cancelSubscription() {
    return axios.delete('/subscriptions/cancel');
  }
}
