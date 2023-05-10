require('dotenv').config();
//node Packages
const path = require('path');

//3rd party packages
const express = require('express');
const morgan = require("morgan");
const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

const mainAdminRoutes = require('./routes/main-admin');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//Setting up the app and database
const app = express();

// const store = new MongoDBStore({
//   uri: config.database,
//   collection: 'sessions',
// })


//Express application using required packages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan("dev"));
app.use(cors({
  credentials:true,
  origin:["http://localhost:4200"]
}));
app.use(helmet());

app.use((error,req,res,next)=> {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
})

//Express application using Routes from from this app
app.use("/api/main-admin",mainAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shop",shopRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'built/public', 'index.html'))
})
  
//Setting up the port for the server to run on
mongoose.connect(config.database,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(result =>{
  const server = app.listen(config.port);
  const io = require('./socket').init(server);
  io.on('connection', (socket) => {
    console.log('Client connected');
  });
  console.log('Mongoose Init: Success');
})
.catch(err =>{
  console.log(err);
})
  
  