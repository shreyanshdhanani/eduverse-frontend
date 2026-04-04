export default function PaymentSuccess() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
          <p className="text-gray-700 mb-6">Thank you for your purchase. Your transaction was completed successfully.</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  