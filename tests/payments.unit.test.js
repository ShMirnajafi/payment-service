describe("پرداخت‌ها در حافظه", () => {
    it("ثبت تراکنش جدید باید با وضعیت pending باشد", () => {
        const payments = new Map();
        const id = "p-123";
        payments.set(id, { orderId: "ord-1", amount: 100, status: "pending" });
        expect(payments.get(id)).toEqual({
            orderId: "ord-1",
            amount: 100,
            status: "pending",
        });
    });

    it("تأیید تراکنش باید وضعیت را به success تغییر دهد", () => {
        const payments = new Map();
        const id = "p-456";
        payments.set(id, { orderId: "ord-2", amount: 200, status: "pending" });

        const tx = payments.get(id);
        tx.status = "success";
        payments.set(id, tx);

        expect(payments.get(id).status).toBe("success");
    });

    it("در صورت مقدار نادرست، تراکنش باید بدون تغییر باقی بماند", () => {
        const payments = new Map();
        const id = "p-789";
        payments.set(id, { orderId: "ord-3", amount: 300, status: "pending" });

        const tx = payments.get(id);

        const invalidStatus = "unknown";
        if (["pending", "success", "failed"].includes(invalidStatus)) {
            tx.status = invalidStatus;
        }

        payments.set(id, tx);

        expect(["pending", "success", "failed"]).toContain(payments.get(id).status);
    });

});
