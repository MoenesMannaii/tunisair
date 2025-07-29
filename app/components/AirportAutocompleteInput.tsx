import { useState, useRef, useEffect } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { airports } from '@/data/airports'

interface AirportAutocompleteInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function AirportAutocompleteInput({
  label,
  value,
  onChange,
  placeholder,
}: AirportAutocompleteInputProps) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState(airports)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!value) {
      setFiltered(airports)
      setHighlightedIndex(-1)
      return
    }

    const search = value.toLowerCase()
    const filteredAirports = airports.filter(({ code, city, country, name }) =>
      code.toLowerCase().startsWith(search) ||
      city.toLowerCase().startsWith(search) ||
      country.toLowerCase().startsWith(search) ||
      name.toLowerCase().includes(search)
    )

    setFiltered(filteredAirports)
    setHighlightedIndex(-1)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return
    const list = listRef.current
    const item = list.children[highlightedIndex] as HTMLElement
    if (item) {
      const itemTop = item.offsetTop
      const itemBottom = itemTop + item.offsetHeight
      const listScrollTop = list.scrollTop
      const listHeight = list.clientHeight

      if (itemTop < listScrollTop) {
        list.scrollTop = itemTop
      } else if (itemBottom > listScrollTop + listHeight) {
        list.scrollTop = itemBottom - listHeight
      }
    }
  }, [highlightedIndex])

  const handleSelect = (code: string) => {
    onChange(code)
    setOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
      e.preventDefault()
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelect(filtered[highlightedIndex].code)
      }
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setOpen(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor={`${label.toLowerCase()}-input`}
        className="block text-xs font-semibold text-gray-900 mb-1 select-none"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={`${label.toLowerCase()}-input`}
          type="text"
          className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-shadow shadow-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value.toUpperCase())
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          maxLength={3}
          style={{ textTransform: 'uppercase' }}
          aria-autocomplete="list"
          aria-controls={`${label.toLowerCase()}-listbox`}
          aria-expanded={open}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${label.toLowerCase()}-option-${highlightedIndex}` : undefined
          }
          role="combobox"
          autoComplete="off"
        />
        <FiMapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-red-700 text-lg pointer-events-none" />
      </div>

      {/* Dropdown opens upward */}
      {open && filtered.length > 0 && (
        <ul
          id={`${label.toLowerCase()}-listbox`}
          role="listbox"
          ref={listRef}
          className="absolute z-50 bottom-full mb-2 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg text-sm text-gray-800"
          style={{ scrollbarWidth: 'thin' }}
        >
          {filtered.map(({ code, city, country, name }, index) => (
            <li
              key={code}
              id={`${label.toLowerCase()}-option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSelect(code)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`cursor-pointer px-4 py-2 select-none transition-colors ${
                highlightedIndex === index
                  ? 'bg-red-100 text-red-800 font-semibold'
                  : 'hover:bg-red-50'
              }`}
              title={`${name}, ${city}, ${country}`}
            >
              <strong>{code}</strong> — {city}, {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
