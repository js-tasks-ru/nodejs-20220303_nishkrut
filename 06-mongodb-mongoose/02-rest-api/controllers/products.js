const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({
    'subcategory': mongoose.Types.ObjectId(subcategory),
  });

  const preparedProducts = [];

  if (products.length !== 0) {
    for (const product of products) {
      preparedProducts.push(prepareProduct(product));
    }
  }
  ctx.body = {products: preparedProducts};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  const preparedProducts = [];

  if (products.length !== 0) {
    for (const product of products) {
      preparedProducts.push(prepareProduct(product));
    }
  }

  ctx.body = {products: preparedProducts};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (mongoose.isValidObjectId(id)) {
    const rawProduct = await Product.findById(id);

    if (!rawProduct) {
      ctx.status = 404;
      ctx.body = 'product is not found';
    } else {
      const preparedProduct = prepareProduct(rawProduct);
      ctx.body = {product: preparedProduct};
    }
  } else {
    ctx.status = 400;
    ctx.body = 'id is not valid';
  }
};

function prepareProduct(rawProduct) {
  const preparedProduct = {
    id: rawProduct._id.toHexString(),
    title: rawProduct.title,
    images: rawProduct.images,
    category: rawProduct.category.toHexString(),
    subcategory: rawProduct.subcategory.toHexString(),
    price: rawProduct.price,
    description: rawProduct.description,
  };
  return preparedProduct;
}

/*
http://localhost:3000/api/products?subcategory=5d20cf5bba02bff789f8e29e
{
  products: [
    {
      id: '5d20cf5bba02bff789f8e29f',
      title: 'Product1',
      images: ['image1', 'image2'],
      category: '5d20cf5bba02bff789f8e29d',
      subcategory: '5d20cf5bba02bff789f8e29e',
      price: 10,
      description: 'Description1'
    }
  ]
}
*/
