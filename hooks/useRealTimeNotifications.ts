// hooks/useRealtimeNotifications.js
import { useEffect } from "react";
import { supabase } from "@/libs/supabaseClient";

export function useRealtimeNotifications(
  userId,
  notifications,
  setNotifications,
  setNewNotification
) {
  const handleChange = (payload) => {
    if (payload.errors?.length) {
      console.error("Error:", payload.errors);
    } else {
      const newNotification = payload.new;
      if (
        !notifications.length ||
        newNotification.id !== notifications[0]?.id
      ) {
        setNewNotification(true);
        setNotifications((prev) => [newNotification, ...prev]);
      }
    }
  };

  const channel = supabase
    .channel("public:Notification")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Notification",
        filter: `userId=eq.${userId}`,
      },
      handleChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
