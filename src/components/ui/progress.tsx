import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

function Progress({
  className,
  value,
  ...props
}: ProgressProps) {
  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </div>
  )
}

export { Progress }
