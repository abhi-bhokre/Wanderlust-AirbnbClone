const express = require("express");
const router = express.Router({mergeParams : true});
const wrapasync = require("../Utils/wrapasync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isreviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// Reviews -
//Post Route
router.post(
    "/", isLoggedIn,
    validateReview, 
    wrapasync(reviewController.createReview)
  );
  
  // //Delete review route
  router.delete(
      "/:reviewId", isLoggedIn , isreviewAuthor , 
      wrapasync(reviewController.destroyReview)
    );

    module.exports = router;