// app/admin/featured-collections/[slug]/page.tsx

import { Suspense } from "react";

import CollectionProductsPage from "./_components/collection-products-page";

type Props = { params: Promise<{ slug: string; }>; };

async function Content({ params, }: Props) {
  const { slug, } = await params;

  return (
    <CollectionProductsPage
      slug={slug}
    />
  );
}

export default function Page(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}