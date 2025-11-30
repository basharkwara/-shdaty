"use client";

import React from "react";

type ProductGridProps = {
  children?: React.ReactNode;
  // منتركه مرن لحتى ما يعلّق علينا التايب سكربت هلق
  [key: string]: any;
};

export default function ProductGrid({ children, ...rest }: ProductGridProps) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      {...rest}
    >
      {children}
    </div>
  );
}