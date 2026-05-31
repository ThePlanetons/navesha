// app/admin/featured-collections/[slug]/page.tsx

import { Suspense } from "react";

import CollectionProductsView from "./_components/collection-products-view";

type Props = { params: Promise<{ slug: string; }>; };

async function Content({ params, }: Props) {
  const { slug, } = await params;

  return (
    <CollectionProductsView
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