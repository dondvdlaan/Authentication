"use strict";
// ***************** Imports *****************
const express     = require('express');
const cors        = require('cors');
const request     = require("request");
const bcrypt      = require("bcrypt");
const nodemailer  = require("nodemailer");
require('dotenv').config();

// ***************** Constanten and variables *****************
//DB functions
const dbCreate    = require("./couchDB/couchCreateTables.js");
const dbInsert    = require("./couchDB/couchInsertData.js");
const findUser    = require("./couchDB/couchFindUser.js");
const getUserData = require("./couchDB/couchGetUserData.js");

const server      = express()
const port        = 2500;

const ERROR_LOGIN = 4;

// ***************** Middleware *****************
// handshake, everybody will be responded
server.use(cors());
// ???
server.use('/app', express.static(__dirname + '/ui/dist'));
server.use(express.json())

// ***************** Routes *****************
// Handles the Captcha returns a res when Google thinks you are human
server.post("/signup", function (req, res){

  console.log("signup received", req.body)

  if (!req.body.recaptchaToken) {
      return res.status(400).json({message: "recaptchaToken is required"});
  }
  const verifyCaptchaOptions = {
      uri: "https://www.google.com/recaptcha/api/siteverify",
      json: true,
      form: {
          secret: process.env.REACT_APP_SECRET_KEY,
          response: req.body.recaptchaToken
      }
  };

  // send request to the google server
  request.post(verifyCaptchaOptions, function (err, response, body) {
          if (err) {
            console.log("google server err")
              return res.status(500).json({message: "oops, something went wrong on our side"});
          }

          if (!body.success) {
            console.log("google server no succes", {message: body["error-codes"].join(".")})
              return res.status(500).json({message: body["error-codes"].join(".")});
          }

          //Save the user to the database. At this point they have been verified.
          //The User insert will be triggerd after the response in the Frontend
          res.status(201).json({message: "Congratulations! We think you are human."});
      }
  );
})

// User registration
server.post("/userRegister", async(req,res) =>
{
  console.log("userRegister: ", req.body)

  try
  {
    //create Salt for the Password 
    const username        = req.body.account["userName"];
    const hashedPassword  = await bcrypt.hash(req.body.account["password"],10);
    const email           = req.body.account["email"];
    const emailVerify     = process.env.REACT_APP_EMAIL_VERIFY;
    const token           = process.env.REACT_APP_TOKEN;

      //send mail / blocked by the time of developping, not used
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
        from    : 'dvdlaan@zohomail.com',
        to      : emailVerify,
        subject : 'Account Verification Link', 
        text    : 'Hello '+ emailVerify +',\n\n' + 
                  'Please verify your account by clicking the link: \nhttp:\/\/' + 
                  req.headers.host + 
                  '\/confirmation\/' + 
                  emailVerify + '\/' + token + '\n\nThank You!\n' 
      }
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("sendMail error", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
  
    // value.accountExist will be true, if account is not found
    findUser.doesExist(email,username).then(value =>
    {
      if(value.accountExist)
      {
        console.log("Account created")
        
        dbInsert.insertedData({
          username  : username,
          email     : email,
          password  : hashedPassword,
          auth      : false,
          dbName    : "users",
        })
        res.json({
          inserted: true,
        });
      }else
      {
        console.log("No Account created!")
          res.json({
            errors: value.errorType
          });
      }
    })
  }catch(e){
    console.log("Encypt error: ",e)
  }
})
// Function to confirm email verification
const confirmEmail = (req) =>{
console.log("Verification token: ", req.params.token)
}

// Get User Verification email
server.get('/confirmation/:email/:token', req => confirmEmail(req))


// User login
server.post("/userLogin",(req,res) =>{
  console.log("Login req: ", req.body);

  try{
    //create Salt for the Password 
    const email = req.body.account["email"]
    const password = req.body.account["password"]
    let id = ""
    let rev = ""

    findUser.findUserForLogin(email).then(async value =>{
      console.log("res from login ",value)

      if(!value.length < 1){
        id = value[0]._id
        rev = value[0]._rev
        console.log(password)
        console.log(value[0].password)

        if(await bcrypt.compare(password,value[0].password)){
          console.log("password is correct login")
          
          res.json({
            login: true,
            userId: id,
            userRev:rev,
          })
        }
        else{
          res.json({
            errors: [ERROR_LOGIN]
          })
        }
      }
      else{
        res.json({
          errors: [ERROR_LOGIN]
        })
      }

    })
    
  }catch(e){
    console.log("Encypt error: ",e)
  }
})

// Fetch user data
server.post("/getUserData",async (req,res) =>{
  try{
    const id = req.body.loggedInUser.id
    const rev = req.body.loggedInUser.rev
    const dbUserData = await getUserData.getUser(id,rev)
    res.json(
      dbUserData
    )
  }catch(e){
    console.log(e,"error by getting user")
  }
})

// Initialisation
const init = ()=>{
  // Initialises database
    dbCreate.create();
}

server.listen(port, () => {
    init();
  console.log(`Server is listening at http://localhost:${port}`);
});

