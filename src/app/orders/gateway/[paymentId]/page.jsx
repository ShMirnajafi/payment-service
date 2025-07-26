"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentGateway() {
    const { paymentId } = useParams();
    const router = useRouter();

    const [order,       setOrder]       = useState(null);
    const [isRecharge, setIsRecharge] = useState(false);
    const [amount,     setAmount]     = useState(0);

    // فرم کارت
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry,     setExpiry]     = useState("");
    const [cvv,        setCvv]        = useState("");

    useEffect(() => {
        const payments = JSON.parse(localStorage.getItem("payments") || "{}");
        const payment  = payments[paymentId];
        if (!payment) return;

        if (payment.type === "order") {
            // بارگذاری اطلاعات سفارش
            const orders = JSON.parse(localStorage.getItem("orders") || "[]");
            const found  = orders.find(o => o.id === payment.orderId);
            if (found) setOrder(found);
            setAmount(payment.amount);
        } else {
            // حالت شارژ حساب
            setIsRecharge(true);
            setAmount(payment.amount);
        }
    }, [paymentId]);

    // نهایی‌سازی تراکنش
    function finalizePayment() {
        const payments = JSON.parse(localStorage.getItem("payments") || "{}");
        const payment  = payments[paymentId];

        if (isRecharge) {
            // بروزرسانی موجودی کاربر
            const user = JSON.parse(localStorage.getItem("user") || '{"balance":0}');
            user.balance += payment.amount;
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            // پرداخت سفارش
            let orders = JSON.parse(localStorage.getItem("orders") || "[]");
            orders = orders.map(o =>
                o.id === payment.orderId
                    ? { ...o, paymentStatus: "success", cancelReason: "" }
                    : o
            );
            localStorage.setItem("orders", JSON.stringify(orders));
        }

        // حذف نگاشت پرداخت و بازگشت به صفحه سفارش‌ها
        delete payments[paymentId];
        localStorage.setItem("payments", JSON.stringify(payments));
        router.push("/orders");
    }

    // لغو تراکنش
    function handleCancel() {
        const payments = JSON.parse(localStorage.getItem("payments") || "{}");
        // برای شارژ، نگاشت حذف شود
        if (isRecharge) {
            delete payments[paymentId];
            localStorage.setItem("payments", JSON.stringify(payments));
        }
        router.push("/orders");
    }

    if (!isRecharge && !order) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                در حال بارگذاری…
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isRecharge ? "شارژ حساب" : "درگاه پرداخت"}
                </h2>

                {isRecharge ? (
                    <p className="mb-4">مبلغ شارژ: <span className="font-medium">{amount.toLocaleString()} تومان</span></p>
                ) : (
                    <>
                        <p className="mb-2">سفارش: {order.id}</p>
                        <p className="mb-4">مبلغ: {amount.toLocaleString()} تومان</p>
                    </>
                )}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">شماره کارت</label>
                        <input
                            type="text"
                            placeholder="xxxx xxxx xxxx xxxx"
                            maxLength={19}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">نام دارنده کارت</label>
                        <input
                            type="text"
                            placeholder="نام و نام خانوادگی"
                            value={cardHolder}
                            onChange={e => setCardHolder(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm mb-1">تاریخ انقضا</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-sm mb-1">CVV</label>
                            <input
                                type="password"
                                placeholder="XXX"
                                maxLength={3}
                                value={cvv}
                                onChange={e => setCvv(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pt-2">
                        <button
                            type="button"
                            onClick={finalizePayment}
                            disabled={!(cardNumber && cardHolder && expiry && cvv)}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            پرداخت موفق
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            لغو
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
