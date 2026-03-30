import { useMemo, useEffect, useState, useCallback } from "react";
import { useBookingsData } from "./useBookingsData";
import { useLiveLocation } from "./useLiveLocation";
import chatService from "../api/chatService";
import { useAuth } from "../context/AuthContext";

export function useCurrentBooking() {
  const bookingsData = useBookingsData();
  const { user } = useAuth();
  const [chatConversation, setChatConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const activeBooking = useMemo(
    () =>
      bookingsData.bookings.find((booking) =>
        ["EN_ROUTE", "ARRIVED", "ACCEPTED", "PENDING"].includes(booking.status)
      ) || null,
    [bookingsData.bookings]
  );

  const enRouteBooking = useMemo(
    () =>
      bookingsData.bookings.find((booking) =>
        ["EN_ROUTE", "ARRIVED"].includes(booking.status)
      ) || null,
    [bookingsData.bookings]
  );

  const liveLocationState = useLiveLocation(enRouteBooking?.id, {
    enabled: Boolean(enRouteBooking),
  });

  const loadConversation = useCallback(
    async (bookingId) => {
      if (!bookingId) return;
      setChatLoading(true);
      setChatError("");
      try {
        const { data: conversation } = await chatService.getConversation(bookingId);
        setChatConversation({
          id: conversation.id,
          bookingId,
          tradespersonName:
            conversation.tradespersonName || conversation.userName || "Tradesperson",
          lastMessageAt: conversation.lastMessage?.createdAt,
        });

        const { data } = await chatService.getMessages(conversation.id);
        const items = data?.content || [];
        setChatMessages(
          items
            .slice()
            .reverse()
            .map((msg) => ({
              id: msg.id,
              content: msg.content,
              createdAt: msg.createdAt,
              mine: msg.senderId === user?.id,
              attachment: msg.attachment,
            }))
        );
      } catch (err) {
        setChatError("Failed to load chat");
      } finally {
        setChatLoading(false);
      }
    },
    [bookingsData.userId, user?.id]
  );

  const sendMessage = useCallback(
    async (bookingId, { content, attachment }) => {
      if (!bookingId) return;
      try {
        await chatService.sendMessage(bookingId, { content, attachment });
        loadConversation(bookingId);
      } catch (err) {
        setChatError("Failed to send message");
      }
    },
    [loadConversation]
  );

  useEffect(() => {
    if (activeBooking?.id) {
      loadConversation(activeBooking.id);
    }
  }, [activeBooking?.id, loadConversation]);

  return {
    ...bookingsData,
    activeBooking,
    enRouteBooking,
    liveLocationState,
    chatConversation,
    chatMessages,
    chatLoading,
    chatError,
    loadConversation,
    sendMessage,
  };
}