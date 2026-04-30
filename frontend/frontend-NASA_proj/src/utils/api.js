export const BASE_URL = import.meta.env.VITE_API_URL

export async function authFetch(url, options = {}) {
      const token = localStorage.getItem("token")
                
      const res = await fetch(url, {
          ...options,
          headers: {                                                                
              ...options.headers,                                    
              "Authorization": `Bearer ${token}`
          }              
      })
                                                                                       
      if (res.status === 401) {                
          localStorage.removeItem("token")
          window.location.href = "/login"                                           
          return                       
      }
                                        
      return res                
  }                      
