const express = require('express');
const path = require('path')
const hbs = require('hbs');
const bcrypt = require('bcryptjs')

require("./db/conn")
const Register = require('./models/registers');
const { ESRCH } = require('constants');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:false}))
app.use(express.json());

const staticpath = path.join(__dirname,"../public")
const templatepath = path.join(__dirname,"../templates/views")
const partialpath = path.join(__dirname,"../templates/partials")


app.use(express.static(staticpath));
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath)

app.get('/',async (req,res)=>{     
    // res.send('Hello from HOME')
    // const userdata = await Register.find();
    // const arr = Array.from(userdata)
    

    res.render("index")
})


app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/record',async (req,res)=>{
    try{
        const result = await Register.find();
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
})



app.post('/login', async (req,res)=>{
    try{

     const useremail = await Register.findOne({email:req.body.loginemail})

     const isMAtch = await bcrypt.compare(req.body.loginpassword,useremail.password)
     console.log(isMAtch);


            // if(useremail.password === req.body.loginpassword){

                if(isMAtch){
                res.render('index' , {greet : useremail.firstname })
            }
            else{
                res.send('Invalid Login Details')
            }
    }
    catch(e){
        res.status(400).send(e);
    }
})

app.post('/register',async (req,res)=>{
    try{
            const password = req.body.namepassword;
            const cpassword = req.body.nameconfirmpassword;
            // console.log(password);

            if(password === cpassword){
                const resgisterEmployee = new Register({
                    firstname: req.body.namefirst,
                    lastname: req.body.namelast,
                    email: req.body.nameemail,
                    gender: req.body.namegender,
                    phone: req.body.namephone,
                    age: req.body.nameage,
                    password: req.body.namepassword,
                    confirmpassword: req.body.nameconfirmpassword,
                })

                    //Password Hash --> Concept of Middleware

                const registered =await resgisterEmployee.save()
                res.status(201).render("login");
                
            }else{
                res.send("Password Not Matching");
            }


    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(port,()=>{
    console.log('Server Running at 3000 port...')
})

