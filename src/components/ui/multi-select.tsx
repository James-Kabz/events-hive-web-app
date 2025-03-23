"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure rendering only on the client
  }, []);

  const handleChange = (selectedOptions: MultiValue<MultiSelectOption>) => {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    onChange(selectedValues);
  };

  if (!isClient) {
    // Avoid rendering during SSR
    return null;
  }

  return (
    <Select
      isMulti
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={handleChange}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
};

export default MultiSelect;
