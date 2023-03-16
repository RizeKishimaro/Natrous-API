const Admin = require('../models/adminModels');
exports.checkLogin = (req, res) => {
  Admin.findOne(
    { name: req.body.name, password: req.body.password },
    (err, result) => {
      console.log(req.body);
      if (err) {
        return res.status(400).json({
            status: 'Error',
            message: 'Server has encounter an error',
            serverMessage: err,
          });
      }
      if (!result) {
        return res.status(400).json({
          status: 'failed',
          message: 'Login Failed',
          serverMessage: result,
        });
      }
      res.status(200).json({
        status: 'success',
        message: `You're successfully logged in as ${result.name} and your password is ${result.password}`,
      });
    }
  );
};
exports.hintShower = (req, res) => {
  res.status(206).send("I'm admin i want to be a `postman` and `JSON?`");
};
exports.checkFlag = (req, res) => {
  Admin.findOne({ flag: req.body.flag }, (err, result) => {
    if (err) {
      return err;
    }
    if (!result) {
      return res.status(400).json({
        status: 'failed',
        message: 'Sussy flag provided',
      });
    }
    console.log(result);
    res.status(200).json({
        status: "Success",
        message: "The flag you provided is correct",
        flag: result
    })
  });
};
