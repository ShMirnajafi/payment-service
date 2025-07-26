import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    const { username, password } = await request.json();
    if (password !== "password") {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: "2h" });
    return NextResponse.json({ token });
}
