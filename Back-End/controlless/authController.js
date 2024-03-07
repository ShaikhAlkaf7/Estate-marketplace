const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register signUp
const signUpController = async (req, res) => {
  try {
    // getting user data form body
    const { userName, email, password } = req.body;

    if (userName?.length <= 0 || email?.length <= 0 || password?.length <= 0)
      return res.send({
        success: false,
        message: "All filds are required",
      });

    const filterUserName = userName?.trim()?.replace(" ", "-");
    // first we check user already exists or not by email
    const checkUserByEmail = await User.find({ email: email });
    if (checkUserByEmail.length > 0)
      return res.status(200).send({
        success: false,
        message: "This email already exsists",
      });

    // first we check user already exists or not by email
    const checkUserByUserName = await User.find({ userName: userName });
    if (checkUserByUserName.length > 0)
      return res.status(200).send({
        success: false,
        message: "This UserName already exsists",
      });

    const hashedPassword = bcrypt.hashSync(password, 12);
    // saving user info in db
    const user = await new User({
      userName: filterUserName,
      email,
      password: hashedPassword,
    }).save();
    if (!user) return res.send({ message: "User register failed" });
    res.status(200).send({
      success: true,
      message: "User Created Success",
      user,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Err while creating User",
      error: error.message,
    });
  }
};

// signIn or login
const signinController = async (req, res) => {
  try {
    // getting data from body
    const { email, password } = req.body;

    if (email?.length <= 0 || password?.length <= 0)
      return res.send({
        success: false,
        message: "All filds are required",
      });

    // validating user exist or lnot
    const checkUser = await User.findOne({ email });
    // console.log(checkUser);
    if (!checkUser || checkUser.length <= 0)
      return res
        .status(404)
        .send({ success: false, message: "User not exist please sign up" });

    // comparing password
    const checkPassword = bcrypt.compareSync(password, checkUser.password);
    if (!checkPassword)
      return res
        .status(401)
        .send({ success: false, message: "Incorrect email or password" });

    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECREAT_KEY);
    res.status(200).send({
      success: true,
      message: "signin successfully",
      user: {
        userName: checkUser.userName,
        email: checkUser.email,
        _id: checkUser._id,
      },
      token,
    });
    // res.cookie("token", token);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Err while sign IN",
      error: error.message,
    });
  }
};
module.exports = { signUpController, signinController };
