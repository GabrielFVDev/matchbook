import styled from 'styled-components';
import { mobile, colors, genreList, genreName } from '@/styles/tokens';
import { Chip } from '@/components/Chip';
import { ChoiceLabel, Segmented, Switch } from '@/components/Choice';
import { Field, Input } from '@/components/Field';
import { readingLevelLabel, readingLevels } from './readingLevels';
import type { TasteFieldsProps } from './types';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mobile} {
    gap: 22px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button {
    min-height: 40px;
    padding: 0 14px;
    font-size: 14px;
  }
`;

// Reading taste fields, used in step 2 of sign-up and in the profile edit.
// "values" has the API field names; "onChange(field, value)" updates one of them.
export function TasteFields({ values, onChange, idPrefix }: TasteFieldsProps) {
  const currentGenre = genreName(values.favoriteGenre);

  return (
    <List>
      <Group role="group" aria-labelledby={`${idPrefix}Genre`}>
        <ChoiceLabel id={`${idPrefix}Genre`}>Gênero favorito</ChoiceLabel>
        <Chips>
          {genreList.map((genre) => (
            <Chip
              key={genre}
              $active={genre === currentGenre}
              $background={colors.appBackground}
              onClick={() => onChange('favoriteGenre', genre === currentGenre ? '' : genre)}
            >
              {genre}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Field id={`${idPrefix}Author`} label="Autor preferido">
        <Input
          type="text"
          placeholder="Ex.: Machado de Assis"
          value={values.favoriteAuthor}
          onChange={(e) => onChange('favoriteAuthor', e.target.value)}
        />
      </Field>

      <Segmented
        id={`${idPrefix}Level`}
        label="Nível de leitura"
        options={readingLevels.map((level) => level.label)}
        value={readingLevelLabel(values.readingLevel)}
        onChange={(label) =>
          onChange(
            'readingLevel',
            readingLevels.find((level) => level.label === label)?.value ?? '',
          )
        }
      />

      <Switch
        id={`${idPrefix}Recommendations`}
        label="Quero receber recomendações personalizadas"
        checked={values.receiveRecommendations}
        onChange={(checked) => onChange('receiveRecommendations', checked)}
      />
    </List>
  );
}
