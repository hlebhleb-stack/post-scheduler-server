const express = require("express");
const router = express.Router();
const { getRequestCount } = require("../middleware/requestCounter");

const startTime = Date.now();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.get("/metrics", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const mem = process.memoryUsage();

  res.status(200).json({
    uptime_seconds: uptimeSeconds,
    uptime_human: formatUptime(uptimeSeconds),
    memory: {
      rss_mb: (mem.rss / 1024 / 1024).toFixed(2),
      heap_used_mb: (mem.heapUsed / 1024 / 1024).toFixed(2),
      heap_total_mb: (mem.heapTotal / 1024 / 1024).toFixed(2),
    },
    requests_total: getRequestCount(),
    node_version: process.version,
    env: process.env.NODE_ENV || "development",
  });
});

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

module.exports = router;
