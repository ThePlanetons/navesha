import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type CheckoutItem = {
  sku: string;
  size: string;
  quantity: number;
};

type ProductVariant = {
  size: string;
  price: number;
};

type EnrichedItem = {
  sku: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  payable_quantity: number;
};

function calculatePayableQuantity(quantity: number, buyQuantity: number, freeQuantity: number) {
  const groupSize = buyQuantity + freeQuantity;

  const freeItems = Math.floor(quantity / groupSize) * freeQuantity;

  return quantity - freeItems;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "Cart is empty"
        },
        {
          status: 400
        }
      );
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code
    } = customer;

    /*
    -----------------------------------
    1. Fetch Products + Size Prices
    -----------------------------------
    */
    const skus = items.map((item: CheckoutItem) => item.sku);

    const { data: products, error: productError, } = await supabaseAdmin
      .from("collection_products")
      .select(`
        sku,
        name,
        id
      `)
      .in("sku", skus);

    if (productError) {
      return NextResponse.json(
        {
          error: productError.message
        },
        {
          status: 500
        }
      );
    }

    const { data: posterPrices, error: priceError, } = await supabaseAdmin
      .from("poster_prices")
      .select(`
        size,
        price
      `);

    /*
    -----------------------------------
    2. Fetch Discount Rules
    -----------------------------------
    */

    const discountRules: Record<string, { buy_quantity: number; free_quantity: number; }> = {
      A3: {
        buy_quantity: 4,
        free_quantity: 1,
      },
      A4: {
        buy_quantity: 4,
        free_quantity: 1,
      },
      A5: {
        buy_quantity: 4,
        free_quantity: 1,
      },
    };

    /*
    -----------------------------------
    3. Build Server Trusted Items
    -----------------------------------
    */

    const enrichedItems = items.map(
      (item: CheckoutItem) => {

        const product = products?.find((p) => p.sku === item.sku);

        if (!product) {

          throw new Error(
            `Product not found ${item.sku}`
          );
        }

        const variant = posterPrices?.find((v: ProductVariant) =>
          v.size === item.size
        );

        if (!variant) {
          throw new Error(
            `Price not found for size ${item.size}`
          );
        }

        const discount = discountRules[item.size];

        let payableQuantity = item.quantity;

        if (discount) {
          payableQuantity = calculatePayableQuantity(
            item.quantity,
            discount.buy_quantity,
            discount.free_quantity
          );
        }

        return {
          sku: item.sku,
          name: product.name,
          size: item.size,
          price: Number(variant.price),
          quantity: item.quantity,
          payable_quantity: payableQuantity
        };
      }
    );

    /*
    -----------------------------------
    4. Calculate Amount
    -----------------------------------
    */

    const subtotal = enrichedItems.reduce((sum: number, item: EnrichedItem) => {
      return (sum + item.price * item.payable_quantity);
    }, 0);

    const shipping_amount = 100;

    const total = subtotal + shipping_amount;

    /*
    -----------------------------------
    5. Generate Order Number
    -----------------------------------
    */
    const now = new Date();

    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

    const { data: lastOrder } =
      await supabaseAdmin
        .from("orders")
        .select(
          "order_number"
        )
        .ilike(
          "order_number",
          `ORD-${datePart}-%`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    let sequence = 1;

    if (lastOrder?.order_number) {
      const lastSequence = parseInt(lastOrder.order_number.split("-")[2]);

      sequence = lastSequence + 1;
    }

    const order_number = `ORD-${datePart}-${String(sequence).padStart(4, "0")}`;

    /*
    -----------------------------------
    6. Create Order
    -----------------------------------
    */
    const { data: order, error: orderError } = await supabaseAdmin
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
        status: "pending"
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        {
          error: orderError.message
        },
        {
          status: 500
        }
      );
    }

    /*
    -----------------------------------
    7. Razorpay
    -----------------------------------
    */

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order_number
    });

    await supabaseAdmin
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id
      })
      .eq("id", order.id);

    /*
    -----------------------------------
    8. Insert Items
    -----------------------------------
    */

    const orderItems = enrichedItems.map(
      (item: EnrichedItem) => ({
        order_id: order.id,
        product_sku: item.sku,
        product_name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      })
    );

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        {
          error: itemsError.message
        },
        {
          status: 500
        }
      );
    }

    /*
    -----------------------------------
    9. Insert Address
    -----------------------------------
    */

    const { error: addressError } = await supabaseAdmin
      .from("order_addresses")
      .insert({
        order_id: order.id,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code
      });

    if (addressError) {
      return NextResponse.json(
        {
          error: addressError.message
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number,
      razorpay_order_id: razorpayOrder.id,
      amount: total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  }

  catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error)
      },
      {
        status: 500
      }
    );
  }
}