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