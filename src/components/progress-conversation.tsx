"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mic, User, Bot, Send, Check, Phone } from "lucide-react";

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
  const [inputMessage, setInputMessage] = useState("");
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const requestPermissions = useCallback(async () => {
    try {
      // Request audio permission
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioPermission(true);
      audioStream.getTracks().forEach((track) => track.stop());

      // Request video permission and keep the stream active
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoPermission(true);
      setVideoStream(videoStream);

      return true;
    } catch (error) {
      console.error("Failed to get permissions:", error);
      return false;
    }
  }, []);

  const startConversation = useCallback(async () => {
    try {
      // First request permissions
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) {
        console.error("Failed to get required permissions");
        return;
      }

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
  }, [
    conversation,
    getProgressUpdateTool,
    updateProgressUpdateTool,
    requestPermissions,
  ]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      // Add user message to conversation
      setMessages((prev) => [
        ...prev,
        {
          message: inputMessage.trim(),
          source: "user",
          timestamp: new Date(),
        },
      ]);

      // Print to console as requested
      console.log({
        message: inputMessage.trim(),
        source: "user",
      });

      // Clear input field
      setInputMessage("");
    }
  }, [inputMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 h-full flex flex-col">
        {/* Status Header */}
        {/* <div className="space-y-3 border-b pb-4">
          <h3 className="text-md font-semibold text-center">
            Edit your progress update via chat
          </h3>

          Video Stream
          {videoPermission && videoStream && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-center">Camera Feed</h4>
              <div className="flex justify-center">
                <div
                  className="relative bg-black rounded-lg overflow-hidden"
                  style={{ aspectRatio: "16/9", width: "120px" }}
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
            </div>
          )}
        </div> */}

        {/* Conversation Messages */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Edit your progress update via chat
            </h3>
            {conversation.status !== "connected" ? (
              <Badge
                variant="outline"
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={startConversation}
              >
                <Phone className="w-3 h-3" />
                <span>Start Conversation</span>
              </Badge>
            ) : (
              <Badge
                variant={conversation.isSpeaking ? "default" : "secondary"}
                className="flex items-center gap-2"
              >
                {conversation.isSpeaking ? (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-current rounded-full animate-pulse"></div>
                      <div
                        className="w-1 h-3 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-3 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span>Speaking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3" />
                    <span>Listening</span>
                  </>
                )}
              </Badge>
            )}
          </div>
          <div className="flex-1 border rounded-lg p-3 bg-gray-50 relative min-h-0 overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-56">
                <Button
                  onClick={startConversation}
                  disabled={
                    conversation.status === "connected" ||
                    conversation.status === "connecting"
                  }
                  className={`w-16 h-16 rounded-full p-0 ${
                    audioPermission && videoPermission
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </Button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  {conversation.status === "connecting"
                    ? "Connecting..."
                    : audioPermission && videoPermission
                    ? "Click to start conversation"
                    : "Click to enable permissions and start conversation"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 h-full overflow-y-auto">
                {messages.map((msg, index) => (
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
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Stop conversation button when active */}
            {conversation.status === "connected" && (
              <div className="absolute bottom-3 right-3">
                <Button
                  onClick={stopConversation}
                  variant="destructive"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
