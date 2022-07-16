import { tokenApi } from "../shared/API"



export const Registration = () =>{

    // This component to mock DB with test user
    const data = {
        account:{
            userName: "Patito",
            email: "test@test.com",
            password: "TestPassword"
        }
    }

    tokenApi("post","/userRegister",data)
    .then((err: any, res: any) => 
    {
        if(err) console.log(err);
        else console.log(res);
    }
    )
    
    return(

        <h1 className="text-5xl text-center py-10">TEST REGISTRATION</h1>
    )
}