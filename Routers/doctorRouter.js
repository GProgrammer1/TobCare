const express = require('express');
const doctorRouter = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//TODO: Add additional fields to query and update the db
doctorRouter.post('/signup', async (req, res) => {
    const { username, name, phone_number, email, password, consultation_fee, follow_up_fee,
        address, license_number, exp_years, city, specialty
     } = req.body;
    console.log("Request body: ", req.body);

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (!username || !name || !phone_number || !email || !password || !consultation_fee || !address || !license_number || !exp_years || !city || !specialty || !follow_up_fee) {
        res.status(400).send('Please fill all fields');
        return;
    }

    try {
        const city_id_query = await pool.query(`SELECT id FROM cities WHERE name = $1`, [city]);
        const city_id = city_id_query.rows[0].id;

        console.log("City id: ", city_id);
        
        const specialty_id_query = await pool.query(`SELECT id FROM specialties WHERE name = $1`, [specialty]);
        const specialty_id = specialty_id_query.rows[0].id;

        console.log("Specialty id: ", specialty_id);
        const result = await pool.query(`SELECT public.doctor_signup($1::TEXT,
         $2::TEXT,
         $3::INT,
         $4::TEXT,
         $5::TEXT,
         $6::DOUBLE PRECISION,
         
         $7::CHARACTER VARYING,
         $8::NUMERIC,
         $9::INT,
         $10::INT,
         $11::INT,
         $12::DOUBLE PRECISION) AS success`, [username, name, phone_number, email, hashedPassword, consultation_fee,
            address, license_number, exp_years, city_id, specialty_id, follow_up_fee
         ]);


        console.log("Result: ", result.rows[0]);

        if (result.rows[0].success === 1) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            res.status(201).json({
                message: 'Doctor created',
                token
            });
        }
        else {
            res.status(400).send('Doctor already exists');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }

});



doctorRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Request body: ", req.body);

    // Check if both email and password are provided
    if (!email || !password) {
        res.status(400).send('Please fill all fields');
        return;
    }

    try {
        // Query the database to get the hashed password for the given email
        const result = await pool.query('SELECT id, name, email, password FROM doctors WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            // If no user is found with the given email
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Get the stored hashed password from the query result
        const storedHashedPassword = result.rows[0].password;

        // Compare the entered password with the stored hashed password
        const isMatch = bcrypt.compareSync(password, storedHashedPassword);

        if (isMatch) {
            // If the password matches, create a JWT token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Adjust token expiration as needed
            res.status(200).json({
                message: 'Doctor logged in',
                token
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});
module.exports = doctorRouter;