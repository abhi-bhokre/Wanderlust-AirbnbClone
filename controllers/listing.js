const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  };

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new");
  };  

  module.exports.showListing = async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate({
          path: "reviews",
          populate: {
            path: "author",
          },
        })
        .populate("owner");
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
      res.render("listings/show", { listing });
    } catch (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/listings");
    }
  };

  module.exports.createListing = async (req, res) => {
    try {
     let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

      let url = req.file.path;
      let filename = req.file.filename;

      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url , filename};
      newListing.geometry = response.body.features[0].geometry;
      let savedListing = await newListing.save();
      console.log(savedListing);
      req.flash("success", "Successfully created a new listing!");
      res.redirect(`/listings`); // Redirect to the new listing page
    } catch (err) {
      req.flash("error", "Failed to create listing.");
      res.redirect("/listings");
    }
  }

  
 module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl });
  }; 

 module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  };  