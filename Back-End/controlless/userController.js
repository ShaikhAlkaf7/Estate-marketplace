const Listing = require("../models/listingModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// update user profile
const updateUserController = async (req, res) => {
  try {
    const reqUser = req.user;
    // getting user data form body
    const { userName, email } = req.body;
    if (userName.length <= 0 || email.length <= 0) {
      res.status(404).send({
        success: false,
        message: "All fileds are required",
      });
      return;
    }

    const filterUserName = userName?.trim().replace(" ", "-");

    // first we check userExistsd or not
    const checkUser = await User.findById(reqUser.id);

    // sending response if user not found
    if (!checkUser)
      return res.status(404).send({
        success: false,
        message: "User not found plese sign-out and sign-in",
      });

    // updating user info in db
    const user = await User.findByIdAndUpdate(
      reqUser.id,
      {
        userName: filterUserName,
        email,
      },
      { new: true }
    );

    if (!user) return res.send({ message: "User Updation failed" });
    res.status(200).send({
      success: true,
      message: "User updated Success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while updating user",
    });
  }
};

// delete user profiel
const deleteUserController = async (req, res) => {
  try {
    // getting user id from req.user for delete user
    const user = req.user.id;

    // first we check userExistsd or not
    const checkUser = await User.findById(user);

    // sending response if user not found
    if (!checkUser)
      return res.status(404).send({
        success: false,
        message: "User not found ",
      });

    // sending request for deletation
    const deletedUser = await User.findByIdAndDelete(user);

    // checking user delete or not
    if (!deletedUser)
      return res.status(404).send({
        success: false,
        message: "User deletation failed",
      });
    res.status(200).send({
      success: true,
      message: "User deleted success",
      deletedUser,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Erroer while delete user",
      error: error.message,
    });
  }
};

// gettig user listings
const getUserListings = async (req, res) => {
  try {
    // getting user for search all listings
    const user = req.user.id;

    // searching the listing who are this user created
    const listings = await Listing.find({ userRef: user });
    if (!listings) {
      res.status(404).send({
        success: false,
        message: "Listings are not found",
      });
      return;
    }

    // sending the normal response
    res.status(200).send({
      success: true,
      message: "Listings found successfully",
      listings,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while getting listings",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    // fetching user
    const user = await User.findById(req.params.id).select("-password");

    // validating user found or not
    if (!user)
      return res.send({
        success: false,
        message: "User not found",
      });

    res.status(200).send({
      success: true,
      message: "User fetch successfully",
      user,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while fectchin use ",
      error: error.message,
    });
  }
};

module.exports = {
  updateUserController,
  deleteUserController,
  getUserListings,
  getUser,
};
