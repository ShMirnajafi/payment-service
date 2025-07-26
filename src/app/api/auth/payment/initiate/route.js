// app/api/payments/initiate/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { payments } from "../_data";

const SECRET = process.env.JWT_SECRET;

function verifyAuth(request) {
    const header = request.headers.get("authorization") || "";
    const token = header.split(" ")[1];
    return jwt.verify(token, SECRET);
}

export async function POST(request) {
    try {
        verifyAuth(request);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount } = await request.json();
    if (!orderId || !amount) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const paymentId = uuidv4();
    payments.set(paymentId, { orderId, amount, status: "pending" });

    return NextResponse.json({
        paymentId,
        url: `/gateway/${paymentId}`,
    });
}
