import styled from 'styled-components';
import { celular, cores, listaGeneros, nomeDoGenero } from '@/styles/tokens';
import { Chip } from '@/components/Chip';
import { ChoiceLabel, Segmented, Stepper, Switch } from '@/components/Choice';
import { Field, Input, TextArea } from '@/components/Field';

const Lista = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${celular} {
    gap: 22px;
  }
`;

const Grupo = styled.div`
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

const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 24px;

  > :first-child {
    flex: 1 1 280px;
  }
`;

const niveisLeitura = ['Iniciante', 'Intermediário', 'Avançado'];

// Campos do gosto literário, usados na etapa 2 do cadastro e na edição do perfil.
// "dados" tem os nomes de campo da API; "onChange(campo, valor)" atualiza um deles.
export function TasteFields({ dados, onChange, prefixo }) {
  const generoAtual = nomeDoGenero(dados.generoFavorito);

  return (
    <Lista>
      <Grupo role="group" aria-labelledby={`${prefixo}Genero`}>
        <ChoiceLabel id={`${prefixo}Genero`}>Gênero favorito</ChoiceLabel>
        <Chips>
          {listaGeneros.map((genero) => (
            <Chip
              key={genero}
              $ativo={genero === generoAtual}
              $fundo={cores.fundoApp}
              onClick={() => onChange('generoFavorito', genero === generoAtual ? '' : genero)}
            >
              {genero}
            </Chip>
          ))}
        </Chips>
      </Grupo>

      <Field id={`${prefixo}Autor`} label="Autor preferido">
        <Input
          type="text"
          placeholder="Ex.: Machado de Assis"
          value={dados.autorPreferido}
          onChange={(e) => onChange('autorPreferido', e.target.value)}
        />
      </Field>

      <Linha>
        <Segmented
          id={`${prefixo}Nivel`}
          label="Nível de leitura"
          opcoes={niveisLeitura}
          valor={dados.nivelLeitura}
          onChange={(nivel) => onChange('nivelLeitura', nivel)}
        />
        <Stepper
          id={`${prefixo}Lidos`}
          label="Livros já lidos"
          valor={Number(dados.livrosLidos) || 0}
          onChange={(valor) => onChange('livrosLidos', valor)}
        />
      </Linha>

      <Field id={`${prefixo}Bio`} label="Biografia">
        <TextArea
          rows={3}
          placeholder="Conte um pouco sobre seus gostos literários"
          value={dados.biografia}
          onChange={(e) => onChange('biografia', e.target.value)}
        />
      </Field>

      <Switch
        id={`${prefixo}Recomendacoes`}
        label="Quero receber recomendações personalizadas"
        ligado={Boolean(dados.receberRecomendacoes)}
        onChange={(ligado) => onChange('receberRecomendacoes', ligado)}
      />
    </Lista>
  );
}
