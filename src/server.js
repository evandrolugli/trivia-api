const express = require('express')
const app = express();

app.get("/", function(req, res) {
    res.send("hello world")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server running on port : http://localhost:${PORT}`);
})