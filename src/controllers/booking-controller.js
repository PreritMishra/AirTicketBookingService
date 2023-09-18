const {StatusCodes} = require('http-status-codes')

const {BookingService} = require('../services/index');
const {createChannel, publishMessage} = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');
const bookingService = new BookingService();

class BookingController {
    constructor(){}

    async sendMessageToQueue (req,res) {
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is noti from queue',
                content: 'Some queue will subscribe this',
                recepientEmail: 'prerit1.mishra@gmail.com',
                notificationTime: '2023-09-17T11:46:00.000Z'
            },
            service: 'CREATE_TICKET'
        }
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }

    async create (req,res) {
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("FROM BOOKING CONTROLLER", response);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed Booking',
                success: true,
                err: {},
                data: response
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: {},
                data: error.explanation
            });
        }
    }
}

module.exports = BookingController;