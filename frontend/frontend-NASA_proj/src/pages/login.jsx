  import { useState } from "react"                                              
  import { useNavigate } from "react-router-dom"
                                                                                
  function Login() {
    const [isLogin, setIsLogin] = useState(true)                                
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")                                
    const [error, setError] = useState(null)
    const navigate = useNavigate()                                              
                  
    async function handleSubmit(e) {
      e.preventDefault()
      setError(null)
                                                                                
      const url = isLogin ? "/api/auth/login" : "/api/auth/register"
      const body = isLogin                                                      
        ? { email, password }                                                   
        : { name, email, password }
                                                                                
      try {       
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)                                            
        })
                                                                                
        const data = await res.json()

        if (!res.ok) {
          setError(data.detail || "Something went wrong")
          return                                                                
        }
                                                                                
        if (isLogin) {
          localStorage.setItem("token", data.access_token)
          navigate("/launches")
        } else {
          setIsLogin(true)
          setError("Account created! Please log in.")                           
        }
                                                                                
      } catch {                                                                 
        setError("Network error. Please try again.")
      }                                                                         
    }             

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center
  justify-center">                                                              
        <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md">
                                                                                
          {/* Toggle */}                                                        
          <div className="flex mb-6">
            <button                                                             
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-l-lg font-semibold ${isLogin ?
  "bg-blue-600" : "bg-gray-700"}`}                                              
            >
              Login                                                             
            </button>
            <button
              onClick={() => setIsLogin(false)}                                 
              className={`flex-1 py-2 rounded-r-lg font-semibold ${!isLogin ?
  "bg-blue-600" : "bg-gray-700"}`}                                              
            >     
              Sign Up
            </button>                                                           
          </div>
                                                                                
          <h2 className="text-2xl font-bold mb-6">{isLogin ? "Welcome Back" :   
  "Create Account"}</h2>
                                                                                
          {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">        
            {!isLogin && (
              <input                                                            
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}                         
                className="bg-gray-700 rounded-lg px-4 py-3 text-white
  placeholder-gray-400 outline-none"                                            
                required
              />                                                                
            )}    
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-700 rounded-lg px-4 py-3 text-white
  placeholder-gray-400 outline-none"                                            
              required
            />                                                                  
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-gray-700 rounded-lg px-4 py-3 text-white            
  placeholder-gray-400 outline-none"
              required                                                          
            />    
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 font-semibold py-3 
  rounded-lg mt-2"                                                              
            >
              {isLogin ? "Login" : "Sign Up"}                                   
            </button>                                                           
          </form>
                                                                                
        </div>    
      </div>
    )
  }

  
export default Login