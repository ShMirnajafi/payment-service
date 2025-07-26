// app/lib/logger.js
export function logEvent(event, details = {}) {
    console.log(`[${new Date().toISOString()}] ${event}`, details);
}
