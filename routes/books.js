const express = require('express');
const router = express.Router();
let auth = require('../services/authentication');
require('dotenv').config();
const axios = require('axios');
let checkRole = require('../services/checkRole');

// Endpoint

const api = 'http://54.167.117.206:8000/livro';

// Obter todos os livros


const itemsPerPage = 6;

router.get('/', auth.authenticateToken, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const apiRequestUrl = `${api}?page=${page}`;

        const response = await axios.get(apiRequestUrl);
        const data = response.data;

        // Server-side pagination logic
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        const paginatedData = data.slice(startIndex, endIndex);

        res.status(200).json({
            currentPage: page,
            totalPages: data.length ,
            per_page: itemsPerPage,
            data: paginatedData,
            alldata: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from the external API' });
    }
});

// Obter livros por id

router.get('/getbyid/:id', auth.authenticateToken, async (req, res) => {
   
    try {
      const bookId = req.params.id;
  
      const response = await axios.get(`${api}/${bookId}`);

      res.status(200).json({
        data: response.data
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error when searching for book by ID in the external API' });
    }
  });
  
// Criar livros

router.post('/add', auth.authenticateToken,checkRole.checkRole, async (req, res) => {
       
  
    try {
      const { nome, nomeDoAutor, lancamento, 
        tipo, genero, editora, anoEdicao, numEdicao} = req.body; // Ajuste conforme a estrutura do seu livro
  
      const requestData = {
    
        nome: nome,
        nomeDoAutor: nomeDoAutor,
        lancamento: lancamento,
        tipo: tipo,
        genero: genero,
        editora: editora,
        anoEdicao: anoEdicao,
        numEdicao: numEdicao

      };

      const response = await axios.post(api+'/', requestData);
  
      res.status(200).json({
        message: 'Livro criado com sucesso',
        createdBook: response.data
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating book in external API' });
    } 
  });

  // Editar livros

  router.patch('/edit/:id', auth.authenticateToken,checkRole.checkRole, async (req, res) => {
    try {
      const bookId = req.params.id;
      const { nome, nomeDoAutor, lancamento, 
        tipo, genero, editora, anoEdicao, numEdicao} = req.body; // Ajuste conforme a estrutura do seu livro
  
      const requestData = {

        nome: nome,
        nomeDoAutor: nomeDoAutor,
        lancamento: lancamento,
        tipo: tipo,
        genero: genero,
        editora: editora,
        anoEdicao: anoEdicao,
        numEdicao: numEdicao

      };


      const response = await axios.patch(`${api}/${bookId}/`, requestData);

  
      res.status(200).json({
        message: 'Livro atualizado com sucesso',
        data: response.data
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating book in external API' });
    }
  });


  // Deletar livros

  router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    try {
      const bookId = req.params.id;
      
      const response = await axios.delete(`${api}/${bookId}/`);
      
      console.log(response);

      res.status(200).json({
        message: 'Livro excluído com sucesso',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao excluir o livro na API externa' });
    }
  });
  
 
  module.exports = router;