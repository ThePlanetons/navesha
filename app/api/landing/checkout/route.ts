import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type CheckoutItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 1. Extract customer fields
    // ---------------------------
    const {
      first_name,
      last_name,
      email,
      phone,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
    } = customer;

    // ---------------------------
    // 2. Fetch real prices
    // ---------------------------
    const skus = items.map((i: CheckoutItem) => i.sku);

    const { data: products, error: productError } = await supabaseAdmin
      .from("collection_products")
      .select("sku, name, price")
      .in("sku", skus);

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    // ---------------------------
    // 3. Merge items (SERVER TRUTH)
    // ---------------------------
    const enrichedItems: CheckoutItem[] = items.map((item: CheckoutItem) => {
      const product = products?.find((p) => p.sku === item.sku);

      if (!product) {
        throw new Error(`Product not found: ${item.sku}`);
      }

      return {
        sku: item.sku,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // ---------------------------
    // 4. Totals
    // ---------------------------
    const subtotal = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping_amount = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping_amount;

    // ---------------------------
    // 5. Generate order number FIRST
    // ---------------------------
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

    const { data: lastOrder } = await supabaseAdmin
      .from("orders")
      .select("order_number")
      .ilike("order_number", `ORD-${datePart}-%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let sequence = 1;

    if (lastOrder?.order_number) {
      const lastSeq = parseInt(lastOrder.order_number.split("-")[2]);
      sequence = lastSeq + 1;
    }

    const order_number = `ORD-${datePart}-${String(sequence).padStart(6, "0")}`;

    // ---------------------------
    // 6. Create DB order FIRST (needed for Razorpay receipt)
    // ---------------------------
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          order_number,
          customer_id: null,
          first_name,
          last_name,
          email,
          phone,
          subtotal,
          shipping_amount,
          total,
          status: "pending",
        })
        .select()
        .single();

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    // ---------------------------
    // 7. Create Razorpay order (NOW SAFE)
    // ---------------------------
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order_number,
    });

    // ---------------------------
    // 8. Update order with razorpay id
    // ---------------------------
    await supabaseAdmin
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
      })
      .eq("id", order.id);

    // ---------------------------
    // 9. Insert order items
    // ---------------------------
    const orderItems = enrichedItems.map((item) => ({
      order_id: order.id,
      product_sku: item.sku,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    // ---------------------------
    // 10. Insert address
    // ---------------------------
    const { error: addressError } = await supabaseAdmin
      .from("order_addresses")
      .insert({
        order_id: order.id,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
      });

    if (addressError) {
      return NextResponse.json(
        { error: addressError.message },
        { status: 500 }
      );
    }

    // ---------------------------
    // 11. RESPONSE FOR FRONTEND (IMPORTANT)
    // ---------------------------
    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number,
      razorpay_order_id: razorpayOrder.id,
      amount: total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}