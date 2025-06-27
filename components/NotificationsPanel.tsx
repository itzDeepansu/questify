import React, { useState, useEffect } from "react";
import axios from "@/libs/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
const NotificationsPanel = ({
  user,
  notifications,
  setNotifications,
  setNewNotification,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setNewNotification(false);
    const getNotifications = async () => {
      setIsSearching(true);
      const res = await axios.post("/notifications/getNotifications", {
        userId: user.id,
      });
      setNotifications(res.data.notifications);
      setIsSearching(false);
    };
    getNotifications();
  }, [user]);
  const handleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    axios.put("/notifications/updateNotificationStatus", { id: id });
  };
  const formatDate = (createdAt) => {
    const date = new Date(createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return date;
  };
  const handleNotificationClick = (notificationId, type_id) => {
    handleNotificationRead(notificationId);
    router.push(`/question/${type_id}`);
  };
  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-scroll w-96">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 hover:bg-[#ecb632] transition-colors duration-500 ease-in-out flex items-start gap-3 rounded-lg border relative"
          onClick={() =>
            handleNotificationClick(notification.id, notification.type_id)
          }
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={notification?.actor_image || "/questify_logo.png"}
            />
            <AvatarFallback>
              {notification?.actor_username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 align-middle">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">
                {notification?.actor_username}
              </span>{" "}
              {notification.content}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(notification.createdAt)}
            </p>
          </div>
          <X
            className="absolute top-5 right-2 cursor-pointer hover:text-red-500 hover:bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleNotificationRead(notification.id);
            }}
          />
        </div>
      ))}
      {!notifications.length && !isSearching && (
        <div className="p-4 text-center text-gray-500">No Notifications</div>
      )}
      {isSearching && (
        <Loader2 className="text-gray-400 w-10 h-10 animate-spin ml-auto mr-auto py-2" />
      )}
    </div>
  );
};

export default NotificationsPanel;
