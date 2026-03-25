  import { BrowserRouter, Routes, Route } from "react-router-dom"
  import Navbar from "../components/Navbar"                                       
  import Home from "./pages/Home"
  import Launches from "./pages/Launches"                                          
  import Subscribe from "./pages/Subscribe"

  function App() {
    return (
      <BrowserRouter>                                                              
        <Navbar />
        <Routes>                                                                   
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/subscribe" element={<Subscribe />} />
        </Routes>                                                                  
      </BrowserRouter>
    )                                                                              
  }               

  export default App