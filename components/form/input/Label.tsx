"use client";

import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label(props: LabelProps) {
  return (
    <label
      className="text-sm font-medium text-gray-200"
      {...props}
    />
  );
}