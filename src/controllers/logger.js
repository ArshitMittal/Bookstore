

const pino = require('pino');
const pinoPretty = require('pino-pretty');

// Set up the writable stream for the log file

// Set up the logger with pino.extreme mode for plain JSON logs to the file
const logger = pino({

    transport: {

      target: 'pino-pretty',

      options: {

        colorize: true,

        translateTime: 'dd-mm-yyyy HH:MM:ss',

        destination: `/Users/arshit.mittal/Desktop/Bookstore/src/db/app.log`

      }

    }

  }

  )

module.exports = logger;
