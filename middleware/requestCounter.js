let requestCount = 0;

function requestCounter(req, res, next) {
  requestCount++;
  next();
}

function getRequestCount() {
  return requestCount;
}

module.exports = { requestCounter, getRequestCount };
