"use client";

export default function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  );
}