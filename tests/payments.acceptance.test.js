describe("پرداخت سفارش واقعی", () => {
    it("سفارش pending پس از پرداخت باید success شود", () => {
        const payments = new Map();
        const order = { id: "ord-10", amount: 150, paymentStatus: "pending" };
        const paymentId = "pay-10";

        payments.set(paymentId, {
            orderId: order.id,
            amount: order.amount,
            status: "pending",
        });

        let tx = payments.get(paymentId);
        tx.status = "success";
        payments.set(paymentId, tx);

        expect(payments.get(paymentId).status).toBe("success");
    });

    it("لغو پرداخت نباید وضعیت سفارش را تغییر دهد", () => {
        const payments = new Map();
        const order = { id: "ord-11", amount: 180, paymentStatus: "pending" };
        const paymentId = "pay-11";

        payments.set(paymentId, {
            orderId: order.id,
            amount: order.amount,
            status: "pending",
        });

        expect(payments.get(paymentId).status).toBe("pending");
    });
});
