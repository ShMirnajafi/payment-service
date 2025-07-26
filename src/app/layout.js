// app/layout.js
import "./globals.css";

export const metadata = {
    title: "My SuperApp",
};

export default function RootLayout({ children }) {
    return (
        <html lang="fa">
        <body>{children}</body>
        </html>
    );
}
