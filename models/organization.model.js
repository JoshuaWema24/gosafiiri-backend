const express = require('express');
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  orgName: { type: String, required: true, unique: true},
  country: { type: String, required: true},
  city: { type: String, required: true},
  ward: { type: String, required: true},
  service: {type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: {type: String, required: true}
});
