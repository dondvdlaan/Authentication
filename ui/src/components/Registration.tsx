import { useState } from "react";
import { tokenApi } from "../shared/API"
import { ErrorText } from "../shared/ErrorText";
import { Application } from "./Application";
import { Login } from "./login/Login";
import ReCAPTCHA from "react-google-recaptcha";

interface Props{
    isEdit  : boolean;
    email   : string;
    password: string;
}
// *************** Main ***************
export const Registration = (props: Props) =>{

// ********** Constants and variables **********
const NEW_USER                = "New User";
const UPDATE_USER             = "Update User";
const REGISTRATION_SUCCESFUL  = "Registration was succesful. Pls login."
// For reset purpose of Recaptcha
let captcha: any;

// Hooks
const [email, setEmail]       = useState(props.email);
const [password, setPassword] = useState(props.password);
const [inputErr, setInputErr] = useState(0);
const [recaptchaToken, setRecaptchaToken] = useState("");

const [registrationSuccessful, setRegistrationSuccesful] = useState(false);
const [noRobot, setNoRobot]   = useState(false);

console.log("Email:", email)

// *************** Functions ***************
const userRegistration = (data: any) =>{

  // Check user registration against DB
  tokenApi("post", "/userRegister", data)
  .then((resp: any)=>
  {
    if(resp.data.errors){
      captcha.reset();
      setInputErr(resp.data.errors[0]);
    } 
    
    else if(resp.data.inserted) setRegistrationSuccesful(true);
    
  }
  )
}

// ********** Eventhandlers **********
// For reset purpose of Recaptcha
const setCaptchaRef = (ref:any) => {
  if (ref) {
    return captcha = ref;
  }
};

// Capturing and storing Recaptcha token
const onRecaptcha = (token: any) => {
  console.log("Captcha value:", token);
  if(token) setRecaptchaToken(token);
}

// Start Recaptcha and User registration process
const onRegistration = (e: React.FormEvent) =>
{
  // Prevent from refreshing
  e.preventDefault();

  // Constant and variables
  let data = {};
  
  // Check with Google if user is no robot
  data = {recaptchaToken}

  // Send Recaptcha to server for verification with Google
  tokenApi("post", "/signup", data)
  .then((resp: any)=>{
    
    // If success code
    if(resp.status == 201)
    { 
      // If no Robot, start user registration
      data = { account: {email, password}};
      userRegistration(data); 
    } 
    // Error handling
    else if(resp.data.errors) setInputErr(resp.data.errors[0]);
    // Log response
    else console.log("Captcha return:", resp);
  }
  ) 
}
    

return(
<section className="h-screen bg-yellow-50">
  <div className="px-6 h-full text-gray-800">
    <h1 className="text-5xl text-center pt-3">REGISTRATION</h1>
    <h2 className="text-3xl text-center pt-3">{props.isEdit ? UPDATE_USER : NEW_USER}</h2>
    <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-6 g-6" >
      <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-8 md:mb-0">
       
        <>
        {registrationSuccessful == false && (
        <form
        onSubmit={onRegistration}
        >
         {/* Error message */}
         <ErrorText error = {inputErr} />
         
         {/* Email input */}
          <div className="mb-6">
            <input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="id1"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          
          {/* Password input */}
          <div className="mb-6">
            <input
              type="password"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="id2"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="text-center lg:text-left">
             <ReCAPTCHA
                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm l"

                ref={(r) => setCaptchaRef(r) }
                sitekey = {"6LeCsv4gAAAAAFs24JlNgDut3AOyWGySAG1JSleR"}
                onChange={onRecaptcha}
                />
          </div>
          <div className="text-center lg:text-left">
            <button
              type="submit"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Register
            </button>
          </div>
        </form>
        )}
        
        </>
        {/* // Display successful registration message */}
        {registrationSuccessful &&(
        <h2 className="text-3xl text-center pt-3">{REGISTRATION_SUCCESFUL}
          <a
          href="/"
          className="text-green-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
          > Login</a >
        </h2>
        )}
      </div>
    </div>
  </div>
</section>
    )
}