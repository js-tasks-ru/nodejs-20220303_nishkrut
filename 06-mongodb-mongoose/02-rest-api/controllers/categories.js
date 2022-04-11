const Category = require('../models/Category');
module.exports.categoryList = async function categoryList(ctx, next) {
  const dbCategories = await Category.find({});
  const outPutCategories = [];

  for (const category of dbCategories) {
    const ouputSubCategories = [];
    if (category.subcategories.length !== 0 ) {
      for (const subcategory of category.subcategories) {
        ouputSubCategories.push(prepareCategory(subcategory));
      }
    }

    const outputCategory = prepareCategory(category);
    outputCategory.subcategories = ouputSubCategories;
    outPutCategories.push(outputCategory);
  }

  ctx.body = {categories: outPutCategories};
};

function prepareCategory(category) {
  const outputCategory = {
    id: category._id.toHexString(),
    title: category.title,
  };
  return outputCategory;
}
/*
{
  categories: [{
    id: '5d208e631866a7366d831ffc',
    title: 'Category1',
    subcategories: [{
      id: '5d208e631866a7366d831ffd',
      title: 'Subcategory1'
    }]
  }]
}*/
