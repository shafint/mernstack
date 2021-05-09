require("dotenv").config()
const express =require("express");
require("./db/conn")
const Register = require("./models/registers")
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const hbs =require("hbs");
const bcryptjs=require("bcryptjs");
const port=process.env.PORT || 3000;
const path=require("path");
const views_path=path.join(__dirname,"../templet/views");
const prsl_path=path.join(__dirname,"../templet/partials");
 app.use(express.static(path.join(__dirname,"../public")))
app.set("view engine","hbs");
app.set("views",views_path)
hbs.registerPartials(prsl_path);

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render("register")
})


app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/register",async(req,res)=>{
    try{
        const pass=req.body.password;
        const cpass=req.body.cpassword;
        if(pass===cpass){

        const data =new Register({
            firstname:req.body.fname,
            lastname:req.body.lname,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            age:req.body.age,
            password:pass,                   
            confirmpassword:cpass
        })
// jwt token creations
        const token = await data.genereatetoken();


        const dataSent=await data.save();
        res.status(201).render("index")
        }else{
            res.status(400).send("Password don't match")
        }
    }catch(err){
        res.status(400).send(err)
    }
})


app.post("/login",async(req,res)=>{
try{
    const email=req.body.email;
    const databasedata=await Register.findOne({email:email});
    const comparePass=bcryptjs.compare(req.body.password,databasedata.password)
    await databasedata.genereatetoken()
    if(comparePass){
        res.status(201).render("index");

    }else{
        res.status(400).render("login",{messages:"invalid login address"})
    }
}catch(e){
    res.status(400).render("login",{messages:"invalid login address"})
}

    
})







// const jwt = require("jsonwebtoken");

// const createToken = async()=>{
//     try{
//         const token= await jwt.sign({_id:"609667d2298d2f28ecff5dd6"}, "loredjflsjfklsdjflksflkdsnflkdnfdsnfodsfosi")
//         cosnole.log(token)
//     }catch(err){
//         console.log(err)
//     }
// }

// createToken()











//how to work bcryptjs 

// hash method password secqure
// const bcript=require("bcryptjs");
//  const securePassword=async(password)=>{

//         const passwordHash= await bcript.hash(password, 10); 
//         const check=await bcript.compare(password,passwordHash)
//     console.log(passwordHash)
//     console.log(check)
//  }

//  securePassword("thapa@123")


app.listen(port,(e)=>{
    e?console.log(e):console.log(`server is runing and port number is ${port}`)
})
