export function logEvent(event, details = {}) {
    console.log(`[${new Date().toISOString()}] ${event}`, details);
}
// simple performance logger
setInterval(() => {
    console.log("🧠 Heap:", process.memoryUsage().heapUsed);
    console.log("⚙️ CPU load:", process.cpuUsage());
}, 60000);
