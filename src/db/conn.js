const mongoose=require("mongoose");


mongoose.connect(process.env.DB_HOST,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})