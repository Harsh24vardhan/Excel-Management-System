import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();
app.use(cors());
const port  = process.env.PORT || 5100;
app.use(
  express.json({ limit: 1000000 }),
  express.urlencoded({
    extended: true,
    limit: 100000,
  })
);

// mysqlInstance.query('select * from url_to_short_url_mapping;', (err, result)=> {
//   if(err){
//     console.log(error);
//   }
//   console.log(result);
// })

app.use(routes);
app.listen(port, ()=> {
  console.log(port)
})
