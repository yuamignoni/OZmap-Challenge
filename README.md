# OZmap Challenge: Construindo a Geolocalização do Futuro

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar usuários e localizações. Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 20 ou superior.
- **Banco de Dados**: Mongo 7+.
- **ORM**: Mongoose / Typegoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.
- **Comunicação com MongoDB**: Deve ser feita via container.

## 🔍 **Funcionalidades Esperadas**

### Usuários
- **CRUD** completo para usuários.
- Cada usuário deve ter nome, email, endereço e coordenadas.
- Na criação, o usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
- Uso de serviço de geolocalização para resolver endereço ↔ coordenadas.
- Atualização de endereço ou coordenadas deve seguir a mesma lógica.

### Regiões
- **CRUD** completo para regiões.
- Cada região tem um nome, coordenadas e um usuário que será o dono da região.
- Listar regiões contendo um ponto específico.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.

### Autenticação
- Autenticação não é necessária.
- Contudo, aceite requests identificando o solicitante.

### Testes
- Unitários e de integração.

## 🌟 **Diferenciais**

- Interface básica de usuário.
- Documentação completa da API.
- Internacionalização.
- Cobertura de código.

## ⚖ **Critérios de Avaliação**

1. Organização e clareza do código.
2. Estruturação do projeto.
3. Qualidade e eficiência do código.
4. Cobertura e qualidade de testes.
5. Pontos diferenciais citados acima.
6. Tempo de entrega.
7. Padronização e clareza das mensagens de erro.
8. Organização dos commits.
9. Implementação de logs.
10. Adesão às boas práticas de API RESTful.

## 🚀 **Entrega**

1. Faça um fork deste repositório.
2. Crie uma branch com o padrão `seu-nome-sobrenome`.
3. Ao finalizar, faça um pull request para a branch `main` deste repositório.
4. Envie um email `rh@ozmap.com.br` informando que o teste foi concluído.
5. Aguarde nosso feedback.

---

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você! 🚀
