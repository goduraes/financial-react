"use client"

import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

type Props = {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className = ''
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={`w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground ${className}`}
        >
          {value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  )
}