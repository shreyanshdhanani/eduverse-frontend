import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./(user-components)/header";
import Footer from "./(user-components)/footer";
import AiChatbot from "./(user-components)/AiChatbot";

export default function userLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <AiChatbot />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
