const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product')

dotenv.config();
const app = express();
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log('database connected');
})
.catch((err)=>{
    console.log('database not connected', err);
})

//todo: routes
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/product",productRoutes)

app.listen(process.env.PORT, () => {
    console.log(`server is up and running at ${process.env.PORT}`)
})