"use client";

import { useEffect } from "react";

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
          
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  if (window.confirm("New version available! Reload to update?")) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_UPDATED") {
          console.log("Cache updated");
        }
      });

      // Handle online/offline status
      const handleOnline = () => {
        console.log("App is online");
        // Sync any pending data
        if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (registration as any).sync.register("background-sync");
          });
        }
      };

      const handleOffline = () => {
        console.log("App is offline");
        // Show offline indicator
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return null;
};

export default ServiceWorkerRegistration;