// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const index = require('./server/routes/app');
const mongoose = require('mongoose');

const messageRoutes = require('./server/routes/messages'); 
const contactRoutes = require('./server/routes/contacts'); 
const documentsRoutes = require('./server/routes/documents'); 

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(logger('dev'));

// CORS support
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

// Serve static files from Angular app
app.use(express.static(path.join(__dirname, '../dist/cms/browser')));

// Routing
app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentsRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cms', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { 
    console.log('Connected to database!'); 
  })
  .catch(err => { 
    console.log('Connection failed: ' + err); 
  });

const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Initialize sequence generator and start server
const sequenceGenerator = require('./server/routes/sequenceGenerator');

sequenceGenerator.init()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize sequence generator:', err);
    process.exit(1);
  });

// Wildcard route to serve Angular index.html for any other route
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});  
