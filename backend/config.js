//All the configurations required like portNumber, Database Connection URl etc are stored to provide a low level encapsulation
module.exports = {
  database: process.env.DATABASE_URL,  
  port: process.env.PORT || 3000,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  stripePrivate: process.env.STRIPE_PRIVATE_KEY,
};