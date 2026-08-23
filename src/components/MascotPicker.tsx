import { MASCOT_VARIANTS, type MascotVariant } from '../domain'
import { Mascot } from './Mascot'
import './MascotPicker.css'

interface MascotPickerProps {
  value: MascotVariant
  onChange: (variant: MascotVariant) => void
}

export function MascotPicker({ value, onChange }: MascotPickerProps) {
  return (
    <div className="mascot-picker" role="radiogroup" aria-label="Maskottchen auswählen">
      {MASCOT_VARIANTS.map((option) => (
        <button
          type="button"
          key={option.id}
          role="radio"
          aria-checked={value === option.id}
          className={`mascot-picker__option ${value === option.id ? 'mascot-picker__option--selected' : ''}`}
          onClick={() => onChange(option.id)}
        >
          <Mascot variant={option.id} size="large" />
          <strong>{option.label}</strong>
          <span>{option.description}</span>
        </button>
      ))}
    </div>
  )
}
