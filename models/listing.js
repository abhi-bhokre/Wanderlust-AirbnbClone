const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url : String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner :{
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry :  {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// Middleware for deleting reviews when a listing is removed
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    const Review = require("./review"); // Lazy load to avoid circular imports
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);