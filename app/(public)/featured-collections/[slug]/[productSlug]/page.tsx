import { Suspense } from "react";
import { notFound } from "next/navigation";

import ProductView from "./product-view";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
};

async function Content({ params }: Props) {
  const { productSlug } = await params;

  const { data: product } = await supabaseAdmin
    .from("collection_products")
    .select(`
      *,
      collections (
        id,
        title,
        slug
      ),
      collection_product_images (
        id,
        image_url,
        image_role,
        sort_order
      )
    `)
    .eq("slug", productSlug)
    .single();

  console.log("🚀 ~ Content ~ product:", product)
  if (!product) {
    notFound();
  }

  return (
    <ProductView
      product={product}
    />
  );
}

export default function ProductPage(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}