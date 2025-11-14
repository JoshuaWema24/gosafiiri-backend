const express = require('express');
const mongoose = require('mongoose');
const Tourist = require('../models/tourist.model');
const bcrypt = require('bcryptjs');
const io = require('../server');

exports.createTourist = async(req, res) => {
    try {
        const { name, email, phoneNumber, age, gender, country, city, password} = req.body;
        console.log("Tourist created", req.body);

        if(!name) {
            return res.status(400).json({ error: "Name is required"});
        }
        if(!email) {
            return res.status(400).json({ error: "email is required"});
        }
        if(!phoneNumber) {
            return res.status(400).json({ error: "phoneNumber is required"});
        }
        if(!age) {
            return res.status(400).json({ error: "age is required"});
        }
        if(!gender || !country || !city) {
            return res.status(400).json({ error: "gender, country and city are required"});
        }
        if (!password) {
            return res.status(400).json({ error: "password is required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTourist = new Tourist({
            name,
            email,
            phoneNumber,
            age,
            gender,
            country,
            city,
            password: hashedPassword
        });

        await newTourist.save();
        console.log("New Tourist", newTourist);

        io.emit('newTourist', newTourist);

        return res.status(201).json({ message: "Tourist created successfully", tourist: newTourist });

    } catch (error) {
        return res.status(500).json({ error: "Server error"});
    }
}

exports.loginTourist = async(req, res) => {
    try {
        const { email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: "email and password are required"});
        }

        const tourist = await Tourist.findOne({ email});
        if(!tourist) {
            return res.status(400).json({ error: "Email doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, tourist.password);
        if(!isMatch) {
            return res.status(400).json({ error: "Invalid password"});
        }

        console.log("Login successful:", tourist);

        io.emit('loginTourist', tourist);

        return res.status(200).json({ message: "Login successful", tourist});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error"});
    }
}

exports.getTouristById = async (req, res) => {
    try {
        const id = req.params.id;
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ error: "Tourist not found" });
        }
        return res.status(200).json({ tourist });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error"});
    }
}

exports.getAllTourists = async (req, res) => {
    try {
        const tourists = await Tourist.find();
        console.log("Tourists", tourists);

        return res.status(200).json({ tourists });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error"});
    }
}

exports.updateTourist = async (req, res) => {
    try {
        const touristId = req.params.id;
        const updates = req.body;
        const updatedTourist = await Tourist.findByIdAndUpdate(touristId, updates, { new: true });

        if (!updatedTourist) {
            return res.status(404).json({ error: "Tourist not found"});
        }

        console.log("Updated Tourist", updatedTourist);

        io.emit('updateTourist', updatedTourist);

        return res.status(200).json({ message: "Tourist updated successfully", tourist: updatedTourist });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error"});
    }
}

exports.deleteTourists = async ( req, res) => {
    try {
        const touristId = req.params.id;
        const deletedTourist = await Tourist.findByIdAndDelete(touristId);

        if (!deletedTourist) {
            return res.status(404).json({ message : "Tourist not found"});
        }

        console.log("Deleted Tourist", deletedTourist);

        io.emit('deleteTourist', deletedTourist);

        return res.status(200).json({ message : "Tourist deleted successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Server error"});
    }
}
