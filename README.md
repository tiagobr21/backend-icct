** IMPORTANTE: O FRONT-END DEVE ESTÁ NO AR PARA PODER CRIAR O USUÁRIO DO SISTEMA NO PASSO 4 **

1.**Clonar o Projeto:**
 
 * Para clonar o projeto execute o seguinte comando:

    ```
     git clone git@github.com:tiagobr21/backend-icct.git
     
     ```

2.**Instalando Dependências:**

 * A Segunda etapa consiste em instalar as dependências do projeto. Execute o comando a seguir para criar a pasta 'node_modules':
      
     ```
     npm install 
     
     ```
    
3. **Iniciando o Ambiente Docker:**

  * Após a instalação das dependências, inicie o serviço utilizando o seguinte comando para levantar o ambiente Docker:     
     
     ```
     sudo service docker start
     
     docker-compose up -d
     
     ```

4. **Criar tabela usuários:**

  * Identifique o ID do container do PostgreSQL usando o comando:
    
     ```
     docker ps
     
     ```

  * Acesse o container do PostgreSQL com o comando:
    
     ```
     docker exec -it [ID_CONTAINER] bash
     
     ```

  * substituindo `[ID_CONTAINER]` pelo ID do container obtido no passo anterior.

  * Dentro do container, acesse o banco de dados executando o comando 
     
    ```
    psql -U root -d icct -h db -p 5432

    ```
   * Insira a senha (password)

   * Ao entrar no banco icct vamos criar a tabela users:
     
     ```
     CREATE TABLE "users" (
         id SERIAL PRIMARY KEY NOT NULL,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL,
         role VARCHAR(50) NOT NULL
     );
     
     ```

   * Agora crie um usuário:

     ```
      INSERT INTO users (name, email, password, role) VALUES ('Seu_Nome', 'Seu_Email','Sua_Senha','admin');
     ```
   
         obs: * no caso o id será 1 pois é o primeiro usuário.
              * o sudo deve ser usado no caso do docker ou npm não tiverem permissões.
              * não esquecer do ; no Postgresql 
