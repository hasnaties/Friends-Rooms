const express = require('express');
const path = require('path');

const app = express();
const router = express.Router()
const viewsDirectoryPath = path.join(__dirname, '../views')

app.use(express.static(viewsDirectoryPath))

router.get('/', (req, res) => {
    res.sendFile(viewsDirectoryPath + '/index.html');
})

app.use(router)

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is up on port: ${port}` );
})