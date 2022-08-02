const express=require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const path = require('path')
const nodemailer=require('nodemailer')
const ejs=require('ejs');
const jwt=require('jsonwebtoken')
const PORT= process.env.PORT || 3000;

//midelware
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public/images')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



const verifyToken= (req,res,next)=>{
  const authHeader=req.headers.token;
  console.log(authHeader)
  if(authHeader){
    const token=authHeader.split(" ")[1];
    console.log(token)
    jwt.verify(token,jwtSecretKey,(err,user)=>{
    if(err) res.status(403).json("token is invalid")
    next()
   })
  }else{
    res.status(401).json("You are not authenticated gandu!");
  }
}

//connection with database
let url=`mongodb://localhost:27017/glaubenEnterprises`;
mongoose.connect(url,(error, connection)=>{
 if(!url||url=="undefined"){
  console.log(`connectioned failed ${error.message}`);
 }else{
  console.log(`Sucessfully connected with database`);
 }
})


//ROUTES
app.get('/',async(req,res)=>{
  res.status(200).render('index')
  })
app.get('/animatedChair',(req,res)=>{
    res.render('animationPage')
})

//Office chair Gallary
app.get('/officeChairGallary',(req,res)=>{
  res.render('officeGallary')
})
//cafe chair Gallary
app.get('/cafeChairGallary',(req,res)=>{
  res.render('cafeGallary')
})
//sofa route
app.get('/sofaGallary',(req,res)=>{
  res.render('sofaGallary') 
})
//nilkaml route
app.get('/nilkamalGallary',(req, res)=>{
  res.render('nilkamalGallary')
})
//office table
app.get('/officetable',(req, res)=>{
  res.render('tablegallary')
})


// contact route
app.get('/contact',(req,res)=>{
  res.render('contactPage')
})
app.post('/contact',(req,res)=>{
  const ClientMailID=req.body.mail
  const message=req.body.message
  let myMail="luqman11luqman11@gmail.com";
  let password="Luqman@1998";
  let clientid="390864361025-rloovqg2bj6lde6o7g7v0irtocsfjo4t.apps.googleusercontent.com";
  let clientSecret="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";
  let refToken="1//04YxeZQQKc-y3CgYIARAAGAQSNwF-L9IrRBkq2rwNDdzeNz_3eTiqny4emTVZ5QWm4xyXr5cDDfD5LHXvtXg2YHDALKZK7etlWn0"
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: myMail,
      pass: password,
      clientId: clientid,
      clientSecret: clientSecret,
      refreshToken: refToken
    }
  });
  let mailOptions = {
    from: ClientMailID,
    to:myMail ,
    text: message
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
      res.render('contactPage')
    } else {
      console.log("Email sent successfully");
     res.render('contactPage')
    }
  });
 
})



//admin Login page 
const credentials={
  email:"admin987654321@gmail.com",
  password:"luqmanAdmin2022"
}
app.get('/admin',(req,res)=>{
  res.status(200).render('adminLogin')
})
app.post('/admin',(req,res)=>{
  console.log(req.body)
  try{
    if(req.body.email === credentials.email && req.body.password=== credentials.password){
      const jwtSecretKey='b15536f5a70f0b7d85cae2143af67cfcd300731a';
      let data = {
        time: Date(),
        userId: 11,
    }
      const token = jwt.sign(data, jwtSecretKey);
      res.status(201).render("createCatogery")
    }else{
      res.status(406).send("wrong credentials")
    }
  }catch(err){
   res.status(500).json(err)
  }
})
//create catogary
app.get('/admin/createCatogery',verifyToken,async(req,res)=>{
  res.status(200).render('createCatogery')
})




app.listen(PORT,(err)=>{
    if(err) throw err.message;
    console.log('listening on port '+PORT);
})