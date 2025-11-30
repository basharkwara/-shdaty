"use client";

import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-200">
          {label}
        </label>
      )}

      <input
        className="h-10 rounded-md border border-gray-600 bg-transparent px-3 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}