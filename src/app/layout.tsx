import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './globals.css'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>Eduverse</title>
      <body>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
