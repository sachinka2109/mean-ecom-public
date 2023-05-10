const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, default:'Pending'}
    }
  ],
  user: {
    email: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  },
  status: {
    type: String,
    default: 'Pending'
  }
},
{timestamps:true});

module.exports = mongoose.model("Order", OrderSchema);