"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mic, Video, User, Bot } from "lucide-react";

interface Message {
  message: string;
  source: "user" | "ai";
  timestamp: Date;
}

interface ConversationProps {
  getProgressUpdateTool: () => { content: string };
  updateProgressUpdateTool: (content: string) => void;
}

export function Conversation({
  getProgressUpdateTool,
  updateProgressUpdateTool,
}: ConversationProps) {
  const [audioPermission, setAudioPermission] = useState(false);
  const [videoPermission, setVideoPermission] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => {
      console.log("Message:", message);
      // Add AI message to the conversation
      setMessages((prev) => [
        ...prev,
        {
          message: message.message ?? "AI message received",
          source: message.source ?? "ai",
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => console.error("Error:", error),
    onAudio: (audioEvent) => console.log("Audio event:", audioEvent),
  });

  const requestAudioPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioPermission(true);
      // Stop the stream since we only needed it for permission
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Failed to get audio permission:", error);
      setAudioPermission(false);
    }
  }, []);

  const requestVideoPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoPermission(true);
      setVideoStream(stream);
    } catch (error) {
      console.error("Failed to get video permission:", error);
      setVideoPermission(false);
    }
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = useCallback(async () => {
    try {
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_7101k3x6mg5meqqaht0kkzhq47q5",
        connectionType: "websocket",
        clientTools: {
          readProgressUpdate: async () => {
            const update = getProgressUpdateTool();
            return update.content;
          },
          updateProgressUpdate: async ({ content }) => {
            updateProgressUpdateTool(content);
            return "success";
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, getProgressUpdateTool, updateProgressUpdateTool]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "connected":
        return "default";
      case "connecting":
        return "secondary";
      case "disconnected":
        return "outline";
      default:
        return "outline";
    }
  };

  const allPermissionsGranted = audioPermission && videoPermission;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="space-y-4">
        {/* Permission Buttons */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Permissions</h3>
          <div className="flex gap-2">
            <Button
              onClick={requestAudioPermission}
              disabled={audioPermission}
              variant={audioPermission ? "default" : "outline"}
              className={audioPermission ? "bg-green-600" : ""}
              size="sm"
            >
              {audioPermission ? (
                <>
                  <Check className="w-4 h-4" />
                  Audio
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Enable Audio
                </>
              )}
            </Button>
            <Button
              onClick={requestVideoPermission}
              disabled={videoPermission}
              variant={videoPermission ? "default" : "outline"}
              className={videoPermission ? "bg-green-600" : ""}
              size="sm"
            >
              {videoPermission ? (
                <>
                  <Check className="w-4 h-4" />
                  Video
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Enable Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Video Stream */}
        {videoPermission && videoStream && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Camera Feed</h3>
            <div
              className="relative bg-black rounded-lg overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </div>
        )}

        {/* Conversation Buttons */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Conversation Controls</h3>
          <div className="flex gap-2">
            <Button
              onClick={startConversation}
              disabled={
                !allPermissionsGranted || conversation.status === "connected"
              }
              className="flex-1"
            >
              Start Conversation
            </Button>
            <Button
              onClick={stopConversation}
              disabled={
                !allPermissionsGranted || conversation.status !== "connected"
              }
              variant="destructive"
              className="flex-1"
            >
              Stop Conversation
            </Button>
          </div>
        </div>

        {/* Status Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={getStatusVariant(conversation.status)}>
              {conversation.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Agent State:</span>
            <Badge
              variant={conversation.isSpeaking ? "destructive" : "secondary"}
            >
              {conversation.isSpeaking ? "speaking" : "listening"}
            </Badge>
          </div>
        </div>

        {/* Conversation Messages */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Conversation</h3>
          <div className="max-h-64 overflow-y-auto space-y-3 border rounded-lg p-3 bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Start a conversation to see messages here
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    msg.source === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.source === "ai" && (
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.source === "user"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-white text-gray-800 border"
                    }`}
                  >
                    {msg.message}
                  </div>
                  {msg.source === "user" && (
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
