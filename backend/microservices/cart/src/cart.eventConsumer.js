const { Kafka } = require('kafkajs');
const { dbDeleteCart } = require('./cart.repository');
const { confirmOrder } = require('./cart.eventProducer');

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
                    const { order_id, user_id } = data;
                    try {
                        await dbDeleteCart(user_id);
                        await confirmOrder(order_id, 'cart');
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