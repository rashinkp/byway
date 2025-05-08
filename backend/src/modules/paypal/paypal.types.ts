export interface ICreateOrderInput {
  order_price: string;
  userId: string;
}

export interface ICaptureOrderInput {
  orderID: string;
  userId: string;
}

export interface IPaypalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

export interface IPaypalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        amount: { currency_code: string; value: string };
        status: string;
      }>;
    };
  }>;
}

