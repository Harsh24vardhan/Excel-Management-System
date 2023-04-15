import  {Router} from 'express'
import XlsxPopulate from 'xlsx-populate';
import multer from 'multer';

import xlsx from 'xlsx';
// import { promisedQuery } from '../utils/index.js';
import mongo from '../utils/mongo.js';
import jwt from 'jsonwebtoken';
import ExcelData from '../utils/database.js';
const privateKey = '`qwewqwertyuijngb';

const routes = Router();

// routes.post("/saveExcelData", multer().single(), async (req, res) => {
//   try {
//     console.log('start ');

//     const file = req.file;

//     if (!file || !file.buffer) {
//       return res.status(400).send({ message: `Missing the 'excel.xlsx' file` });
//     }

//     const workbook = await XlsxPopulate.fromDataAsync(file.buffer);

    

//     const validationResult = validateRidersWorksheet(workbook);

//     if (validationResult.error) {
//       return {
//         message: validationResult.error.message,
//         data: validationResult.data,
//         responseStatus: 400,
//       };
//     }

//     if (!validationResult.data?.length) {
//       return {
//         message: "No valid records provided for rider creation",
//         data: validationResult.data,
//         responseStatus: 400,
//       };
//     }

//     console.log(JSON.stringify(validationResult.data));

//     const dataToSend = validationResult.data;

//     let sqlQuery  = 'INSERT INTO students (name, phone_number, roll_no, father_name, mother_name, standard, section) values';

//     dataToSend.forEach((element, index) => {
//       const {
//         name,
//         phone_number,
//         roll_no,
//         father_name,
//         mother_name,
//         standard,
//         section,
//       } = element;


//       sqlQuery+=`("${name}", "${phone_number}", ${roll_no}, "${father_name}", "${mother_name}", ${standard}, "${section}")`;
      
//       if(index!== dataToSend.length-1){
//         sqlQuery+=','
//       }
//     });

//     await promisedQuery(sqlQuery);
    

//     return res.send({message: 'ok'});
//     ret
//   } catch (error) {
//     console.log(`[saveExcelData][error] ${error.message}`, error);
//     res.status(500).send({ message: "something went wrong" });
//   } 
// });
// handle POST request for file upload
const storage1 = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// create upload middleware
const upload1 = multer({ storage: storage1 });
app.post('/saveExcelData', upload1.single('excelFile'), async function(req, res) {
  try{
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      // const docs = await ExcelData.insertMany(data);
      await ExcelData.create({
        data: data,
    })
    return res.status(200).json({
        message: "Successfuly added the excel data into database!",
        data: {
            data
        }
    })
}catch(error){
    return res.status(500).json({
        message: "Oppa something went wrong!",
        data: {
            error,
        }
    })
}

});

routes.post("/login", async (req, res) => {
  try {
    console.log(`[login] ${JSON.stringify(req.body)}`);

    const { email, password } = req.body;

    const db = await mongo.mongoConnection();
    const data = await db.collection("Users").findOne({ email, password });

    if (!data) {
      return res.status(400).send({ message: "data not found" });
    }

    const token = jwt.sign({ email }, privateKey);

    res.send({ email, password, name: data.name, token });

    return res.send({ message: "ok" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({message: 'something went wrong'})
  }
});

routes.post("/signup", async (req, res) => {
  try {
    console.log(`[signup][start] ${JSON.stringify(req.body)}`);

    const { email, password, name } = req.body;

    const db = await mongo.mongoConnection();
    const data = await db.collection("Users").findOne({ email });

    if (data) {
      return res.status(400).send({ message: "User already exist with this email. please use other email" });
    }

    await db.collection("Users").insertOne({
      email,
      password,
      name,
    });
    

    res.send({ message: 'ok'});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({message: 'something went wrong'})
  }
});

const validateRidersWorksheet = (workbook) => {
  try {
    const expectedFields = new Set([
      'name',
      'father_name',
      'phone_number',
      'roll_no',
      'mother_name',
      'standard',
      'section',
    ]);

    const sheet1 = workbook.sheet(0);
    const values = sheet1.usedRange().value();
    const [headers, ...riderRowsInExcel] = values;

    if (
      !headers.every((header) => expectedFields.has(header)) ||
      headers.length != expectedFields.size
    ) {
      return {
        error: new Error('Invalid/missing headers found'),
      };
    }

    if (riderRowsInExcel.length === 0) {
      return {
        error: new Error('Empty sheet'),
      };
    }

    const mappedRiderRowsInExcel = riderRowsInExcel
      .filter(
        (row) =>
          row[0] ||
          row[1] ||
          row[2] ||
          row[3] ||
          row[4] ||
          row[5] ||
          row[6]
      ) // take any non empty row
      .map((row) => {
        const [
          name,
          phone_number,
          roll_no,
          father_name,
          mother_name,
          standard,
          section,
        ] = row;

        return {
          name: name.trim(),
          phone_number,
          roll_no,
          father_name,
          mother_name,
          standard,
          section
  
        };
      });

    // const validationError = coreValidators.createRidersInBulk(
    //   mappedRiderRowsInExcel,
    // );

    return {  data: mappedRiderRowsInExcel };
  } catch (error) {
    console.log(
      `[rider][createRidersInBulk][validateRidersWorksheet][error]: ${error.message}`,
      error,
    );

    return { error: new Error('Parsing failed'), data: null };
  }
};

// handle POST request for file upload

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

// create upload middleware
const upload = multer({ storage: storage });
routes.post('/upload', upload.single('excelFile'), async function(req, res) {
    try{
      
      const excelSchema = new mongo.Schema({}, { strict: false });
      const ExcelData = mongo.model('ExcelData', excelSchema);

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        console.log("data", data);
        console.log(" first checkeddd");
        // const docs = await ExcelData.insertMany(data);
        await ExcelData.create({
            data: data,
        })
        console.log("second checkeddd");
        return res.render("home");
    }catch(error){
        return res.status(500).send({message: 'something went wrong'});;
    }

});
export default routes;
