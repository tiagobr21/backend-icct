const express = require('express');
const router = express.Router();
var auth = require('../services/authentication');
require('dotenv').config();
const axios = require('axios');
// const jwt = require('jsonwebtoken');
// var checkRole = require('../services/checkRole');


// Obter todos os livros

const api = 'http://54.167.117.206:8000/livro/';
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

module.exports = router;