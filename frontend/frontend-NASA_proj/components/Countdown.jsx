import { useEffect, useState } from "react";


function Countdown({ net }){
    const [timeLeft, setTimeLeft] = useState(getTimeLeft())

    function getTimeLeft(){
        const difference = new Date(net) - new Date()
        if(difference <= 0){ return null }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 *    
  60))                                                                          
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)                   
                  
      return { days, hours, minutes, seconds }  

    }

    useEffect(()=> {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
        }, [net])

        if(!timeLeft) return <span className="text-gray-400 text-sm">
            Launched
        </span>
        return(
            <span className="text-sm font-mono text-blue-400">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
        )
}

export default Countdown;