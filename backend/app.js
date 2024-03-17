require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const routes = require('./routes/routers');
const mongoConnect = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);


mongoConnect(process.env.MONGO_URL).then(() => {

    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});