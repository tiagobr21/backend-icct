const express = require('express');
const connection =require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');
const nodemailer = require('nodemailer');
let fs = require('fs');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { log } = require('console');



// Registrar Usuário

router.post('/register', async (req, res) => {
    try {
        let users = req.body;
        let query = "SELECT email FROM users WHERE email = $1 ";

        // Verificar se email existe
        const emailCheckResults = await connection.query(query, [users.email]);

        if (emailCheckResults.rows.length === 0) {
            // Criar o hash
            const hashedPassword = await bcrypt.hash(users.password, 10);


            // Criar usuário na base de dados
            const insertQuery = "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, 'user')";
            const insertResults = await connection.query(insertQuery, [users.name, users.email, hashedPassword]);

            return res.status(200).json({ message: "Usuário cadastrado com sucesso !!!" });
        } else {
            return res.status(400).json({ message: "Email já Existe." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});


// Autenticar Usuário 

router.post('/login', async (req, res) => {
    try {

        const users = req.body;
        let query = "SELECT id, name, email, password, role FROM users WHERE email = $1";

        // Fetch user from the database
        const results = await connection.query(query, [users.email]);
       

        if (results.rows.length == 0 || !await bcrypt.compare(users.password, results.rows[0].password)) {
            return res.status(401).json({ message: "Usuário ou Senha Incorreto" });
        }  else {
            const response = { email: results.rows[0].email, role: results.rows[0].role };
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });

            return res.status(200).json({
                message: 'Usuário ' + results.rows[0].name + ' logado com sucesso',
                id: results.rows[0].id,
                name: results.rows[0].name,
                email: results.rows[0].email,
                role: results.rows[0].role,
                token: accessToken
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// Buscar todos os usuários


router.get('/', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    const itemsPerPage = 2;
    const currentPage = req.query.page || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    try {
        const query = `SELECT id, name, email, password, role FROM users LIMIT ${itemsPerPage} OFFSET ${offset}`;
        connection.query(query, (err, results) => {
            if (!err) {
                connection.query('SELECT COUNT(*) FROM users', (err, countResult) => {
            
                    if (!err && countResult && countResult.rows) {

                        const totalCount = countResult.rows[0].count;

                        const totalPages = Math.ceil(totalCount / itemsPerPage);

                        res.status(200).json({
                            currentPage: currentPage,
                            totalPages: totalPages,
                            per_page: itemsPerPage,
                            data: results,
                            totalCount: totalCount
                        });
                    } else {
                        console.error(err);
                        res.status(500).json({ error: 'Error retrieving total count from the database' });
                    }
                });
            } else {
                console.error(err);
                res.status(500).json({ error: 'Error querying the database' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Buscar por usuário

router.get('/:id',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let id = req.params.id;
  
    let query = "SELECT * FROM users WHERE id= $1";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.rows.length == 0){
                res.status(404).json({message:'id não encontrado'});
            }
            return res.status(200).json(results.rows[0]);
        }else{
            res.status(500).json(err);
        }
    });
});

// Atualizar Usuário

router.patch('/:id', auth.authenticateToken, checkRole.checkRole, async (req, res) => {


    try {
        let id = req.params.id;
        let users = req.body;

        // Check if the user with the given id exists
        const checkUserQuery = "SELECT * FROM users WHERE id = $1";
        const userCheckResults = await connection.query(checkUserQuery, [id]);
       

        if (userCheckResults.rows.length == 0) {
            return res.status(404).json({ message: "O Usuário não existe." });
        }

        const updateQuery = "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4";


        await connection.query(updateQuery, [users.user.name, users.user.email, users.user.role, id]);

        return res.status(200).json({ message: "Usuário Atualizado com Sucesso!!!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// Deletar Usuário

router.delete('/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let id = req.params.id;
    let query = 'delete from users where id = $1';
    connection.query(query, [id], (err, results) => {

        if (!err) {
            if (results.rowCount == 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            } else {
                return res.status(200).json({ message: 'Usuário deletado com sucesso !!!' });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/sendemail',(req,res)=>{
    
    const transport = nodemailer.createTransport({
        host:'smtp.office365.com',
        port: 587,
        secure: false,
        auth:{
            user:'paroquiasantateresinhatest@outlook.com',
            pass:'Bondade07!'
        }
    })
    var mailOptions = {
        from: 'Sistema Santa Teresinha <paroquiasantateresinhatest@outlook.com>',
        to: 'paroquiasantateresinhatest@outlook.com',
        subject: 'Senha do Sta',
        html: '<p> <b> Seu Login da Sta</b> <br> <b>Email:</b>'+'paroquiasantateresinhatest@outlook.com'+'<br> <b>Senha:</b> '+'paroquiasantateresinhatest@outlook.com'+' <br> <a href="http://localhost:4200/"> Clique aqui para Entrar </a>  </p>',
        text: 'Olá , test'
      }
      transport.sendMail(mailOptions,function(error,info){
          if(error){
              console.log(error);
          }else{
              console.log('Email enviado: '+info.response);
          }
      }); 
});



router.post('/forgotpassword',(req,res)=>{ 
    const users = req.body;
    let query = "select email,password from users where email=?";
    connection.query(query,[users.email],(err,results)=>{
        if(!err){
            console.log(results);
             if(results.length <= 0){
               return res.status(200).json({message: "Recuperação de senha enviado com sucesso para seu email !!!"});
            }else{
                const transport = nodemailer.createTransport({
                    host:'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth:{
                        user:'santateresinhamanaus@gmail.com',
                        pass:'mmsibnoqnfmlvgzw'
                    }
                })
                var mailOptions = {
                  from: 'Sistema Santa Teresinha <santateresinhamanaus@gmail.com>',
                  to: results[0].email,
                  subject: 'Recuperação de Senha',
                  html: '<p> <b> Seu Login da Sta</b> <br> <b>Email:</b>'+results[0].email+'<br> <b>Senha:</b> '+results[0].password+' <br> <a href="https://front-sta.herokuapp.com/login"> Clique aqui para Entrar </a>  </p>',
                  text: 'Olá , test'
                }
                transport.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email enviado: '+info.response);
                        res.status(200).json({message: "Recuperação de senha enviado com sucesso para seu email !!!"});
                    }
                }); 
                
            }
        }else{
            res.status(500).json(err)
        }
    })
})      





router.post('/changePassword',auth.authenticateToken,(req,res)=>{
    const users = req.body;
    const email = res.locals.email;
    console.log(email)
    let query = "select * from users where email=? and password=?";
    connection.query(query,[email,users.oldPassword],(err,results)=>{
        if(!err){
           if(results.length <=0){

             return res.status(400).json({message:"Senha atual incorreta!"});

           }else if(results[0].password == users.oldPassword){
               let query = "update users set password=? where email=?";
               connection.query(query,[users.newPassword,email],(err,results)=>{
                  if(!err){
                      return res.status(200).json({message:"Senha trocada com sucesso !!!"})
                  }else{
                    return res.status(500).json(err)
                  }
               }) 
           }else{
              return res.status(400).json({message:"Alguma coisa aconteceu errado. Por favor tente novamente mais tarde"});
           }

        }else{
            return res.status(500).json(err);
        }
    })
})



// Foto de perfil

router.patch("/uploadimage/:id",  (req,res)=>{
    console.log(req.file);

     let url = req.file.location;
     let id = req.params.id;
     let query = 'update users set url = ? where id = ? ';

    
     connection.query(query,[url,id],(err,results)=>{
        if(!err){
          return res.status(200).json({message:'Imagem carregada com sucesso!'})
        }else{
          return res.status(500).json(err);
        }
    }); 
    
 });

 router.get("/getimage/:id",auth.authenticateToken,(req,res)=>{

    let id = req.params.id;
    let query= 'select url from users where id = ? ';
   
        connection.query(query,[id],(err,results)=>{
            if(!err){
                return res.status(200).json(results)
            }else{
                return res.status(500).json(err);
            } 
        })
   
});

 router.delete('/deleteimage/:id',auth.authenticateToken,(req,res)=>{
    
    let id = req.params.id;
    let queryImage = 'update users set url = null where id = ?';
    let queryurl = 'select url from users where id = ?';
    console.log(id )
        connection.query(queryurl,[id],(err,url)=>{
               connection.query(queryImage,[id],(err,results)=>{
                if(!err){
                    if(results.affectedRows == 0){
                        res.status(404).json({message:"Usuário não encontrado"})
                    }
                    res.status(200).json({message:"Imagem deletada com sucesso !!!"})

                    fs.rm(`tmp/uploads/${url[0].url}`, { recursive:true }, (err) => {
                        if(err){
                            // File deletion failed
                            console.error(err.message);
                            return;
                        }
                        console.log("File deleted successfully");
                    })
               
                }else{
                    res.status(500).json(err)
                }
            });   
        });
 });
 


module.exports = router;