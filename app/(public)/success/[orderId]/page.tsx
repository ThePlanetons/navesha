import { Suspense } from "react";

import OrderDetails from "./order-details";

export default function Page(props: {
  params: Promise<{
    orderId: string;
  }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetails params={props.params} />
    </Suspense>
  );
}