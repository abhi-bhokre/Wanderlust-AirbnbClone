const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).send("Listing not found");
      }

      let newReview = new Review(req.body.review);
      if (!listing.reviews) {
        listing.reviews = [];
      }
      newReview.author = req.user._id;

      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success" , "New Review Created");
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      res.status(500).send("Error saving review: " + err.message);
    }
  };

  module.exports.destroyReview = async (req, res) => {
    try {
      let { id, reviewId } = req.params;

      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success" , " Review Deleted")
      res.redirect(`/listings/${id}`);
    } catch (err) {
      res.status(500).send("Error deleting review: " + err.message);
    }
  };