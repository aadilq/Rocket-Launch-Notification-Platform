import { useState, useEffect } from "react"                                   
import { useNavigate } from "react-router-dom"  
import Countdown from "../../components/Countdown" 
import { authFetch, BASE_URL } from "../utils/api"


                                                                                
  function Launches() {                                                         
    const [launches, setLaunches] = useState([])                                
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)                                    
    const navigate = useNavigate()
                                                                                
    const token = localStorage.getItem("token")                                 
   
    useEffect(() => {                                                           
      authFetch(`${BASE_URL}/launches`)
        .then(res => res.json())
        .then(data => {
          setLaunches(data)
          setLoading(false)
        })
        .catch(() => {                                                          
          setError("Failed to load launches")
          setLoading(false)                                                     
        })        
    }, [])

    useEffect(() => {
      if (!token) return
      authFetch(`${BASE_URL}/subscriptions`, {                                             
        headers: { "Authorization": `Bearer ${token}` }
      })                                                                        
        .then(res => res.json())
        .then(data => setSubscriptions(Array.isArray(data) ? data : []))                                   
        .catch(() => {})
    }, [token])                                                                 
                  
    function isSubscribed(launchId) {                                           
      return subscriptions.some(sub => sub.launch_id === launchId)
    }                                                                           
                  
    function getSubscriptionId(launchId) {                                      
      const sub = subscriptions.find(sub => sub.launch_id === launchId)
      return sub ? sub.id : null                                                
    }             

    async function handleSubscribe(launchId) {                                  
      if (!token) {
        navigate("/login")                                                      
        return    
      }

      const res = await authFetch(`${BASE_URL}/subscriptions`, {                           
        method: "POST",
        headers: {                                                              
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ launch_id: launchId, notify_email: true,
  notify_phone: false })                                                          
      })
                                                                                
      if (res.ok) {                                                             
        const updated = await authFetch(`${BASE_URL}/subscriptions`, {
          headers: { "Authorization": `Bearer ${token}` }                       
        })        
        const data = await updated.json()                                       
        setSubscriptions(data)
      }                                                                         
    }             

    async function handleUnsubscribe(launchId) {
      const subId = getSubscriptionId(launchId)
      if (!subId) return                                                        
   
      const res = await authFetch(`${BASE_URL}/subscriptions/${subId}`, {                  
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }                         
      })
                                                                                
      if (res.ok) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== subId))
      }                                                                         
    }
                                                                                
    if (loading) return <div className="min-h-screen bg-gray-950 text-white flex
   items-center justify-center">Loading launches...</div>
    if (error) return <div className="min-h-screen bg-gray-950 text-red-500 flex
   items-center justify-center">{error}</div>                                   
   
    return (                                                                    
      <div className="min-h-screen bg-gray-950 text-white px-12 py-16">
        <h1 className="text-4xl font-bold mb-8">Upcoming Launches</h1>          
   
        <div className="grid grid-cols-1 gap-4">                                
          {launches.map((launch) => (
            <div key={launch.id} className="bg-gray-800 rounded-xl p-6 flex     
  justify-between items-center">
              <div>                                                             
                <h2 className="text-xl font-semibold">{launch.name}</h2>
                <p className="text-gray-400 mt-1">{launch.agency}</p>           
                <p className="text-gray-400 text-sm mt-1">NET: {new                           
  Date(launch.net).toLocaleDateString()}</p>
  <Countdown net={launch.net} />
              </div>                                                            
              <div className="flex flex-col items-end gap-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full  
  ${                                                                            
                  launch.status === "Go" ? "bg-green-600" :
                  launch.status === "Hold" ? "bg-red-600" :                     
                  "bg-yellow-600"
                }`}>                                                            
                  {launch.status}
                </span>                                                         
                {isSubscribed(launch.id) ? (
                  <button
                    onClick={() => handleUnsubscribe(launch.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm   
  font-semibold py-2 px-4 rounded-lg"
                  >                                                             
                    Unsubscribe
                  </button>                                                     
                ) : (
                  <button                                                       
                    onClick={() => handleSubscribe(launch.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm
  font-semibold py-2 px-4 rounded-lg"                                           
                  >
                    Subscribe                                                   
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )                                                                           
  }
                                                                                
  export default Launches
