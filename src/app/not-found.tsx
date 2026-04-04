export default function NotFound() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex w-10/12 max-w-6xl rounded-lg overflow-hidden">
          {/* Left Side: SVG Image */}
          <div className="w-1/2 flex justify-center items-center">
            <img
              src="/404.svg"  // Replace with your own SVG or image path
              alt="404 Illustration"
              className="w-3/4 h-auto object-contain"  // Smaller image size
            />
          </div>
  
          {/* Right Side: 404 Message */}
          <div className="w-1/2 p-12 flex flex-col justify-center items-start">
            <h1 className="text-5xl font-bold text-gray-900">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-4 text-lg">Oops! The page you are looking for does not exist.</p>
            <a
              href="/"
              className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  