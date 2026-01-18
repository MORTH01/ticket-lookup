import "./globals.css";

export const metadata = {
  title: "Ticket Lookup",
  description: "Check ticket details",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
