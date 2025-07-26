import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { payments } from "../../_data";

const SECRET = process.env.JWT_SECRET;

function verifyAuth(request) {
    const header = request.headers.get("authorization") || "";
    const token = header.split(" ")[1];
    return jwt.verify(token, SECRET);
}

export async function GET(request, { params }) {
    try {
        verifyAuth(request);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const record = payments.get(params.paymentId);
    if (!record) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ paymentId: params.paymentId, ...record });
}

export async function POST(request, { params }) {
    try {
        verifyAuth(request);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { status } = await request.json();
    if (!["success", "failed"].includes(status)) {
        return NextResponse.json({ error: "Bad Status" }, { status: 400 });
    }
    const record = payments.get(params.paymentId);
    if (!record) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    record.status = status;
    payments.set(params.paymentId, record);
    return NextResponse.json({ paymentId: params.paymentId, status });
}
