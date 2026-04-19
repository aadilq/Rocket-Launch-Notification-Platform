  import { useState, useEffect } from "react"                                   
  import { useNavigate } from "react-router-dom"                                
                                                                                
  function Subscribe() {  
                                                          
    const [subscriptions, setSubscriptions] = useState([])                    
    const [launches, setLaunches] = useState([])
    const [loading, setLoading] = useState(true)                                
    const navigate = useNavigate()
                                                                                
    const token = localStorage.getItem("token")                                 
    console.log("Subscribe component rendered")
    console.log("token:", localStorage.getItem("token"))   
    useEffect(() => {                                                           
      if (!token) {
        navigate("/login")
        return
      }

      Promise.all([                                                             
        fetch("/api/subscriptions", {
          headers: { "Authorization": `Bearer ${token}` }                       
        }).then(res => res.json()),
        fetch("/api/launches").then(res => res.json())
      ]).then(([subsData, launchesData]) => {  
        console.log("subscriptions:", subsData)                                   
        console.log("launches:", launchesData)                                 
        setSubscriptions(Array.isArray(subsData) ? subsData : [])
        setLaunches(Array.isArray(launchesData) ? launchesData : [])            
        setLoading(false)
      }).catch(() => setLoading(false))                                         
    }, [])                                                                 
   
    function getLaunchName(launchId) {                                          
      const launch = launches.find(l => l.id == launchId)
      return launch ? launch.name : "Unknown Launch"
    }

    function getLaunchAgency(launchId) {
      const launch = launches.find(l => l.id == launchId)
      return launch ? launch.agency : ""                                        
    }
                                                                                
    async function handleUnsubscribe(subId) {

      const token = localStorage.getItem("token")                                 
      const res = await fetch(`/api/subscriptions/${subId}`, {
        method: "DELETE",                                                       
        headers: { "Authorization": `Bearer ${token}` }
      })                                                                        
                  
      if (res.ok) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== subId))
      }                                                                         
    }
                                                                                
    if (loading) return <div className="min-h-screen bg-gray-950 text-white flex
   items-center justify-center">Loading subscriptions...</div>
                                                                                
    return (      
      <div className="min-h-screen bg-gray-950 text-white px-12 py-16">
        <h1 className="text-4xl font-bold mb-8">My Subscriptions</h1>           
   
        {subscriptions.length === 0 ? (                                         
          <p className="text-gray-400">You have no active subscriptions. Browse
  launches to subscribe.</p>                                                    
        ) : (
          <div className="grid grid-cols-1 gap-4">                              
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-gray-800 rounded-xl p-6 flex
  justify-between items-center">                                                
                <div>
                  <h2 className="text-xl font-semibold">{sub.agency ||          
  getLaunchName(sub.launch_id)}</h2>                                            
                  <p className="text-gray-400 mt-1">{sub.agency ? "Agency Subscription" : getLaunchAgency(sub.launch_id)}</p>                           
                  <div className="flex gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full            
  ${sub.notify_email ? "bg-blue-600" : "bg-gray-600"}`}>                        
                      Email                                                     
                    </span>                                                     
                    <span className={`text-xs px-2 py-1 rounded-full 
  ${sub.notify_phone ? "bg-blue-600" : "bg-gray-600"}`}>                        
                      SMS
                    </span>                                                     
                  </div>
                </div>
                <button
                  onClick={() => handleUnsubscribe(sub.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm
  font-semibold py-2 px-4 rounded-lg"                                           
                >
                  Unsubscribe                                                   
                </button>
              </div>
            ))}
          </div>
        )}                                                                      
      </div>
    )                                                                           
  }               

  export default Subscribe