
"use client";

import { useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mb-6 text-gray-600">
          Your payment has been completed successfully.
        </p>

        {transactionId && (
          <div className="mb-6 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Transaction ID
            </p>
            <p className="mt-1 break-all text-sm font-medium text-gray-800">
              {transactionId}
            </p>
          </div>
        )}

        <a
          href="/"
          className="inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Go to HomePage
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

