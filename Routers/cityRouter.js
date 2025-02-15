const express = require('express');
const cityRouter = express.Router();

const pool = require('../config/db');

cityRouter.get('/all', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM cities`);
        res.status(200).json({cities: result.rows});
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});


// Path to your Excel file
const xlsx = require('xlsx');


// cityRouter.post('/add', async (req, res) => {
//     const filePath = 'cities.xlsx';

//     // Read the file
//     const workbook = xlsx.readFile(filePath);
    
//     // Get the sheet names
//     const sheetNames = workbook.SheetNames;
//     console.log('Sheet Names:', sheetNames);
    
//     // Get the first sheet (assuming your data is in the first sheet)
//     const sheet = workbook.Sheets[sheetNames[1]];
    
//     // Convert the sheet to JSON (array of objects)
//     const data = xlsx.utils.sheet_to_json(sheet);
    
//     // Map the extracted data to a more structured format (optional)
//     const cities = data.map(row => ({
//         Location_Name_En: row['Location_Name_En'], // assuming column names are exactly 'location_name' and 'location_name_arabic'
//         Location_Name_Arabic: row['Location_Name_Arabic']
//     }));
    
//     console.log('Cities:', cities);
//     try {
//         for (let city of cities) {
//         const result = await pool.query('INSERT INTO cities (name) VALUES ($1) RETURNING *', [city.Location_Name_En]);
//         console.log('Result:', result.rows[0]);
//         if (!result.rows[0]) {
//             res.status(400).send('City already exists');
//             return;
//         }
//         }
//         res.status(201).json({city: result.rows[0]});

//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal server error');
//     }
// });
module.exports = cityRouter;