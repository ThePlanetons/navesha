import { Suspense } from "react";

import OrderDetailsPage from "./_components/order-details";

type Props = { params: Promise<{ id: string; }>; };

async function Content({ params }: Props) {
  const { id } = await params;

  return (
    <OrderDetailsPage id={id} />
  );
}

export default function Page(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}