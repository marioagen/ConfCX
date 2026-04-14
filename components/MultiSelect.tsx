import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './Icons';

type OptionType = string | { isGroupLabel: true; label: string };

interface MultiSelectProps {
  label: string;
  options: OptionType[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleToggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const filteredOptions = options.filter(option => {
    if (typeof option === 'object' && option.isGroupLabel) {
      if (!searchTerm) return true;
      // Hide group if no items in it match search
      const groupIndex = options.indexOf(option);
      const nextGroupIndex = options.findIndex((item, index) => index > groupIndex && typeof item === 'object' && item.isGroupLabel);
      const itemsInGroup = options.slice(groupIndex + 1, nextGroupIndex !== -1 ? nextGroupIndex : options.length);
      return itemsInGroup.some(item => typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return typeof option === 'string' && option.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getDisplayLabel = () => {
    const count = selectedOptions.length;
    if (count === 0) {
      return 'Selecione...';
    }
    if (count === 1) {
      return selectedOptions[0];
    }
    return `${selectedOptions[0]} +${count - 1}`;
  };

  const displayLabel = getDisplayLabel();

  return (
    <div>
        <label className="block text-gray-500 mb-1">{label}</label>
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 flex justify-between items-center text-left focus:bg-white focus:ring-1 focus:ring-[#005c9e] outline-none transition-colors"
            >
                <span className={`block truncate ${selectedOptions.length > 0 ? "font-medium text-gray-800" : "text-gray-500"}`}>{displayLabel}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#005c9e] text-sm"
                        />
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {filteredOptions.map((option, index) => {
                             if (typeof option === 'object' && option.isGroupLabel) {
                                return (
                                    <li key={`${option.label}-${index}`} className="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-100">
                                        {option.label}
                                    </li>
                                );
                            }
                            const optionValue = option as string;
                            return (
                                <li key={optionValue} className="p-2 hover:bg-blue-50 cursor-pointer flex items-center" onClick={() => handleToggleOption(optionValue)}>
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={selectedOptions.includes(optionValue)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#005c9e] focus:ring-[#005c9e] mr-3 pointer-events-none accent-[#005c9e]"
                                    />
                                    <span className="w-full cursor-pointer select-none text-gray-800">
                                        {optionValue}
                                    </span>
                                </li>
                            );
                        })}
                        {filteredOptions.filter(o => typeof o === 'string').length === 0 && searchTerm && (
                            <li className="p-2 text-gray-500 text-sm text-center">Nenhuma opção encontrada</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
};

export default MultiSelect;