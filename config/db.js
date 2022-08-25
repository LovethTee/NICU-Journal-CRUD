const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
           // useFindAndModify: false //all the above helps avoid errors in the console
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(err){ //incase there is an error, console log error & stop everything 
        console.error(err)
        process.exit(1)

    }
}
module.exports = connectDB //so we can run above in the app.js