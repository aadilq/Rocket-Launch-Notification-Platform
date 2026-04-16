  const amqp = require('amqplib');
  const { Pool } = require('pg');                                               
  const { sendNotificationEmail } = require('./emailService');
                                                                                
  const pool = new Pool({                                                     
      connectionString: process.env.DATABASE_URL                                
  });                                                                         

  async function startConsumer() {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();                         
   
      await channel.assertQueue('launch_events', { durable: true });            
      channel.prefetch(1);                                                    
                                                                                
      console.log('Notification service listening for events...');            

      channel.consume('launch_events', async (msg) => {                         
          if (msg === null) return;
                                                                                
          const event = JSON.parse(msg.content.toString());                   
          console.log(`Received event: ${event.event_type} - 
  ${event.launch_name}`);                                                       
   
          try {                                                                 
              const result = await pool.query(                                
                  `SELECT u.email FROM users u
                   JOIN subscriptions s ON s.user_id = u.id                     
                   WHERE s.launch_id = (
                       SELECT id FROM launches WHERE external_id = $1           
                   )                                                          
                   OR s.agency = $2
                   AND s.notify_email = true`,                                  
                  [event.launch_id, event.agency]
              );                                                                
                                                                                
              for (const row of result.rows) {
                  await sendNotificationEmail(row.email, event);                
              }                                                               

              channel.ack(msg);
          } catch (err) {
              console.error('Error processing event:', err);                    
              channel.nack(msg);
          }                                                                     
      });                                                                     
  }

  startConsumer();