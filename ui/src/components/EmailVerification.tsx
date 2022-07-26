import { Dispatch, ReactElement, SetStateAction, useRef, useState } from "react";
import { tokenApi, useTokenApi } from "../shared/API";


interface Props{
  email: string
}
// Main
export const EmailVerification = (props: Props) =>{

// ************** Constants and variables ************** 
// Hooks
  const [accountActive, setAccountActive] = useState(false);
  
  const ACTIVATE_ACCOUNT         =  "A message is sent to " + 
                                    props.email +"." + 
                                    " Pls activate your account.";
  const REGISTRATION_SUCCESSFUL  = "Registration was successful. Pls ";


  // Event handling
  const onAccountActive = (e: React.FormEvent) =>{
    // Prevent from refreshing
    e.preventDefault();

    // Check if account has been activated
    tokenApi("post", "/accountActivated",{email: props.email})
    .then((res: any) =>
    {
      console.log("res:", res.statusText)

      if(res.statusText == "OK") setAccountActive(true);
    })
  }

  return(
    <>
    {accountActive == false && (
      <div>
        <h2 className="text-3xl text-center pt-3">{ACTIVATE_ACCOUNT} </h2>
          <div className="text-center lg:text-left">
            <button
              type      ="button"
              onClick   ={onAccountActive} 
              className ="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Enter to continue
            </button>
          </div>
      </div>
    )}

    {accountActive == true && (
      <h2 className="text-3xl text-center pt-3">{REGISTRATION_SUCCESSFUL}
          <a
          href="/"
          className="text-green-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
          > Login.</a >
      </h2>
    )}
    </>
  )
}