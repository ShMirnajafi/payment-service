import client from "prom-client";

client.collectDefaultMetrics();

export const paymentCount = new client.Counter({
    name: "payment_requests_total",
    help: "Total number of payment requests",
});

export const rechargeGauge = new client.Gauge({
    name: "user_recharge_balance",
    help: "Balance added during recharge",
});
