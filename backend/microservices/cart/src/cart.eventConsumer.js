const { Kafka } = require('kafkajs');
const db = require('./db');

module.exports = async () => {
    const kafka = new Kafka({
        clientId: 'order-service',
        brokers: ['172.31.128.1:9092']
    });

    const consumer = kafka.consumer({ groupId: 'cart-group' });

    const runConsumer = async () => {
        await consumer.connect();
        console.log('Kafka Consumer is connected and ready.');

        await consumer.subscribe({ topic: 'delete-cart', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Received message on topic ${topic}:`, message.value.toString());

                const data = JSON.parse(message.value.toString());

                if (topic === 'delete-cart') {
                    const { user_id } = data;
                    try {
                        const query = 'DELETE FROM cart WHERE user_id = ?';
                        const params = [user_id];
                        await db.query(query, params);
                        console.log(`Cart deleted for user_id: ${user_id}`);
                    } catch (err) {
                        console.error('Failed to delete cart:', err);
                    }
                }
            }
        });
    };

    runConsumer().catch(console.error);
}