import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { tokenApi } from "../shared/API";


export const Recaptcha = () =>{

// Constants and variables

// Event handling
const onRecaptcha = (value: any) => {
    console.log("Captcha value:", value);

    let data = {
        recaptchaToken: {
          value
        }}
        // Send Recaptcha to server for verification with GoogleB
        tokenApi("post", "/signup", data)
        .then((resp: any)=> console.log("Captcha return:", resp));
}

return(
    <div className="flex xl:justify-center " >
                <ReCAPTCHA
                sitekey = {"6LeCsv4gAAAAAFs24JlNgDut3AOyWGySAG1JSleR"}
                onChange={onRecaptcha}
                />
    </div>
           
)
}