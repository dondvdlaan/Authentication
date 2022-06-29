import { Dispatch, SetStateAction, useState } from "react";
import { Api } from "../shared/API";

interface Props{
  setToken: Dispatch<SetStateAction<undefined>>
}

async function loginUser(credentials: any) {
  return fetch('http://localhost:2500/userLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

export const Login = (props: Props) =>{
  // Constants and variables
  // Hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Eventhandlers
  const onLogin = (e: React.FormEvent) => {
    // Prevent from refreshing
    e.preventDefault();

    let data = {
        email,
        password
      }
      
      // let reply = Api("post", "userLogin", data)
      // console.log("Apireply: ", reply)
    loginUser(data)
    .then(res => console.log("Apireply:",res))
  }

    return(

<section className="h-screen bg-yellow-50">
  <div className="px-6 h-full text-gray-800">
    <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6" >
      <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
        <form
        onSubmit={onLogin}
        >
         {/* Email input */}
          <div className="mb-6">
            <input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="id1"
              placeholder="Email address"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
                setEmail(e.target.value);
              }}
            />
          </div>
{/* 
          <div className="flex justify-between items-center mb-6">
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                id="exampleCheck2"
              />
              <label className="form-check-label inline-block text-gray-800" htmlFor="exampleCheck2"
                >Remember me
              </label>
            </div>
            <a href="#!" className="text-gray-800">Forgot password?</a>
          </div> */}

          <div className="text-center lg:text-left">
            <button
              type="submit"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              
            >
              Login
            </button>
            {/* <p className="text-sm font-semibold mt-2 pt-1 mb-0">
              Don't have an account?
              <a
                href="#!"
                className="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                >Register</a >
            </p> */}
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

    )
}