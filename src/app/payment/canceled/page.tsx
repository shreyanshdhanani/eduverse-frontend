export default function PaymentFailed() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Failed</h1>
          <p className="text-gray-700 mb-6">Oops! Something went wrong with your transaction. Please try again.</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Go Back
          </a>
        </div>
      </div>
    );
  }
  