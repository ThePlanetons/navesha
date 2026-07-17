"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PosterSize } from "@/contexts/cart-provider";

import {
  User,
  Mail,
  Phone,
} from "lucide-react";

export type OrderItem = {
  id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  size: PosterSize;
};

export type OrderAddress = {
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
};

export type Order = {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_amount: number;
  total: number;
  created_at: string;
  paid_at: string;
  razorpay_order_id: string | null;

  first_name: string;
  last_name: string | null;
  phone: string;
  email: string | null;

  order_items: OrderItem[];
  order_addresses: OrderAddress[];
};

type Props = {
  order: Order;
};

export function CustomerCard({
  order,
}: Props) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-red-500" />

          Customer Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Name */}
        <div>
          <p className="text-muted-foreground text-sm">
            Customer Name
          </p>

          <p className="mt-1 text-lg font-semibold">
            {order.first_name} {order.last_name}
          </p>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-muted-foreground text-sm">
              Phone
            </p>

            <p className="font-medium">
              {order.phone}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-muted-foreground text-sm">
              Email
            </p>

            <p className="font-medium">
              {order.email || "-"}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}