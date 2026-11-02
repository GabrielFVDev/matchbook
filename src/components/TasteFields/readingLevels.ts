export const readingLevels = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
];

export const readingLevelLabel = (value?: string | null) =>
  readingLevels.find((level) => level.value === value)?.label ?? value ?? '';
