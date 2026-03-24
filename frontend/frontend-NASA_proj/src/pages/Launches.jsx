  const launches = [
    {
      id: 1,
      name: "Falcon 9 | Starlink Group 6-10",
      agency: "SpaceX",
      status: "Go",
      net: "2025-06-15T14:30:00Z",
    },
    {
      id: 2,
      name: "Vulcan Centaur | Dream Chaser",
      agency: "United Launch Alliance",
      status: "TBD",
      net: "2025-07-01T09:00:00Z",
    },
    {
      id: 3,
      name: "Ariane 6 | Galileo",
      agency: "ESA",
      status: "Hold",
      net: "2025-07-20T06:45:00Z",
    },
  ]

  function Launches() {
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