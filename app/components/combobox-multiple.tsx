"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox"
import { getContrastColor } from "~/helper/tag-color"

export type OptionComboMultiple = {
  label: string;
  value: string;
  color: string;
}

type Props = {
  items: OptionComboMultiple[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function ComboboxMultiple({
  items,
  value,
  onChange,
  placeholder = "Selecione...",
}: Props) {
  const anchor = useComboboxAnchor()

  // 🔥 Map value -> label
  const map = React.useMemo(() => {
    const m = new Map<string, string>()
    items.forEach((item) => m.set(item.value, item.label))
    return m
  }, [items])

  return (
    <Combobox
      multiple
      items={items.map((item) => item.value)} // 👈 só values
      value={value}
      onValueChange={onChange}
    >
      <div className="relative w-full">
        <ComboboxChips ref={anchor} className="w-full pr-10">
          <ComboboxValue>
            {(values) => (
              <>
                {values.map((v: string) => {
                  const color = items.find((el) => el.value === v)?.color || '';
                  return (
                    <ComboboxChip className="text-sm" style={{ background: color, color: getContrastColor(color) }} key={v}>
                      {map.get(v) ?? v}
                    </ComboboxChip>
                )})}
                {!values.length ? <ComboboxChipsInput placeholder={placeholder} /> : null}
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
      </div>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>

        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item.value} value={item.value}>
              <span className="flexinnline px-1.5 py-[3px] font-medium rounded-sm text-sm" style={{ background: `${item.color}`, color: getContrastColor(item.color) }}>
                {item.label}
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}