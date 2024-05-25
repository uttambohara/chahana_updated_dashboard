"use client";

import { SketchPicker } from "react-color";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-4">
      <SketchPicker
        color={value}
        onChangeComplete={(color) => onChange(color.hex)}
      />
      <div>{value}</div>
    </div>
  );
}
