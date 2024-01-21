require("dotenv").config()
const app=require('./app');
const connection = require("./db/connection");
connection().then(()=>{
    app.listen(process.env.PORT, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Server is running on port ${process.env.PORT}`);
        }
    })
})
