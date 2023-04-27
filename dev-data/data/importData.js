const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tours = require('./../../models/tourModels');
const Users = require('./../../models/userModels');
const Reviews = require('./../../models/reviewModels');

dotenv.config({ path: './conifg.env' });
console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(console.log('success!'));
const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
// console.log(tour);
const importData = async () => {
  try {
    await Tours.create(tour, { validateBeforeSave: false });
    await Users.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews, { validateBeforeSave: false });
    console.log('data inserted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tours.deleteMany();
    await Users.deleteMany();
    await Reviews.deleteMany();
    console.log('data deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
