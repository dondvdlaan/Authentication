// Imports
const express = require('express')
const cors = require('cors')
const request = require("request");
const bcrypt = require("bcrypt")

// Constanten and variables
//DB functions
const dbCreate = require("./couchDB/couchCreateTables.js")
const dbInsert = require("./couchDB/couchInsertData.js")
const findUser = require("./couchDB/couchFindUser.js")
const getUserData = require("./couchDB/couchGetUserData.js")

const server = express()
const port = 2500;

// Middleware
// handshake, everybody will be responded
server.use(cors());
// ???
server.use('/app', express.static(__dirname + '/ui/dist'));
server.use(express.json())

// Routes
//Handles the Captcha returns a res when Google thinks you are human
server.post("/signup", function (req, res){

  if (!req.body.recaptchaToken) {
      return res.status(400).json({message: "recaptchaToken is required"});
  }
  const verifyCaptchaOptions = {
      uri: "https://www.google.com/recaptcha/api/siteverify",
      json: true,
      form: {
          //replace it with .env before publishing
          secret: "6LfZVH0eAAAAAPtsI_qPZn9i903Rv3nK3RluXYLa",
          response: req.body.recaptchaToken
      }
  };

  //send request to the google server
  request.post(verifyCaptchaOptions, function (err, response, body) {
          if (err) {
              return res.status(500).json({message: "oops, something went wrong on our side"});
          }

          if (!body.success) {
              return res.status(500).json({message: body["error-codes"].join(".")});
          }

          //Save the user to the database. At this point they have been verified.
          //The User insert will be triggerd after the response in the Frontend
          res.status(201).json({message: "Congratulations! We think you are human."});
      }
  );
})

// User registration
server.post("/userRegister", async(req,res) =>{
  console.log("userRegister: ", req.body)
  try{
    //create Salt for the Password 
    const username = req.body.account["userName"]
    const hashedPassword = await bcrypt.hash(req.body.account["password"],10)

    let email = req.body.account["email"]

     { //send mail / blocked by the time of developping, not used
  /*     var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'xx@gmail.com',
          pass: 'yy'
        }
      });
      
      var mailOptions = {
        from: 'yy@gmail.com',
        to: 'zz@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); */
    }
    //value.accountExist will be true if no account was found
    findUser.doesExist(email,username).then(value =>{
      if(value.accountExist){
        console.log("account angelegt")
        dbInsert.insertedData({
          username : username,
          email : email,
          password : hashedPassword,
          auth : false,
          dbName : "users",
        })
        res.json({
          inserted: true,
        });
      }else{
        console.log("didnt create account")
          res.json({
            errors: value.errorType
          });
      }
    })
  }catch(e){
    console.log("Encypt error: ",e)
  }
})

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
      if(!value.length<1){
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
            errors: ["4"]
          })
        }
      }
      else{
        res.json({
          errors: ["4"]
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

