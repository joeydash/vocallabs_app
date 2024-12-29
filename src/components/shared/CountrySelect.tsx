import React from 'react';
import { cn } from '../../utils/cn';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (dialCode: string) => void;
  className?: string;
}

const countries: Country[] = [
  { code: 'IN', name: 'India', dialCode: '91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', dialCode: '65', flag: '🇸🇬' },
];

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "block w-full rounded-md border-gray-300 dark:border-gray-600",
        "focus:border-primary-500 focus:ring-primary-500",
        "dark:bg-gray-700 dark:text-white sm:text-sm",
        className
      )}
    >
      {countries.map((country) => (
        <option key={country.code} value={country.dialCode}>
          {country.flag} {country.name} (+{country.dialCode})
        </option>
      ))}
    </select>
  );
}
