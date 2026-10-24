import api from './client';

// Serviços de autenticação
export const authService = {
  // Criar novo usuário
  async cadastrar(userData) {
    console.log('Service: Enviando dados para API:', userData);
    try {
      const response = await api.post('/usuario/create', userData);
      console.log('Service: Resposta da API:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Usuário cadastrado com sucesso!',
      };
    } catch (error) {
      console.error('Service: Erro na API:', error);
      console.error('Service: Erro response:', error.response?.data);
      console.error('Service: Erro status:', error.response?.status);

      let errorMessage = 'Erro ao cadastrar usuário';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage =
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  },

  // Fazer login (simulação, pois não há endpoint específico de login na API)
  async login(email, senha) {
    try {
      // Como não temos endpoint de login específico, vamos buscar todos os usuários
      // e verificar se existe um com o email/senha fornecidos
      const response = await api.get('/usuario/all');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha,
      );

      if (usuarioEncontrado) {
        // Remove a senha do objeto retornado por segurança
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;

        return {
          success: true,
          data: usuarioSemSenha,
          message: 'Login realizado com sucesso!',
        };
      } else {
        return {
          success: false,
          error: 'Email ou senha incorretos',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer login',
        data: null,
      };
    }
  },
};

// Serviços de usuário
export const userService = {
  // Buscar usuário por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/usuario/get?id=${id}`);
      return {
        success: true,
        data: response.data,
        message: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar usuário',
        data: null,
      };
    }
  },

  // Atualizar usuário
  async atualizar(userData) {
    try {
      const response = await api.put('/usuario/update', userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuário atualizado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar usuário',
        data: null,
      };
    }
  },

  // Atualizar foto do usuário
  async atualizarFoto(id, fotoUrl) {
    try {
      const response = await api.put(`/usuario/${id}/foto`, fotoUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Foto atualizada com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar foto',
        data: null,
      };
    }
  },
};

// Serviços de recomendação
export const recomendacaoService = {
  // Obter recomendação adaptativa
  async obterRecomendacaoAdaptativa(idUsuario) {
    try {
      const response = await api.get(`/recomendacao/getRecomendacaoAdaptativa/${idUsuario}`);
      return {
        success: true,
        data: response.data,
        message: 'Recomendações obtidas com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao obter recomendações',
        data: null,
      };
    }
  },

  // Obter recomendação original
  async obterRecomendacao(idUsuario) {
    try {
      const response = await api.get(`/recomendacao/getRecomendacao/${idUsuario}`);
      return {
        success: true,
        data: response.data,
        message: 'Recomendações obtidas com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao obter recomendações',
        data: null,
      };
    }
  },

  // Registrar aceitação de livro
  async aceitarLivro(idUsuario, idLivro) {
    try {
      const response = await api.post(
        `/recomendacao/aceitar?idUsuario=${idUsuario}&idLivro=${idLivro}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro aceito com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao aceitar livro',
        data: null,
      };
    }
  },

  // Registrar recusa de livro
  async recusarLivro(idUsuario, idLivro) {
    try {
      const response = await api.post(
        `/recomendacao/recusar?idUsuario=${idUsuario}&idLivro=${idLivro}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro recusado',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao recusar livro',
        data: null,
      };
    }
  },

  // Obter estatísticas do usuário
  async obterEstatisticas(idUsuario) {
    try {
      const response = await api.get(`/recomendacao/estatisticas/${idUsuario}`);
      return {
        success: true,
        data: response.data,
        message: 'Estatísticas obtidas com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao obter estatísticas',
        data: null,
      };
    }
  },

  // Resetar algoritmo
  async resetarAlgoritmo(idUsuario) {
    try {
      const response = await api.post(`/recomendacao/resetarAlgoritmo/${idUsuario}`);
      return {
        success: true,
        data: response.data,
        message: 'Algoritmo resetado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao resetar algoritmo',
        data: null,
      };
    }
  },

  // Obter livros curtidos pelo usuário
  async obterLivrosCurtidos(idUsuario) {
    try {
      const response = await api.get(`/livros-curtidos/usuario/${idUsuario}`);

      // Se retornar 204 (No Content), significa que não há livros curtidos
      if (response.status === 204) {
        return {
          success: true,
          data: [],
          message: 'Nenhum livro curtido encontrado',
        };
      }

      return {
        success: true,
        data: response.data,
        message: 'Livros curtidos obtidos com sucesso!',
      };
    } catch (error) {
      // Se erro 404 ou 204, retorna lista vazia ao invés de erro
      if (error.response?.status === 404 || error.response?.status === 204) {
        return {
          success: true,
          data: [],
          message: 'Nenhum livro curtido encontrado',
        };
      }

      return {
        success: false,
        error: error.message || 'Erro ao obter livros curtidos',
        data: null,
      };
    }
  },

  // Curtir um livro
  async curtirLivro(idUsuario, idLivro) {
    try {
      const response = await api.post(
        `/livros-curtidos/curtir?usuarioId=${idUsuario}&livroId=${idLivro}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro curtido com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao curtir livro',
        data: null,
      };
    }
  },

  // Descurtir um livro
  async descurtirLivro(idUsuario, idLivro) {
    try {
      const response = await api.delete(
        `/livros-curtidos/descurtir?usuarioId=${idUsuario}&livroId=${idLivro}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro removido dos curtidos!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao remover livro dos curtidos',
        data: null,
      };
    }
  },

  // Verificar se um livro está curtido
  async verificarLivroCurtido(idUsuario, idLivro) {
    try {
      const response = await api.get(`/livros-curtidos/usuario/${idUsuario}/livro/${idLivro}`);
      return {
        success: true,
        data: response.data,
        message: 'Status verificado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao verificar status do livro',
        data: { curtido: false },
      };
    }
  },

  // Contar livros curtidos
  async contarLivrosCurtidos(idUsuario) {
    try {
      const response = await api.get(`/livros-curtidos/usuario/${idUsuario}/contador`);
      return {
        success: true,
        data: response.data,
        message: 'Contador obtido com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao obter contador de livros curtidos',
        data: { total: 0 },
      };
    }
  },
};

// Serviços de livros
export const livroService = {
  // Criar novo livro
  async criar(livroData) {
    try {
      const response = await api.post('/livro/create', livroData);
      return {
        success: true,
        data: response.data,
        message: 'Livro adicionado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao adicionar livro',
        data: null,
      };
    }
  },

  // Buscar todos os livros
  async buscarTodos() {
    try {
      const response = await api.get('/livro/all');
      return {
        success: true,
        data: response.data,
        message: 'Livros carregados!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar livros',
        data: [],
      };
    }
  },

  // Buscar livro por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/livro/get?id=${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Livro encontrado!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar livro',
        data: null,
      };
    }
  },

  // Atualizar livro
  async atualizar(livroData) {
    try {
      const response = await api.put('/livro/update', livroData);
      return {
        success: true,
        data: response.data,
        message: 'Livro atualizado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar livro',
        data: null,
      };
    }
  },
};
