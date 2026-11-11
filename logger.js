const { createLogger, format, transports } = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const extra = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
          return `${timestamp} [${level}]: ${message}${extra}`;
        })
      ),
    }),
  ],
});

if (process.env.LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
  logger.add(new LogtailTransport(logtail));
}

module.exports = logger;
