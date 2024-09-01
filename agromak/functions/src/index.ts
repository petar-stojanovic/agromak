/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import {ChatRoom} from "../../src/app/shared/models/chat-room";
import {AiMessage} from "../../src/app/shared/models/ai-message";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

admin.initializeApp();
const db = admin.firestore();


exports.sendNotificationOnNewMessage = onDocumentCreated(
  {
    document: "chats/{chatId}/messages/{messageId}",
    region: "europe-west1",
  },
  async ( event) => {
    const message = event.data?.data() as AiMessage;
    const chatId = event.params.chatId;

    const chatRoomRef = db.collection("chatRooms").doc(chatId);
    const chatRoom = await chatRoomRef.get();

    if (!chatRoom.exists) {
      console.error("Chat room does not exist!");
      return;
    }

    const chatData: ChatRoom = chatRoom.data() as ChatRoom;
    // eslint-disable-next-line max-len
    const recipientId = chatData.adOwnerId === message.from ? chatData.senderId : chatData.adOwnerId;

    const tokenDoc = await db.collection("fcmTokens").doc(recipientId).get();

    if (!tokenDoc.exists) {
      console.error("No FCM token found for user: ", recipientId);
      return;
    }

    const fcmToken = tokenDoc.data()?.token;

    const payload = {
      notification: {
        title: "New Message Received",
        body: message.message,
      },
      data: {
        chatId: chatId,
        adId: chatData.adId,
        adOwnerId: chatData.adOwnerId,
        senderId: chatData.senderId,
      },
      token: fcmToken,
    };

    admin.messaging().send(payload).then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  });
