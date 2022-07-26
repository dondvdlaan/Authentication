"use strict";
// ***************** Imports *****************
const express     = require('express');
const cors        = require('cors');
const axios       = require('axios');
const bcrypt      = require("bcrypt");
const nodemailer  = require("nodemailer");
require('dotenv').config();
const MD5         = require("crypto-js/md5");

// ***************** Constanten and variables *****************
//DB functions
const dbCreate        = require("./couchDB/couchCreateTables.js");
const dbInsert        = require("./couchDB/couchInsertData.js");
const findUser        = require("./couchDB/couchFindUser.js");
const getUserData     = require("./couchDB/couchGetUserData.js");
const db              = require("./couchDB/couch.js");
const dbName          = "users";

// Server
const server          = express()

const port            = 2500;

const ERROR_LOGIN                   = 4;
const ERROR_ACCOUNT_NOT_ACTIVATED   = 5;


// ***************** Middleware *****************
// handshake, everybody will be responded
server.use(cors());

// ???
server.use('/app', express.static(__dirname + '/ui/dist'));
// All incoming request is handled with json
server.use(express.json())

// ***************** Routes *****************
// Handles the Captcha, returns a res when Google thinks you are human
server.post("/signup", function (req, res)
{
  if (!req.body.recaptchaToken) 
  {
      return res.status(400).json({message: "recaptchaToken is required"});
  }
  // send request to the google server
  axios({
    method  : 'post',
    url     : 'https://www.google.com/recaptcha/api/siteverify',
    params  : {
              secret  : process.env.REACT_APP_SECRET_KEY,
              response: req.body.recaptchaToken
              }
  })
  .then(data => {
    // console.log("data:", data.data)
    
    if(data.success == false) {
      console.log("error codes:", {message: data.data["error-codes"]}) 
    }
    else {
      // Communicate to FE approval
      return res.send(data.data.status);
    }
  })
});


// User registration
server.post("/userRegister", async(req,res) =>
{
  // console.log("userRegister: ", req.body)

  try
  {
    // Prepare registration process 
    const username        = req.body.account["userName"];
    const hashedPassword  = await bcrypt.hash(req.body.account["password"],10);
    const email           = req.body.account["email"];
    const hash            = MD5(email).toString();
    
    // value.accountExist is true, when account does not exist
    findUser.doesExist(email,username).then(value =>
    {
      if(value.accountExist == true)
      {
        console.log("Account created")
        
        dbInsert.insertedData
        ({
          username  : username,
          email     : email,
          password  : hashedPassword,
          auth      : false,
          active    : 0,
          hash      : hash,
          dbName    : dbName,
        })
        
        // Start user verification process per email
        let transporter = nodemailer.createTransport
        ({
          service: 'zoho',
          auth: 
          {
            user: process.env.REACT_APP_EMAIL,
            pass: process.env.REACT_APP_EMAIL_PASS
          }
        });
      
        let mailOptions = 
        {
          from    : process.env.REACT_APP_EMAIL,
          to      : email,
          subject : 'Account Verification Link', 
          text    : 'Hello '+ email +',\n\n' + 
                    'Please verify your account by clicking the link: \nhttp:\/\/' + 
                    req.headers.host + 
                    '\/confirmation\/' + 
                    email + '\/' + hash + '\n\nThank You!\n' 
        }
      
        transporter.sendMail(mailOptions, function(error, info)
        {
          if (error) {
            console.log("sendMail error", error);
          } else {
            console.log('Verification email sent to user: ' + info.response);
            // Revert to FE RegistrationSuccesful
            res.json({inserted: true});
          }
        }); 
      }else
        {
          console.log("No Account created!")
            res.json({errors: value.errorType});
        }
    })
  }catch(e)
  {
    console.log("Encypt error: ",e)
  }
})


// FE request to check if account is activated
server.post('/accountActivated', (request,response) => {
  
  // console.log("/accountActivated", request.body.email)

  // Constants and varibales
  let accountActivated = false;
  let accountEmail  = request.body.email;

  // Retieve account from DB
  findUser.findUserForLogin(accountEmail)
  .then(res=> {

    if(res[0].active == 1) accountActivated = true;
  })
  .catch(console.log);

  // If account activated, send OK
  if(accountActivated) response.send("OK");
  else{response.json({errors: [ERROR_ACCOUNT_NOT_ACTIVATED]})}
})

// Await User Verification email
server.get('/confirmation/:email/:hash', (req,res) => {
  
  let emailToBeVerified = req.params.email;
  let hashToBeVerified  = req.params.hash;

  // console.log("emailToBeVerified", emailToBeVerified)
  // console.log("hashToBeVerified", hashToBeVerified)

  findUser.findUserForLogin(emailToBeVerified)
  .then(res=> {
    // console.log("res:", res)

    // Check if email and hash from DB and from new user coincide
    if( res[0].email == emailToBeVerified && res[0].hash == hashToBeVerified){
      
      // If yes, start activating account
      let data = {
        _id       : res[0]._id,
        _rev      : res[0]._rev,
        username  : res[0].username,
        email     : res[0].email,
        password  : res[0].password,
        auth      : false,
        active    : 1,
      }
      // Update DB, activate account
      db.use(dbName).insert(data)
      .then(
        // res => console.log("resss",res)
      ).catch(console.log);
    };
  })
  // Acknowledge reception email confirmation
  res.send("OK");
})

// User login
server.post("/userLogin",(req,res) =>{
  // console.log("Login req: ", req.body);

  try{
    //create Salt for the Password 
    const email     = req.body.account["email"]
    const password  = req.body.account["password"]
    let id = ""
    let rev = ""

    findUser.findUserForLogin(email).then(async value =>{
      // console.log("res from login ",value)

      if(!value.length  < 1){
        id              = value[0]._id
        rev             = value[0]._rev
        // console.log(password)
        // console.log(value[0].password)

        if(await bcrypt.compare(password,value[0].password)){
          console.log("password is correct login")
          
          res.json({
            login: true,
            userId: id,
            userRev:rev,
          })
        }
        else{res.json({errors: [ERROR_LOGIN]})}
      }
      else{res.json({errors: [ERROR_LOGIN]})}
    })
    
  }catch(e){
    console.log("Encypt error: ",e)
  }
})

// Fetch user data
server.post("/getUserData",async (req,res) =>{
  try{
    const id          = req.body.loggedInUser.id
    const rev         = req.body.loggedInUser.rev
    const dbUserData  = await getUserData.getUser(id,rev)
    res.json(
      dbUserData
    )
  }catch(e){
    console.log(e,"error by getting user")
  }
})

// ***************** Initialisation *****************
const init = ()=>{
  // Initialise database
    dbCreate.create();
}

server.listen(port, () => {
    init();
  console.log(`Server is listening at http://localhost:${port}`);
});

