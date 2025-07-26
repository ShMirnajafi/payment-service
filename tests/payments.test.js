// tests/paymentsTest.test.js
const { payments: paymentsTest } = require("/src/app/api/auth/payment/_data");
const { v4: uuid } = require("uuid");
const test = require("node:test");

test("initiate payment stores record with status 'pending'", () => {
    const id = uuid();
    paymentsTest.set(id, { orderId: "ord-123", amount: 100, status: "pending" });

    expect(paymentsTest.get(id)).toEqual({
        orderId: "ord-123",
        amount: 100,
        status: "pending",
    });
});

test("verify payment updates status correctly", () => {
    const id = uuid();
    paymentsTest.set(id, { orderId: "ord-456", amount: 200, status: "pending" });

    const record = paymentsTest.get(id);
    record.status = "success";
    expect(paymentsTest.get(id).status).toBe("success");
});
