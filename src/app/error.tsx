"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    // non-blocking notification
    toast({ title: "Something went wrong", description: error?.message });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: 40 }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error?.message}</pre>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => reset()} style={{ marginRight: 8 }}>Try again</button>
            <button onClick={() => location.reload()}>Reload page</button>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
