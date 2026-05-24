// components/admin-breadcrumbs.tsx

"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNameMap: Record<
  string,
  string
> = {
  admin: "Admin Dashboard",

  "hero-sections": "Hero Sections",

  collections: "Featured Collections",
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();

  const segments =
    pathname
      .split("/")
      .filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map(
          (
            segment,
            index
          ) => {
            const href =
              "/" +
              segments
                .slice(
                  0,
                  index + 1
                )
                .join("/");

            const isLast =
              index ===
              segments.length -
              1;

            const label =
              routeNameMap[
              segment
              ] ||
              decodeURIComponent(
                segment
              )
                .replace(
                  /-/g,
                  " "
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );

            return (
              <div
                key={href}
                className="flex items-center"
              >
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                    >
                      <Link
                        href={
                          href
                        }
                      >
                        {label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator />
                )}
              </div>
            );
          }
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
