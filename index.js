const app = require('./server.js');
const port = 4000; 
app.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
}); 