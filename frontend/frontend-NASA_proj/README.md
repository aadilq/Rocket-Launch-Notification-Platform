  ---                                                                               
  Home                                                                              
  The landing page. Gives the user an overview of the platform — a hero section with
   a title, short description, and a call to action like "Browse Launches" or "Sign
  Up". Nothing dynamic yet, just a welcoming entry point.                           
                  
  ---                                                                               
  Launches        
  The main page of the app. Displays a list of upcoming rocket launches pulled from
  the backend API — launch name, agency, status, and scheduled date. Eventually
  users will be able to click a launch and subscribe to it from here.               
   
  ---                                                                               
  Subscribe       
  Where users manage their notification preferences — which launches or agencies    
  they're subscribed to, whether they want email or SMS alerts, and the ability to
  unsubscribe. For now it'll just be a skeleton with placeholder UI.

  Browser requests localhost:80
          │
          ▼
  Nginx receives the request
          │
          ▼
  Looks in /usr/share/nginx/html for the files                                     
          │
          ▼                                                                        
  Finds index.html and sends it back to the browser
          │                                                                        
          ▼
  Browser loads your React app                                                     
                                                                                   
  /usr/share/nginx/html is just the default folder Nginx looks in when serving     
  files.

  "Test the image builds / create an image" - docker build -t frontend_nasa .
  ""runs locally / run an instance of that image"" - docker run -p 80:80 frontend-nasa

