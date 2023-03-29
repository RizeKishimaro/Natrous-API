const Users = require('../models/userModels');
const AppErrors = require('../utils/appErrors');
const catchAsync = require('../utils/catchError');
const { allowedRole } = require('./authControllers');
const filterObj = (obj, ...fields) => {
  let filteredObj = {};
  Object.keys(obj).forEach((val) => {
    if (fields.includes(val)) {
      filteredObj[val] = obj[val];
    }
  });
  return filteredObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: users,
  });
});
exports.deleteUserData = catchAsync(async(req,res,next)=>{
  console.log(req.user.id)
  await Users.findByIdAndUpdate(req.user.id,{ active: false});
  res.status(204).json({
    status: "success"
  })
})
exports.updateUserData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppErrors(
        "If you're trying to update your password.You should use /updatePassword route",
        302
      )
    );
  }
  console.log(req.body);
  console.log(req.user);
  const filteredObject = filterObj(req.body, 'name', 'email');
  console.log(filteredObject);
  const updatedUser = await Users.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    user: updatedUser,
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
