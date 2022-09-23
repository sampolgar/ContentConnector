const express = require('express');
const dotenv = require('dotenv').config()
const port = process.env.PORT
const {errorHandler} = require('./middleware/errorMiddleware')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use(errorHandler) //this will override default error handler
app.listen(port, () => console.log(`Server running on port ${port}`));



// //Routes
// app.get('/', (req, res) => {
//     res.send('We are on home');
// });

// app.get('/posts', (req, res) => {
//     res.send('We are on posts');
// });

// //start listening

// app.listen(3000);