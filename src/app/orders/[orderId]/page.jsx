"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderInvoice() {
    const { orderId } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const all = JSON.parse(localStorage.getItem("orders") || "[]");
        const found = all.find(o => o.id === orderId);
        if (!found) return;
        setOrder(found);
    }, [orderId]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                سفارش یافت نشد.
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">فاکتور سفارش</h2>
                <div className="space-y-2 text-gray-700">
                    <div>
                        <span className="font-medium">شناسه سفارش:</span> {order.id}
                    </div>
                    <div>
                        <span className="font-medium">مبلغ:</span> {order.amount.toLocaleString()} تومان
                    </div>
                    <div>
                        <span className="font-medium">وضعیت:</span>{" "}
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === "success"
                                    ? "bg-green-100 text-green-800"
                                    : order.paymentStatus === "failed"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
              {order.paymentStatus}
            </span>
                    </div>
                    {order.paymentStatus === "failed" && (
                        <div className="mt-4 p-4 bg-red-50 text-red-800 rounded">
                            <span className="font-medium">علت لغو:</span> {order.cancelReason}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => router.push("/orders")}
                    className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    بازگشت به فهرست سفارش‌ها
                </button>
            </div>
        </div>
    );
}
