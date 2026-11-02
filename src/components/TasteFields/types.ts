export interface TasteValues {
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

export interface TasteFieldsProps {
  values: TasteValues;
  onChange: (field: keyof TasteValues, value: TasteValues[keyof TasteValues]) => void;
  idPrefix: string;
}
