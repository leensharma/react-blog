const express=require ('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cookieParser = require('cookie-parser')
const {User} =require('./models/user')
const { json } = require('body-parser')
const app=express()
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json())
app.use(cookieParser())


mongoose.connect("mongodb+srv://admin-leen:Test123@cluster0-3nyoy.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{console.log("DB connected")})
   .catch(err=>{console.log(err)})

app.post('/api/users/register',(req,res)=>{
  const user=new User(req.body)
  user.save((err,userData)=>{
    if(err) return res.json({success:false,err})
    return res.status(200).json({success:true})
    

  })
})


app.listen('5000',()=>{
    console.log("Server is running")
})
