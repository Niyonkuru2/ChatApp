import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContect'

const Login = () => {
  const [currentState,setCurrentState] = useState("Login")
   const [fullName,setFullName] = useState("")
   const [email,setEmail] = useState("")
   const [password,setPassword] = useState("")
   const [bio,setBio] = useState("")
   const [isDataSubmitted,setIsDataSubmitted] = useState(false)
   const {login} = useContext(AuthContext)

   const onsubmitHandler = (event)=>{
   event.preventDefault();
   if (currentState === 'Sign Up' && !isDataSubmitted) {
     setIsDataSubmitted(true)
     return;
   }
   login(currentState === "Sign Up" ? 'signup':'login',{fullName,email,password,bio})
   }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center
     justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl
    '>
    {/*---------- left side ------------*/}

    <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
     
     {/*---------- right side ------------*/}

  <form onSubmit={onsubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
    <h2 className='font-medium text-2xl flex justify-between items-center'>
      {currentState}
       {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)}
        src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'
      />}
      </h2>
      {currentState === "Sign Up" && !isDataSubmitted &&(
        <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text"
       className='p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2 focus:ring-indigo-500'
       placeholder='Full name' required
      />
      )}
      {!isDataSubmitted && (
          <>
           <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email address' 
           required className='p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2 focus:ring-indigo-500' />

            <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' 
           required className='p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2 focus:ring-indigo-500' />
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted &&(
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} 
             className='p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2 focus:ring-indigo-500 resize-none'
            placeholder='provide short bio...' required 
            ></textarea>
          )
        }
        <button type='submit'
         className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currentState ==="Sign Up" ? "Create Account":"Login Now"}
        </button>

     {currentState === "Sign Up" &&
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
}
        <div className='flex flex-col gap-2'>
          {
            currentState ==="Sign Up" ? (
              <p className='text-sm text-gray-600'>Already Have An Account? <span
              onClick={()=>{setCurrentState("Login"); setIsDataSubmitted(false)}}
              className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
            ):(
              <p className='text-sm text-gray-600'>Create an account <span
               onClick={()=>{setCurrentState("Sign Up");}}
              className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
            )
          }
        </div>
  </form>
    </div>
  )
}

export default Login