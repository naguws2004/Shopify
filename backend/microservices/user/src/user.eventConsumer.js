const { Kafka } = require('kafkajs');
const db = require('./db');

module.exports = async () => {
    const kafka = new Kafka({
        clientId: 'order-service',
        brokers: ['172.31.128.1:9092']
    });

    const consumer = kafka.consumer({ groupId: 'user-group' });

    const runConsumer = async () => {
        await consumer.connect();
        console.log('Kafka Consumer is connected and ready.');

        await consumer.subscribe({ topic: 'update-address', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Received message on topic ${topic}:`, message.value.toString());

                const data = JSON.parse(message.value.toString());

                if (topic === 'update-address') {
                    const { user_id, address, city, state, pincode, contactno } = data;
                    try {
                        let query = 'DELETE FROM shipping_address WHERE user_id = ?';
                        let params = [user_id];
                        await db.query(query, params);
                        query = 'INSERT INTO shipping_address(user_id, address, city, state, pincode, contactno) VALUES (?, ?, ?, ?, ?, ?)';
                        params = [user_id, address, city, state, pincode, contactno];
                        await db.query(query, params);
                        console.log(`Address updated for user_id: ${user_id}`);
                    } catch (err) {
                        console.error('Failed to update address:', err);
                    }
                }
            }
        });
    };

    runConsumer().catch(console.error);
}