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

  const metrics = {
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
  };

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Метрики сервера</title>
  <style>
    body { font-family: monospace; max-width: 600px; margin: 40px auto; padding: 0 20px; background: #0d1117; color: #c9d1d9; }
    h1 { color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 10px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; margin: 12px 0; }
    .label { color: #8b949e; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 22px; color: #f0f6fc; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .meta { font-size: 12px; color: #8b949e; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Метрики сервера</h1>
  <div class="grid">
    <div class="card">
      <div class="label">Uptime</div>
      <div class="value">${metrics.uptime_human}</div>
    </div>
    <div class="card">
      <div class="label">Запросов обработано</div>
      <div class="value">${metrics.requests_total}</div>
    </div>
    <div class="card">
      <div class="label">Heap used</div>
      <div class="value">${metrics.memory.heap_used_mb} MB</div>
    </div>
    <div class="card">
      <div class="label">RSS</div>
      <div class="value">${metrics.memory.rss_mb} MB</div>
    </div>
  </div>
  <div class="meta">
    Node ${metrics.node_version} · ${metrics.env} · ${new Date().toISOString()}
  </div>
</body>
</html>`);
});

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

module.exports = router;
