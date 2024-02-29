1.**Instalando Dependências:**

 * A primeira etapa consiste em instalar as dependências do projeto. Execute o comando a seguir para criar a pasta 'node_modules':

     npm install 
    
2. **Iniciando o Ambiente Docker:**

  * Após a instalação das dependências, inicie o serviço utilizando o seguinte comando para levantar o ambiente Docker:     
     
     docker-compose up -d

3. **Criar tabela usuários:**

  * Identifique o ID do container do PostgreSQL usando o comando 
    
     docker ps

  * Acesse o container do PostgreSQL com o comando 

     docker exec -it [ID_CONTAINER] bash
     
  * substituindo `[ID_CONTAINER]` pelo ID do container obtido no passo anterior.

