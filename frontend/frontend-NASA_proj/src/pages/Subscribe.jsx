  const subscriptions = [                                                          
    {                                                                              
      id: 1,      
      name: "Falcon 9 | Starlink Group 6-10",
      agency: "SpaceX",
      notify_email: true,
      notify_sms: false,
    },
    {
      id: 2,
      name: "Ariane 6 | Galileo",
      agency: "ESA",
      notify_email: true,
      notify_sms: false,
    },
  ]

  function Subscribe() {
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
                  <h2 className="text-xl font-semibold">{sub.name}</h2>
                  <p className="text-gray-400 mt-1">{sub.agency}</p>
                  <div className="flex gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full 
  ${sub.notify_email ? "bg-blue-600" : "bg-gray-600"}`}>
                      Email
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full 
  ${sub.notify_sms ? "bg-blue-600" : "bg-gray-600"}`}>
                      SMS
                    </span>
                  </div>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white text-sm
  font-semibold py-2 px-4 rounded-lg">
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