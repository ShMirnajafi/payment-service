"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [user, setUser]     = useState({ balance: 0 });
    const router = useRouter();

    useEffect(() => {
        // seed سفارش‌ها
        if (!localStorage.getItem("orders")) {
            const initialOrders = [
                { id: "ord-1", amount: 100, paymentStatus: "success", cancelReason: "" },
                { id: "ord-2", amount: 200, paymentStatus: "failed",  cancelReason: "پرداخت ناموفق" },
                { id: "ord-3", amount: 150, paymentStatus: "pending", cancelReason: "" },
            ];
            localStorage.setItem("orders", JSON.stringify(initialOrders));
        }

        // seed پرداخت‌ها
        if (!localStorage.getItem("payments")) {
            localStorage.setItem("payments", JSON.stringify({}));
        }

        // seed کاربر
        if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify({ balance: 0 }));
        }

        setOrders(JSON.parse(localStorage.getItem("orders")));
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    // ایجاد تراکنش پرداخت سفارش
    function handlePay(order) {
        const paymentId = uuidv4();
        const payments  = JSON.parse(localStorage.getItem("payments"));
        payments[paymentId] = { type: "order", orderId: order.id, amount: order.amount };
        localStorage.setItem("payments", JSON.stringify(payments));
        router.push(`/orders/gateway/${paymentId}`);
    }

    // ایجاد تراکنش شارژ حساب
    function handleRecharge() {
        const amountStr = prompt("مبلغ شارژ را وارد کنید (تومان):");
        const amount    = Number(amountStr);
        if (!amount || amount <= 0) return;

        const paymentId = uuidv4();
        const payments  = JSON.parse(localStorage.getItem("payments"));
        payments[paymentId] = { type: "recharge", amount };
        localStorage.setItem("payments", JSON.stringify(payments));
        router.push(`/orders/gateway/${paymentId}`);
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-semibold mb-6">سفارش‌ها</h1>

            {/* نمایش موجودی و دکمه شارژ */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded shadow">
                <div>موجودی حساب شما: <span className="font-medium">{user.balance.toLocaleString()} تومان</span></div>
                <button
                    onClick={handleRecharge}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    شارژ حساب
                </button>
            </div>

            {/* جدول سفارش‌ها */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">مبلغ</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">وضعیت</th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">عملیات</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{o.id}</td>
                            <td className="px-6 py-4 text-sm">{o.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">
                  <span
                      className={`px-2 py-1 rounded-full text-xs ${
                          o.paymentStatus === "success"
                              ? "bg-green-100 text-green-800"
                              : o.paymentStatus === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {o.paymentStatus}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {o.paymentStatus === "pending" ? (
                                    <button
                                        onClick={() => handlePay(o)}
                                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        تکمیل سفارش
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/orders/${o.id}`)}
                                        className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                    >
                                        مشاهده سفارش
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
