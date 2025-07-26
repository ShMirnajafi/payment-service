import { paymentCount } from "@/app/monitor/metrics";
import {payments} from "@/app/api/auth/payment/_data";

export async function POST(req) {
    const body = await req.json();
    const id = crypto.randomUUID();

    payments.set(id, {
        orderId: body.orderId,
        amount: body.amount,
        status: "pending",
    });

    paymentCount.inc();

    return Response.json({ paymentId: id });
}
