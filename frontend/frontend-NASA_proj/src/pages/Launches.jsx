import { useState, useEffect } from "react";


  function Launches() {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(()=> {
      fetch("/api/launches")
      .then(res => res.json())
      .then(data => {
        setLaunches(data)
        setLoading(false)
      })
      .catch(()=>{
        setError("Failed to load launches")
        setLoading(false)
      })
    }, [])
    if(loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      loading launches...
    </div>
    if(error) return <div className="min-h-screen bg-gray-950 text-red-500 flex items-center justify-center">{error}</div>
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
                <p className="text-gray-400 text-sm mt-1">NET: {launch.net}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  launch.status === "Go" ? "bg-green-600" :
                  launch.status === "Hold" ? "bg-red-600" :
                  "bg-yellow-600"
                }`}>
                  {launch.status}
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm
   font-semibold py-2 px-4 rounded-lg">
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  export default Launches