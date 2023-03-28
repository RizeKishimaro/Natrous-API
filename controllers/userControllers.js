const Users = require("../models/userModels");
const catchAsync = require("../utils/catchError");
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: users,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({ message: 'This route will be defined in Future' });
};
exports.getUser = (req, res) => {
  res.status(500).json({ message: 'This route will be defined in Future' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ message: 'This route will be defined in Future' });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({ message: 'This route will be defined in Future' });
};
