import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ModalProvider } from "@/components/ModalProvider";

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
        <ModalProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </ModalProvider>
      </body>
    </html>
  );
}
