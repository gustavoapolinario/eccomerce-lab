const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
