const axios = require('axios');
const { fetchUserData } = require('../index');

jest.mock('axios');

describe('fetchUserData', () => {
    it('busca os dados do usuário com sucesso na API', async () => {
      const mockResponse = [
        { id: 1, name: 'João da Silva', email: 'joao@example.com', website: 'https://joao.com', address: { suite: 'Suite A' }, company: { name: 'Company A' } },
        { id: 2, name: 'Maria Oliveira', email: 'maria@example.com', website: 'https://maria.com', address: { suite: 'Suite B' }, company: { name: 'Company B' } }
      ];
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      const users = await fetchUserData();
      expect(users).toEqual(mockResponse);
    });
  
    it('lança um erro quando a busca dos dados do usuário falha', async () => {
      axios.get.mockRejectedValueOnce(new Error('Falha ao buscar os dados do usuário'));
      await expect(fetchUserData()).rejects.toThrow('Falha ao buscar os dados do usuário');
    });
}); 

