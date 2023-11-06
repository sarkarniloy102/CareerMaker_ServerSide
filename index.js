const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// GET method route
app.get('/',(req,res)=>{
    res.send('career is running');
})
app.listen(port, () => {
    console.log(`Career Maker Server is running on port ${port}`);
})