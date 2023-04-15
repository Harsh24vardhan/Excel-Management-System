// const multer = require('multer');

// import mongoose form 'mongoose';
// const xlsx = require('xlsx');
const mongoose = require('mongoose');
// set up storage for uploaded files

// set up database connection using Mongoose
mongoose.connect('mongodb://localhost/upload_excel_project_xyz', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => { console.log("Successfully connected to the database") })
    .catch((error) => { console.log("Error while connecting to the database ", error) });
    // define schema for Excel data
const excelSchema = new mongoose.Schema({}, { strict: false });
const ExcelData = mongoose.model('ExcelData', excelSchema);
// module.exports=ExcelData;
export default ExcelData;