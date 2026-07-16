export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;

  handler: (response: RazorpayResponse) => void;
};

export type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}