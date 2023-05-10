//Including the packages and assigning to local Variables
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a Schema for Users
const userSchema = new Schema ({
    email:{
        type: String,
        unique:true,
        required: true,
        lowercase:true
    },
    name:String,
    admin: {
        type:Boolean,
        default:false,
    },
    picture: String,
    phone: {
        type: Number,
    },
    password:String,
    isSeller:{
        type:Boolean,
        default:false,
    },
    banned: {
        type:Boolean,
        default:false,
    },
    address: {
        add1:String,
        add2:String,
        city:String,
        state: String,
        country:String,
        postalCode:String,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
}
,{timestamps:true});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return (cp.productId.toString() === product._id.toString());
    });
    // console.log(cartProductIndex)
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0) {
        if(updatedCartItems[cartProductIndex].quantity < product.quantity) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems[cartProductIndex].quantity
        }
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
        const updatedCart = {
            items: updatedCartItems
        };
        this.cart = updatedCart;
    }
    return this.save();
}

userSchema.methods.updateCart = function(productId,quantity){
    const updatecartIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() == productId.toString();
    }) 
    // console.log(updatecartIndex);
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];
    if(updatecartIndex >= 0) {
        updatedCartItems[updatecartIndex].quantity = newQuantity;
    }
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};
  
userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

//Function to Use gravatar Service for image Sizes
userSchema.methods.gravatar = function (size) {
    if (!this.size) size = 200;
    if (!this.email) {
      return "https://gravatar.com/avatar/?s" + size + "&d=retro";
    } else {
      var md5 = crypto.createHash("md5").update(this.email).digest("hex");
      return "https://gravatar.com/avatar/" + md5 + "?s" + size + "&d=retro";
    }
};

//Exporting the Review schema to reuse
module.exports = mongoose.model("User",userSchema);