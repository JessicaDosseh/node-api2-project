const express = require('express'); 
const server = express();
const postsRouter = require('./routes/postsRouter'); 
const commentsRouter = require('./routes/commentsRouter'); 

server.use(express.json()); 

server.use('/api/posts', postsRouter); 
server.use('/api/comments', commentsRouter);

server.get('/', (req, res) => {
  res.status(200).send(`
    <h2>Post API</h2>
    <p>Welcome to the post API</p>
  `);
});

module.exports = server; 