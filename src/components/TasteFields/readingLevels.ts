// The values go to the API in English; the screen shows them in Portuguese.
export const readingLevels = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
];

// "intermediate" becomes "Intermediário"; an unknown value stays as it came.
export const readingLevelLabel = (value?: string | null) =>
  readingLevels.find((level) => level.value === value)?.label ?? value ?? '';
