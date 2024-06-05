const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, default: uuidv1 },
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    price: { type: Number, min: 1, max: 1000, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel
