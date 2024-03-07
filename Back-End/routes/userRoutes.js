const express = require("express");
const { isAuthenticated } = require("../utils/protected");
const {
  updateUserController,
  deleteUserController,
  getUserListings,
  getUser,
} = require("../controlless/userController");

const router = express.Router();

// updating profile
router.put("/update/profile", isAuthenticated, updateUserController);

// delete profile
router.delete("/delete-profile", isAuthenticated, deleteUserController);

// getting all listigs of user are listed
router.get("/listings", isAuthenticated, getUserListings);

router.get("/:id", isAuthenticated, getUser);
module.exports = router;
