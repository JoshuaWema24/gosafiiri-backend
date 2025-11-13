const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    phoneNumber: { type: String, required: true},
    age: { type: Number, required: true},
    gender: { type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('Tourist', touristSchema);
