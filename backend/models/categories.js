const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const categorySchema = new Schema({
  name:{
    type: String,
    unique: true,
    lowercase: true
  },
  subCategories:{
    subCategory: [{
      name:{
        type: String,
        unique: true,
        lowercase: true
      }
    }]
  }
},
{timestamps: true},
);

categorySchema.methods.insertSubcategory = function(subCategory) {
  const subCategoryIndex = this.subCategories.subCategory.findIndex(cp => {
      return (cp.name.toString() === subCategory.toString());
  });
  console.log(subCategoryIndex)
  const updatedSubCategory = [...this.subCategories.subCategory];
  if(subCategoryIndex >= 0) {
    updatedSubCategory[subCategoryIndex]
  }
  else {
      updatedSubCategory.push({
        name: subCategory,
      })
      const updatedSubCategories = {
          subCategory: updatedSubCategory
      };
      this.subCategories = updatedSubCategories;
  }
  return this.save();
}

module.exports = mongoose.model("Category", categorySchema);