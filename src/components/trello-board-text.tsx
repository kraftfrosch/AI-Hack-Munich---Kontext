"use client";

import React from "react";

type TrelloBoardTextProps = {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

export function TrelloBoardText({ value, onChange, placeholder = "Board text…", rows = 8 }: TrelloBoardTextProps) {
  return (
    <div className="w-full">
      <textarea
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-white bg-gray-800 hover:bg-gray-900"
          onClick={() => navigator.clipboard.writeText(value || "")}
        >
          Copy
        </button>
      </div>
    </div>
  );
}
