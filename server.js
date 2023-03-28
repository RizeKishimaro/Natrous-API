const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException', (error) => {
  console.log(error.name, error.message);
  console.log('uncaught error occur the server is shutting down!');
  process.exit(1);
});
dotenv.config({ path: './conifg.env' });
const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('connection is success!');
  });
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message);
  console.log('Error Occur Shutting down the Server');
  server.close(() => {
    process.exit(1);
  });
});
