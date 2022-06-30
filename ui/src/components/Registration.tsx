import { tokenApi } from "../shared/API"



export const Registration = () =>{

    const data = {
        account:{
            userName: "Patito",
            email: "test@test.com",
            password: "TestPassword"
        }
    }

    tokenApi("post","/userRegister",data)
    
    return(

        <h1 className="text-5xl text-center py-10">TEST REGISTRATION</h1>
    )
}