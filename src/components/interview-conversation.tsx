"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mic, Video } from "lucide-react";
import { InterviewNote } from "./interview-notes";

interface ConversationProps {
  onAddNote: (note: Omit<InterviewNote, "id">) => void;
}

export function Conversation({ onAddNote }: ConversationProps) {
  const [audioPermission, setAudioPermission] = useState(false);
  const [videoPermission, setVideoPermission] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
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

  const startConversation = useCallback(async () => {
    try {
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_8101k1qrgs71e44tm1epnskd8n0d",
        connectionType: "websocket",
        clientTools: {
          takeInterviewNotes: async ({ about, note }) => {
            onAddNote({
              timestamp: new Date(),
              about,
              note,
            });
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, onAddNote]);

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
      </CardContent>
    </Card>
  );
}
