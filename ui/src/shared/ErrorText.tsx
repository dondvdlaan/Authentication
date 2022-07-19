import { Dispatch, SetStateAction, useState } from "react";
import { tokenApi } from "./API";

interface Props{
  error: number
}

export const ErrorText = (props: Props) =>{
  
  // ********** Constants and variables **********
  const errorText= ["Ein User mit dieser E-Mail existiert bereits!",
                    "Ein User mit diesem Benutzernamen exisitert bereits!",
                    "Die Passwörter stimmen nicht überein",
                    "Benutezrname oder Passwort ungültig"]
  
  // Hooks
  
  // ********** Eventhandlers **********
  
    return(

<section className="mb-6 text-red-700 " role="alert">
  <p >{ errorText[props.error - 1] }</p>
</section>

    )
}