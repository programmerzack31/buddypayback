require('dotenv').config()
const mongoose = require('mongoose')
const cors = require("cors")
const express = require('express')
const app = express();
const http = require('http');
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const { initSocket } = require("./socket");
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/authroute');
const transactionRoutes = require('./routes/transferRoute');
const notificationRoutes = require("./routes/notificationRoute");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" , credentials: true}));
const server = http.createServer(app)
initSocket(server);

app.use('/uploads', express.static('uploads'));

mongoose.connect(MONGO_URI,{
     useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{console.log("Mongo DB connected!");
    server.listen(PORT,()=>
        console.log(`BuddyPay backend is running on http://localhost:${PORT}`))
})
.catch(err=>console.log('failed to connect with mondo db!',err));

app.use('/api/buddypay',authRoutes);
app.use('/api/buddypay',transactionRoutes);
app.use('/api/buddypay',userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get('/',(req,res)=>{
    res.send("hello from BuddyPay backend!");
});




