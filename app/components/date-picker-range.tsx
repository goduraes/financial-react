"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Field, FieldLabel } from "~/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

type Props = {
  value?: DateRange
  onChange: (value: DateRange | undefined) => void
  label?: string
}

export function DatePickerWithRange({
  value,
  onChange,
  label,
}: Props) {
  return (
    <Field className="mx-auto w-60">
      {label ?  <FieldLabel>{label}</FieldLabel> : null}
     
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon className="text-muted-foreground" />

            {value?.from ? (
              value.to ? (
                <div className="truncate text-sm">
                  {format(value.from, "dd/MM/yyyy")} -{" "}
                  {format(value.to, "dd/MM/yyyy")}
                </div>
              ) : (
                format(value.from, "dd/MM/yyyy")
              )
            ) : (
              <span className="truncate text-muted-foreground">Período</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}