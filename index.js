const express = require('express');
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');

const app = express();

let client;

async function connectToElasticsearch() {
  try {
    client = new Client({
      node: 'http://localhost:9200',
    });
    await client.ping();
  
  } catch (error) {
    throw error;
  } 
}

async function indexLog(message) {
  try {
    if (!client) {
      await connectToElasticsearch(); // Estabelece a conexão se ainda não foi feita
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message
    };

    const { body: response } = await client.index({
      index: 'logs_index',
      body: logEntry
    });

  } catch (error) {
    console.error('Erro ao indexar o log:', error);
  }
}

// Rota principal para processar os dados dos usuários
app.get('/', async (req, res) => {
  try {
    const users = await fetchUserData();

    // 1. Mostrar os websites de todos os usuários
    const websites = users.map(user => user.website);

    // 2. Mostrar o nome, email e a empresa em que trabalha de todos os usuários, ordenados em ordem alfabética
    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    const userDetails = sortedUsers.map(user => ({
      Nome: user.name,
      Email: user.email,
      Empresa: user.company.name
    }));

    // 3. Mostrar todos os usuários cujo endereço contém a palavra "suite"
    const usersWithSuiteAddress = users.filter(user => user.address.suite.toLowerCase().includes('suite'));

    const responseData = {
      websites,
      userDetails,
      usersWithSuiteAddress
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
});

// Função para fazer a solicitação e obter os dados dos usuários
async function fetchUserData() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    throw error;
  }
}

if (require.main === module) {
  const port =  3000;

  app.listen(port, () => {
    indexLog('Exemplo de mensagem de log.');
  });
}

module.exports = { fetchUserData }; 



