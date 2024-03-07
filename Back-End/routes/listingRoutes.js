const express = require("express");
const { isAuthenticated } = require("../utils/protected");
const {
  createListingController,
  deleteListingController,
  updateListingController,
  fetchListingController,
  getListingsController,
} = require("../controlless/listingController");

const router = express.Router();

// creating the listing
router.post("/create", isAuthenticated, createListingController);

// delete the listing
  router.delete("/delete/:id", isAuthenticated, deleteListingController);

// update the listing
router.put("/update/:id", isAuthenticated, updateListingController);

// fetching single listing
router.get("/get/:id", fetchListingController);

// search listing functionlity
router.get("/get", getListingsController);

module.exports = router;
