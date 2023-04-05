const { promisify } = require('util');
const crypto = require('crypto');
const Users = require('./../models/userModels');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchError');
const AppErrors = require('../utils/appErrors');
const sendEmail = require('../email');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const sendJwtToken = (user,status,res)=>{
  const token = signToken(user._id);
  const cookieOptions = {
    expires: Date.now()+ process.env.JWT_EXPIRES_IN * 60 * 60 * 1000,
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.password = undefined;
  res.cookie("jwt",token,cookieOptions)
  res.status(status).json({
    status: 'success',
    message: 'Natsume: Yay!Your Your request is being processed',
    token,
    user: user,
  });
}
exports.signUpUser = catchAsync(async (req, res, next) => {
  const newUser = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  sendJwtToken(newUser,201,res)
});
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = { ...req.body };
  //1st
  if (!email || !password) {
    return next(new AppErrors('Need Email or Password!', 400));
  }

  //2nd step
  const user = await Users.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppErrors('Yuri: Dear!Invalid Username or Password!', 400));
  }
  sendJwtToken(user,200,res)
});
exports.protect = catchAsync(async (req, res, next) => {
  let token = '';
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppErrors('Yuri: Dear User!You are not authorized!Please login', 401));
  }

  const jwtAuth = await promisify(jwt.verify)(token, process.env.JWT_KEY).catch(
    function (err) {
      console.log(err);
      return new AppErrors('Yuri: Dear!Invalid JWT Key Format', 400);
    }
  );
  const freshUser = await Users.findById(jwtAuth.id);
  if (!freshUser) {
    return next(new AppErrors('Yuri: Dear!Your account has been deleted or expired', 401));
  }
  
  if (freshUser.changePasswordAfter(jwtAuth.iat)) {
    return next(
      new AppErrors('Yuri: Mister!The password has being changed!Login Again', 401)
    );
  }
  req.user = freshUser;
  next();
});
exports.allowedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErrors("Monika: Hey!This Room is for Literature Club leaders!", 403)
      );
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  //find the email is valid
  const userEmail = await Users.findOne({ email: req.body.email });
  if (!userEmail) {
    return next(new AppErrors('Yuri: FuFuFu!The email is not exist.', 404));
  }
  //create password reset token
  const resetToken = userEmail.createPasswordResetToken();

  await userEmail.save({ ValidateBeforeSave: false });

  //send email!
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `
  <!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Your email title</title>
</head>
<body>
Forget your Password?\nDon't worry This is usually happen.<a href="${resetURL}">Reset Password</a>\nPlease click the above link and reset password.\nIf you're not please ignore this email.\nIf you requested?Then Hurry it's '10 minutes' valid.
</body>
</html>`;

  try {
    await sendEmail({
      email: userEmail.email,
      subject: 'Forget Password?Easy!Reset it.',
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Natsume: Your password reset link is sent to your email!"
    })
  } catch (error) {
    userEmail.passwordResetToken = undefined;
    userEmail.passwordResetTokenExpires = undefined;
    await userEmail.save({ ValidateBeforeSave: false });
    return next(
      new AppErrors(
        "Monika: Sorry.We'd encountered some errors.Please Try Again Later.",
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //STEP 1) compare the requested token with database token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(hashedToken);
  const verifiedUser = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  //STEP 2) check the token is valid or expires
  console.log(verifiedUser);
  if (!verifiedUser) {
    return next(new AppErrors('Yuri: Your Token is invalid or Expired', 406));
  }

  verifiedUser.password = req.body.password;
  verifiedUser.passwordConfirm = req.body.passwordConfirm;
  verifiedUser.passwordResetToken = undefined;
  verifiedUser.passwordResetTokenExpires = undefined;
  verifiedUser.save();

  //STEP 3) Update the user password

  //STEP 4) Set the JWT token and let the user login.
  sendJwtToken(verifiedUser,200,res)
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //check the JWT auth token if the user is permission
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppErrors('Yuri: You are not authorize!Please Login!', 403));
  }
  const jwtKey = await promisify(jwt.verify)(token, process.env.JWT_KEY).catch(
    (error) => {
      return next(new AppErrors('Yuri: Token is invalid', 400));
    }
  );
  console.log(jwtKey);

  //find the user according to it's data
  const currentUser = await Users.findById(jwtKey.id).select("+password");
  
  console.log(await currentUser.checkPassword(req.body.password,currentUser.password))
  //check the user password
  if(!await currentUser.checkPassword(req.body.password,currentUser.password)){
    return next(new AppErrors("Yuri: Sorry The password is invalid",403))
  }
  currentUser.password = req.body.newPassword
  currentUser.passwordConfirm = req.body.passwordConfirm
  await currentUser.save();
  sendJwtToken(currentUser,200,res)
});
