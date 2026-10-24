import styled from 'styled-components';
import { mobile, colors, genreList, genreName } from '@/styles/tokens';
import { Chip } from '@/components/Chip';
import { ChoiceLabel, Segmented, Stepper, Switch } from '@/components/Choice';
import { Field, Input, TextArea } from '@/components/Field';

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

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 24px;

  > :first-child {
    flex: 1 1 280px;
  }
`;

const readingLevels = ['Iniciante', 'Intermediário', 'Avançado'];

// The taste fields, with the API field names.
export interface TasteValues {
  generoFavorito: string;
  autorPreferido: string;
  nivelLeitura: string;
  livrosLidos: number | string;
  biografia: string;
  receberRecomendacoes: boolean;
}

interface TasteFieldsProps {
  values: TasteValues;
  onChange: (field: keyof TasteValues, value: TasteValues[keyof TasteValues]) => void;
  idPrefix: string;
}

// Reading taste fields, used in step 2 of sign-up and in the profile edit.
// "values" has the API field names; "onChange(field, value)" updates one of them.
export function TasteFields({ values, onChange, idPrefix }: TasteFieldsProps) {
  const currentGenre = genreName(values.generoFavorito);

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
              onClick={() => onChange('generoFavorito', genre === currentGenre ? '' : genre)}
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
          value={values.autorPreferido}
          onChange={(e) => onChange('autorPreferido', e.target.value)}
        />
      </Field>

      <Row>
        <Segmented
          id={`${idPrefix}Level`}
          label="Nível de leitura"
          options={readingLevels}
          value={values.nivelLeitura}
          onChange={(level) => onChange('nivelLeitura', level)}
        />
        <Stepper
          id={`${idPrefix}BooksRead`}
          label="Livros já lidos"
          value={Number(values.livrosLidos) || 0}
          onChange={(value) => onChange('livrosLidos', value)}
        />
      </Row>

      <Field id={`${idPrefix}Bio`} label="Biografia">
        <TextArea
          rows={3}
          placeholder="Conte um pouco sobre seus gostos literários"
          value={values.biografia}
          onChange={(e) => onChange('biografia', e.target.value)}
        />
      </Field>

      <Switch
        id={`${idPrefix}Recommendations`}
        label="Quero receber recomendações personalizadas"
        checked={Boolean(values.receberRecomendacoes)}
        onChange={(checked) => onChange('receberRecomendacoes', checked)}
      />
    </List>
  );
}
