
declare module 'baseapp-nextjs-core/src/auth/types' {
    export interface IUser {
        username: string;
        displayName: string;
        subscriptionPlan?: {
          plan: string;
          status: string;
        } | null;
        showPaymentMethodActionBanner: boolean;
      }
}

export {}