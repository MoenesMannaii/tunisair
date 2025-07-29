import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-300 text-gray-900 placeholder:text-gray-500 selection:bg-red-100 selection:text-gray-900 bg-white flex h-10 w-full  min-w-0  border px-3 py-2 text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-8 file:border-0 file:bg-white file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-red-700 focus-visible:ring-red-700/50 focus-visible:ring-2",
        "aria-invalid:border-red-600 aria-invalid:ring-red-600/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }