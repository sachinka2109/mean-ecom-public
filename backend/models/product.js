const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating a new Product Schema
const ProductSchema = new Schema({
  title: {
    type:String,
    required: true
  },
  brand: {
    type:String,
    required: true
  },
  imageUrl: {
    type:String,
    required: true
  },
  description: {
    type:String,
    required: true
  },
  price: {
    type:Number,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true,
  },
  quantity: {
    type:Number,
    min: 0
  },
  isFeatured: {
    type:Boolean,
    deafult:false
  },
  discount: {
    type:Number,
    default: 0
  }
}, 
{timestamps: true},
{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
});


ProductSchema.virtual("averageRating").get(function () {
  var rating = 0;
  if (this.reviews.length == 0) {
    rating = 0;
  } else {
    this.reviews.map((review) => {
      rating += review.rating;
    });
    rating = rating / this.reviews.length;
  }
  return rating;
});

ProductSchema.index({title: 'text',imageUrl: 'text',description: 'text',price:'text',owner:'text',category:'text',subCategory:'text'})

module.exports = mongoose.model("Product", ProductSchema);