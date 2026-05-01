import { Link } from "react-router-dom"

function Home(){
    return(
        <div className="min-h-screen bg-gray-950 text-white">
            <section className="flex flex-col items-center justify-center text-center py-32 px-6">
                <h1 className="text-5xl font-bold mb-4">Rocketify</h1>
                <p className="text-gray-400 text-lg mb-4">
                    Subscribe to upcoming Rocket Launches and get notified of the moment that something changes.
                </p>
                <Link to="/launches" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg inline-block">
                    Browse Launches
                </Link>
            </section>

            {/* {Features Section} */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-24">
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-center">Live Launch Data</h3>
                    <p className="text-center">Real-time data from RocketLaunch.Live covering launches from NASA, SpaceX, and more.</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-center">Email Notifications</h3>
                    <p className="text-center">Recieve Alerts at T-24hr, T-1hr, and whenever a launch status changes.</p>                    
                </div>
                    <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-center">Agency Subscriptions</h3>
                    <p className="text-center">Follow launches from your favorite Space Agencies.</p>                    
                </div>
            </section>
        </div>
    )
}
export default Home