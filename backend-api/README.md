
*models.py*
**Columns for each model:**

 User

- id --- primary key

- name

- email --- unique

- phone_number --- optional, needed for SMS later

- password_hash --- never store plain text passwords

- created_at

 Launch

- id --- primary key

- external_id --- the ID from RocketLaunch.Live

- name                                       

- agency (e.g. SpaceX, NASA)

- status (e.g. Go, Hold, TBD)

- net --- Net Expected Time, the scheduled launch datetime

- updated_at

 Subscription

- id --- primary key

- user_id --- foreign key to User

- launch_id --- foreign key to Launch (nullable, if subscribing to a specific launch)

- agency --- (nullable, if subscribing to an agency instead)

- notify_email --- boolean

- notify_sms --- boolean

- created_at

---
User ──────< Subscription >────── Launch                                              

 (agency)                                                                

 - **User → Subscription**: one-to-many (one user, many subscriptions)                     

 - **Launch → Subscription**: one-to-many (one launch, many subscribers)

- **Agency subscriptions** are handled by the agency column on Subscription directly --- no

 separate Agency table needed since agencies are just a string field on launches

 *dockerfile*

   FROM python:3.12.2-slim
  Starts from an existing base image from Docker Hub. python:3.12.2-slim is a minimal
  Linux OS with Python 3.12.2 already installed. You're building on top of this rather
  than from scratch. slim means it strips out unnecessary files to keep the image small.

  ---
  WORKDIR /app
  Creates a /app directory inside the container and sets it as the current working
  directory. All subsequent commands run from here. Similar to cd /app but also creates
  the folder if it doesn't exist.

  ---
  COPY requirements.txt .
  Copies just requirements.txt from your machine into /app inside the container. The .
  means "current working directory" which is /app since we set it above. Done separately
   from the rest of the code intentionally — see below.

  ---
  RUN pip install --no-cache-dir -r requirements.txt
  Installs all your dependencies inside the container. This runs at build time, not at
  runtime. --no-cache-dir tells pip not to store the download cache, keeping the image
  smaller.

  ---
  COPY . .
  Copies the rest of your source code (main.py, database.py, models.py) into /app. This
  is done after the pip install on purpose — Docker caches each layer. If only your code
   changes but not requirements.txt, Docker reuses the cached pip install layer and
  skips reinstalling packages, making rebuilds much faster.

  ---
  EXPOSE 8000
  Documents that the container listens on port 8000. It doesn't actually open the port —
   that happens when you run the container with -p 8000:8000. Think of it as metadata
  that tells anyone reading the Dockerfile which port the app uses.

  ---
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
  The command that runs when the container starts. Starts the FastAPI app with uvicorn.
  --host 0.0.0.0 makes it listen on all network interfaces inside the container so
  traffic from outside can reach it. Without this it would only be reachable from inside
   the container itself.


"Test the image builds" - docker build -t backend-api .

"runs locally" - docker run -p 8000:8000 backend-api