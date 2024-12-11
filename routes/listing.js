const express = require("express");
const router = express.Router();
const wrapasync = require("../Utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapasync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingController.createListing)
  );

// Route to render the form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(listingController.showListing)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapasync(listingController.destroyListing));

// Edit route (Get the edit page for a specific listing)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapasync(listingController.renderEditForm)
);

module.exports = router;
