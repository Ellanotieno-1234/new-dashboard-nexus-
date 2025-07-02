"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { enUS } from "date-fns/locale"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("calendar-container", className)}>
      <style>{`
        .rdp-nav_button svg {
          display: inline !important;
          width: 1.5em;
          height: 1.5em;
          stroke: #ffffff !important;
          stroke-width: 3px !important; /* Thicker stroke */
          fill: none !important;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5)) !important; /* Adds contrast shadow */
        }
        .rdp-nav_button {
          color: #ffffff !important;
          background: #1a56db !important; /* Slightly darker blue for better contrast */
          border-radius: 50%;
          border: 2px solid #ffffff !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.2s;
          width: 36px; /* Slightly larger */
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .rdp-nav_button::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          pointer-events: none;
        }
        .rdp-nav_button:hover {
          background: #1d4ed8 !important;
          color: #ffffff !important;
          transform: scale(1.05);
        }
        .rdp-nav_button:hover svg {
          stroke: #fff !important;
        }
      `}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={enUS}
        weekStartsOn={1}
        classNames={{
          nav: "rdp-nav flex justify-between items-center mb-2",
          nav_button: "rdp-nav_button bg-transparent border-none cursor-pointer text-xl px-2 py-1 hover:bg-gray-100 rounded",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
