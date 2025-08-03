"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

type Filters = {
  type: string;
  month: string;
  region: string;
  sort: string;
};

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
}

const typeOpts = ["All", "Round-Trip", "One-Way"];
const monthOpts = ["All", "June", "July", "August"];
const regionOpts = [
  "Tous",
  "Africa",
  "Moyen-Orient",
  "Europe",
  "Canada",
];
const sortOpts = ["Top Deal", "Price", "Alphabet"];

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Select
        value={value.type}
        onValueChange={(v) => onChange({ ...value, type: v })}
      >
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeOpts.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.month}
        onValueChange={(v) => onChange({ ...value, month: v })}
      >
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {monthOpts.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.region}
        onValueChange={(v) => onChange({ ...value, region: v })}
      >
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regionOpts.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.sort}
        onValueChange={(v) => onChange({ ...value, sort: v })}
      >
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOpts.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}