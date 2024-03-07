const Listing = require("../models/listingModel");

// create the listing
const createListingController = async (req, res) => {
  try {
    // getting data from req.body
    const {
      name,
      description,
      address,
      regularPrice,
      discountedPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrl,
    } = req.body;
    const userRef = req.user.id;
    // validating the data
    if (
      (!name && name?.length <= 0) ||
      (!description && description?.length <= 0) ||
      (!address && address?.length <= 0) ||
      (!regularPrice && regularPrice?.length <= 0) ||
      (!bathrooms && bathrooms?.length <= 0) ||
      (!bedrooms && bedrooms?.length <= 0) ||
      (!furnished && furnished?.length <= 0) ||
      (!parking && parking?.length <= 0) ||
      (!type && type?.length <= 0) ||
      (!offer && offer?.length <= 0) ||
      (!imageUrl && imageUrl?.length <= 0) ||
      (!userRef && userRef?.length <= 0)
    ) {
      res.send({
        success: false,
        message: "All filds are required",
      });
      return;
    }

    // sending request for creating listig
    const listing = await new Listing({
      name,
      description,
      address,
      regularPrice,
      discountedPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrl,
      userRef,
    }).save();

    res.status(201).send({
      success: true,
      message: "Listing created Succcessfully",
      listing,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while creatinig listing",
      error: error.message,
    });
  }
};

// delete the listing by id
const deleteListingController = async (req, res) => {
  try {
    // getting the listing id from params
    const { id } = req.params;
    console.log(id);

    // searching the listing based on id
    const listing = await Listing.findById(id);

    // checking listing find or not
    if (!listing)
      return res.send({
        success: false,
        message: "Listing not found",
      });

    // verifying the listing id is equal to userId who want to delete it
    if (listing.userRef == req.user.id) {
      const deleteListing = await Listing.findByIdAndDelete(id);
      // checking listing delete or not
      if (!deleteListing) {
        return res.send({
          success: false,
          message: "Listing deletation failed",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Listing Deletation Successfully",
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: "You Cannot delete other's Listings",
      });
      return;
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while deleting the listing",
      error: error.message,
    });
  }
};

// update the listing by id
const updateListingController = async (req, res) => {
  
  try {
    // getting the listing id from params
    const { id } = req.params;

    // getting data for updatin from body
    const {
      name,
      description,
      address,
      regularPrice,
      discountedPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrl,
    } = req.body;

    // searching the listing based on id
    const listing = await Listing.findById(id);

    // checking listing find or not
    if (!listing)
      return res.send({
        success: false,
        message: "Listing not found",
      });

    // verifying the listing id is equal to userId who want to delete it
    if (listing.userRef == req.user.id) {
      const updateListing = await Listing.findByIdAndUpdate(
        id,
        {
          name,
          description,
          address,
          regularPrice,
          discountedPrice,
          bathrooms,
          bedrooms,
          furnished,
          parking,
          type,
          offer,
          imageUrl,
        },
        { new: true }
      );
      // checking listing update or not
      if (!updateListing) {
        return res.send({
          success: false,
          message: "Listing updation failed",
          deleteListing,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Listing Updated Successfully",
          updateListing,
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: "You Cannot update other's Listings",
      });
      return;
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while updating the listing",
      error: error.message,
    });
    console.log(error);
  }
};

// single listing fetch
const fetchListingController = async (req, res) => {
  try {
    // gettng id for fetching the listing
    const { id } = req.params;

    // finding the listing based on id
    const listing = await Listing.findById(id);

    // validate listing get or not
    if (!listing)
      return res.send({ success: false, message: "Lising not fund" });

    res.status(200).send({
      success: true,
      message: "Listing fetch success",
      listing,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error while fetching listing",
      error: error.message,
    });
  }
};

// search lislting function
const getListingsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTearm = req.query.searchTearm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTearm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).send({
      success: true,
      message: "Product fetch successfully",
      listings,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "error while searching the listing",
      error: error.message,
    });
  }
};

module.exports = {
  createListingController,
  deleteListingController,
  updateListingController,
  fetchListingController,
  getListingsController,
};
