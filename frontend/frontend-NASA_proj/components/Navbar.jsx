  import { Link } from "react-router-dom";                                         
                  
  function Navbar() {
    return (
      <nav className="bg-gray-900 text-white px-12 py-4 flex justify-between 
  items-center">                                                                   
        <h1 className="text-xl font-bold">Rocket Launch Tracker</h1>
        <div className="flex gap-8">                                               
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/launches" className="hover:text-blue-400">Launches</Link>     
          <Link to="/subscribe" className="hover:text-blue-400">Subscribe</Link>
        </div>                                                                     
      </nav>      
    )                                                                              
  }               

  export default Navbar;