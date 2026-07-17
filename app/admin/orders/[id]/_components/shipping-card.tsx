"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  MapPin,
  Home,
} from "lucide-react";
import { OrderAddress } from "./customer-card";

type Props = {
  address: OrderAddress;
};

export function ShippingCard({
  address,
}: Props) {
  if (!address) {
    return (
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-red-500" />
            Shipping Address
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            No shipping address available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-red-500" />
          Shipping Address
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="flex items-start gap-3">
          <Home className="mt-1 h-4 w-4 text-muted-foreground" />

          <div className="space-y-1">

            <p className="font-semibold">
              {address.first_name}{" "}
              {address.last_name}
            </p>

            <p>
              {address.address_line_1}
            </p>

            {address.address_line_2 && (
              <p>
                {address.address_line_2}
              </p>
            )}

            <p>
              {address.city}, {address.state}
            </p>

            <p>
              {address.postal_code}
            </p>

            <p className="pt-2 text-sm text-muted-foreground">
              Phone: {address.phone}
            </p>

          </div>
        </div>

      </CardContent>
    </Card>
  );
}