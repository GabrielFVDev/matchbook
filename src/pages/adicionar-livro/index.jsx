import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AppLayout } from "../../components/AppLayout";
import { BookCover } from "../../components/BookCover";
import { Tag } from "../../components/Chip";
import { Field, FormAlert, Input, Select, TextArea } from "../../components/Field";
import { Button, ButtonLink } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Spinner } from "../../components/Spinner";
import { IconAlert, IconCheck, IconHeart } from "../../components/Icons";
import {
  PageHeading,
  PageTitle,
  PageSubtitle,
  Columns,
  FormContainer,
  FormSection,
  SectionHeading,
  SectionTitle,
  FieldsGrid,
  CounterRow,
  SubmitRow,
  PreviewAside,
  PreviewLabel,
  PreviewCard,
  PreviewInfo,
  MobilePreview,
  MobilePreviewText,
  SuccessWrapper
} from './styles.module.jsx';
import { useAuth } from "../../hooks/useAuth";
import { useCurtidos } from "../../contexts/curtidos";
import { livroService, recomendacaoService } from "../../apis/services";
import { cores, listaGeneros } from "../../styles/tokens";
import { curvaSaida, surgir } from "../../styles/movimento";

const saidaRapida = { opacity: 0, y: -8, transition: { duration: 0.15, ease: curvaSaida } };

const idiomas = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Japonês', 'Outros'];

const formularioVazio = {
  titulo: '',
  autor: '',
  editora: '',
  genero: '',
  anoPublicacao: '',
  numeroPaginas: '',
  idioma: 'Português',
  isbn: '',
  sinopse: '',
  capaUrl: '',
  disponivel: true
};

const isValidUrl = (texto) => {
  try {
    new URL(texto);
    return true;
  } catch {
    return false;
  }
};

export default function AdicionarLivroPage() {
  const { getCurrentUser } = useAuth();
  const { somar } = useCurtidos();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(formularioVazio);
  const [errors, setErrors] = useState({});
  const [erroEnvio, setErroEnvio] = useState(null);
  const [resultado, setResultado] = useState(null);

  const anoMaximo = new Date().getFullYear() + 1;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (erroEnvio) setErroEnvio(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'Informe o título';
    if (!formData.autor.trim()) newErrors.autor = 'Informe o autor';
    if (!formData.genero) newErrors.genero = 'Escolha um gênero';

    if (!formData.sinopse.trim()) {
      newErrors.sinopse = 'Escreva a sinopse';
    } else if (formData.sinopse.length < 50) {
      newErrors.sinopse = 'Escreva pelo menos 50 caracteres';
    }

    if (formData.anoPublicacao && (formData.anoPublicacao < 1000 || formData.anoPublicacao > anoMaximo)) {
      newErrors.anoPublicacao = `Use um ano entre 1000 e ${anoMaximo}`;
    }

    if (formData.numeroPaginas && (formData.numeroPaginas < 1 || formData.numeroPaginas > 10000)) {
      newErrors.numeroPaginas = 'Use um número entre 1 e 10.000';
    }

    if (formData.capaUrl && !isValidUrl(formData.capaUrl)) {
      newErrors.capaUrl = 'Esse link não parece válido, ele começa com https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErroEnvio('Confira os campos marcados e tente de novo.');
      return;
    }

    const usuario = getCurrentUser();
    if (!usuario) {
      navigate('/');
      return;
    }

    setLoading(true);

    const dadosLivro = {
      ...formData,
      anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : null,
      numeroPaginas: formData.numeroPaginas ? parseInt(formData.numeroPaginas) : null,
      capaUrl: formData.capaUrl || null
    };

    const response = await livroService.criar(dadosLivro);

    if (response.success) {
      // Quem adiciona um livro ao catálogo já o leva para os seus favoritos.
      const favoritoResponse = await recomendacaoService.curtirLivro(usuario.id, response.data.id);
      if (favoritoResponse.success) {
        somar(1);
      } else {
        console.warn('Erro ao adicionar aos favoritos:', favoritoResponse.error);
      }
      setResultado({ titulo: formData.titulo, nosFavoritos: favoritoResponse.success });
      setFormData(formularioVazio);
    } else {
      setErroEnvio(response.error || 'Não deu para adicionar o livro. Tente de novo.');
    }

    setLoading(false);
  };

  const adicionarOutro = () => {
    setResultado(null);
    window.scrollTo({ top: 0 });
  };

  const contagemSinopse = `${formData.sinopse.length} de 1000`;

  return (
    <AppLayout>
      <PageHeading>
        <PageTitle>Adicionar livro</PageTitle>
        <PageSubtitle>Ele entra no catálogo e vai direto para os seus livros.</PageSubtitle>
      </PageHeading>

      <AnimatePresence mode="wait" initial={false}>
        {resultado ? (
          <SuccessWrapper key="sucesso" exit={saidaRapida}>
            <EmptyState
              icone={<IconCheck tamanho={30} />}
              tom="sucesso"
              titulo="Livro adicionado"
              descricao={
                resultado.nosFavoritos
                  ? `${resultado.titulo} já está nos seus livros e no catálogo.`
                  : `${resultado.titulo} entrou no catálogo, mas não foi para os seus livros. Dê Amei nele quando aparecer no Início.`
              }
              role="status"
            >
              <ButtonLink to="/meus-livros">Ver meus livros</ButtonLink>
              <Button $variante="secundario" onClick={adicionarOutro}>Adicionar outro</Button>
            </EmptyState>
          </SuccessWrapper>
        ) : (
          <Columns key="formulario" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={saidaRapida}>
            <MobilePreview role="group" aria-label="Prévia da capa">
              <BookCover tamanho="mini" titulo={formData.titulo} genero={formData.genero} capaUrl={formData.capaUrl} tituloVazio="Título do livro" />
              <MobilePreviewText $vazio={!formData.autor}>
                <p>Prévia</p>
                {formData.genero && <Tag $fundo={cores.fundoApp} $pequena>{formData.genero}</Tag>}
                <p>{formData.autor || 'Autor'}</p>
              </MobilePreviewText>
            </MobilePreview>

            <FormContainer onSubmit={handleSubmit} noValidate>
              <FormSection aria-labelledby="secaoSobre" {...surgir(0)}>
                <SectionTitle id="secaoSobre">Sobre o livro</SectionTitle>
                <FieldsGrid>
                  <Field id="titulo" label="Título" tag="obrigatório" error={errors.titulo} span>
                    <Input name="titulo" type="text" maxLength={255} placeholder="Como está na capa" value={formData.titulo} onChange={handleInputChange} />
                  </Field>
                  <Field id="autor" label="Autor" tag="obrigatório" error={errors.autor}>
                    <Input name="autor" type="text" maxLength={255} placeholder="Nome de quem escreveu" value={formData.autor} onChange={handleInputChange} />
                  </Field>
                  <Field id="genero" label="Gênero" tag="obrigatório" error={errors.genero}>
                    <Select name="genero" value={formData.genero} onChange={handleInputChange}>
                      <option value="">Escolha um gênero</option>
                      {listaGeneros.map(genero => (
                        <option key={genero} value={genero}>{genero}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field id="editora" label="Editora">
                    <Input name="editora" type="text" maxLength={255} placeholder="Ex.: Companhia das Letras" value={formData.editora} onChange={handleInputChange} />
                  </Field>
                  <Field id="idioma" label="Idioma">
                    <Select name="idioma" value={formData.idioma} onChange={handleInputChange}>
                      {idiomas.map(idioma => (
                        <option key={idioma} value={idioma}>{idioma}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field id="anoPublicacao" label="Ano de publicação" error={errors.anoPublicacao} data-meia>
                    <Input name="anoPublicacao" type="number" inputMode="numeric" min="1000" max={anoMaximo} placeholder="Ex.: 1951" value={formData.anoPublicacao} onChange={handleInputChange} />
                  </Field>
                  <Field id="numeroPaginas" label="Número de páginas" error={errors.numeroPaginas} data-meia>
                    <Input name="numeroPaginas" type="number" inputMode="numeric" min="1" max="10000" placeholder="Ex.: 320" value={formData.numeroPaginas} onChange={handleInputChange} />
                  </Field>
                  <Field id="isbn" label="ISBN" span>
                    <Input name="isbn" type="text" maxLength={20} placeholder="Os números do código de barras" value={formData.isbn} onChange={handleInputChange} />
                  </Field>
                </FieldsGrid>
              </FormSection>

              <FormSection aria-labelledby="secaoSinopse" {...surgir(1)}>
                <SectionHeading>
                  <SectionTitle id="secaoSinopse">Sinopse</SectionTitle>
                  <CounterRow aria-live="polite">{contagemSinopse}</CounterRow>
                </SectionHeading>
                <Field id="sinopse" label="Do que o livro trata" tag="obrigatório" error={errors.sinopse} help="Mínimo de 50 caracteres">
                  <TextArea name="sinopse" rows={5} maxLength={1000} placeholder="Em poucas linhas" value={formData.sinopse} onChange={handleInputChange} />
                </Field>
              </FormSection>

              <FormSection aria-labelledby="secaoCapa" {...surgir(2)}>
                <SectionTitle id="secaoCapa">Capa</SectionTitle>
                <Field id="capaUrl" label="Link da imagem" error={errors.capaUrl} help="Sem link, o Matchbook monta uma capa com a cor do gênero.">
                  <Input name="capaUrl" type="url" placeholder="https://" value={formData.capaUrl} onChange={handleInputChange} />
                </Field>
              </FormSection>

              {erroEnvio && (
                <FormAlert role="alert">
                  <IconAlert tamanho={18} />
                  {erroEnvio}
                </FormAlert>
              )}

              <SubmitRow>
                <Button type="submit" $tamanho="grande" disabled={loading}>
                  {loading ? <Spinner /> : <IconHeart tamanho={18} />}
                  {loading ? 'Adicionando' : 'Adicionar aos meus livros'}
                </Button>
                <ButtonLink to="/home" $variante="branco" $tamanho="grande">Cancelar</ButtonLink>
              </SubmitRow>
            </FormContainer>

            <PreviewAside
              aria-label="Prévia da capa"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } }}
            >
              <PreviewLabel>Prévia</PreviewLabel>
              <PreviewCard>
                <BookCover tamanho="previa" titulo={formData.titulo} genero={formData.genero} capaUrl={formData.capaUrl} tituloVazio="Título do livro" />
                <PreviewInfo $vazio={!formData.autor}>
                  <p>{formData.autor || 'Autor'}</p>
                  <p>Assim ele aparece nas recomendações.</p>
                </PreviewInfo>
              </PreviewCard>
            </PreviewAside>
          </Columns>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
