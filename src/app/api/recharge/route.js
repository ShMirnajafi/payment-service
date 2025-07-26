import { rechargeGauge } from "@/app/monitor/metrics";

export async function POST(req) {
    const body = await req.json();
    const amount = parseFloat(body.amount);

    const prevBalance = parseFloat(localStorage.getItem("user.balance")) || 0;
    const newBalance = prevBalance + amount;

    localStorage.setItem("user.balance", newBalance);
    rechargeGauge.set(newBalance);

    return Response.json({ status: "success", balance: newBalance });
}
