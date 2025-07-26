import client from "prom-client";

export async function GET() {
    return new Response(await client.register.metrics(), {
        headers: { "Content-Type": client.register.contentType },
    });
}
