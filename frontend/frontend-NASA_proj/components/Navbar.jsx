  import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";                                         
                  
  function Navbar() {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate()

    useEffect(()=>{
      const token = localStorage.getItem("token")
      if(!token) return

      fetch("/api/auth/me", {
        headers: {"Authorization": `Bearer ${token}`}
      })
        .then(res => res.json())
        .then(data => {
          if (data.name) setUsername(data.name)
        }) 
      .catch(() => {})
    }, [])

    function handleLogout(){
      localStorage.removeItem("token")
      setUsername(null)
      navigate("/login")
    }

    return (
      <nav className="bg-gray-900 text-white px-12 py-4 flex justify-between 
  items-center">                                                                   
        <h1 className="text-xl font-bold">Rocket Launch Tracker</h1>
        <div className="flex gap-8">                                               
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/launches" className="hover:text-blue-400">Launches</Link>     
          <Link to="/subscribe" className="hover:text-blue-400">Subscribe</Link>
          {username ? (
            <>
            <span className="text-gray-300">{username}</span>
            <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-4 rounded-lg">
              Sign Out
            </button>
            </>
          ) : (<Link to='/login' className="hover:text-blue-400">Login</Link>)}
        </div>                                                                     
      </nav>      
    )                                                                              
  }               

  export default Navbar;