"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <BootstrapClient />
        <div className="container-fluid">
          <div className="row">
            <div className="p-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
