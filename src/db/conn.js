const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/employeeRegistration',{
    
useNewUrlParser:true,
useUnifiedTopology:true,

}).then(()=>{
    console.log('Connected to Database')
}).catch((e)=>{
    console.log(e);
})