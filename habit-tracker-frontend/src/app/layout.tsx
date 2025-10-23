import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Habit Tracker",
  description: "Simple Habit Tracker built with Next.js and TailwindCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
