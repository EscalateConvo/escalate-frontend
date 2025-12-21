import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Orb, type AgentState } from "@/components/ui/orb";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";
import { Phone, PhoneOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Conversation() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>(null);

  const signedUrl = location.state?.signedUrl as string | undefined;
  const attemptId = location.state?.attemptId as string | undefined;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setAgentState("listening");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      setAgentState(null);
      toast.success("Conversation ended");
      navigate(`/shared/${moduleId}`);
    },
    onError: (error: string) => {
      console.error("ElevenLabs error:", error);
      toast.error("Connection error occurred");
    },
    onModeChange: ({ mode }) => {
      if (mode === "speaking") {
        setAgentState("talking");
      } else if (mode === "listening") {
        setAgentState("listening");
      }
    },
  });

  useEffect(() => {
    if (!signedUrl || !attemptId) {
      toast.error("Invalid session. Please start the assessment again.");
      navigate(`/shared/${moduleId}`);
    }
  }, [signedUrl, attemptId, moduleId, navigate]);

  const handleStartConversation = async () => {
    if (!signedUrl) return;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setAgentState("thinking");
      await conversation.startSession({ signedUrl });
      setHasStarted(true);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setAgentState(null);
      toast.error(
        "Failed to start conversation. Please check your microphone permissions.",
      );
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  if (!signedUrl || !attemptId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12">
        {!hasStarted ? (
          <div className="text-center max-w-md">
            <div className="w-48 h-48 mx-auto mb-8">
              <Orb
                colors={["#14b8a6", "#06b6d4"]}
                agentState={agentState}
                className="w-full h-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Ready to Begin?
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              You'll be connected to an AI assistant for your assessment. Make
              sure your microphone is working and you're in a quiet environment.
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleStartConversation}
                className="w-full bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-6 h-auto rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Conversation
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/shared/${moduleId}`)}
                className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8">
              <Orb
                colors={["#14b8a6", "#06b6d4"]}
                agentState={agentState}
                className="w-full h-full"
              />
            </div>

            <p className="text-xl font-medium text-white mb-2">
              {conversation.status === "connected"
                ? agentState === "talking"
                  ? "AI is speaking..."
                  : agentState === "thinking"
                    ? "Thinking..."
                    : "Listening..."
                : "Connecting..."}
            </p>
            <p className="text-slate-400 mb-8">
              {conversation.status === "connected"
                ? agentState === "talking"
                  ? "Please wait while the AI responds"
                  : "Speak clearly into your microphone"
                : "Please wait while we establish connection"}
            </p>

            <Button
              onClick={handleEndConversation}
              variant="destructive"
              className="bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold px-8 py-6 h-auto rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
