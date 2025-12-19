import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSharedModuleById } from "@/queries/moduleQueries";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
  MessageSquareText,
} from "lucide-react";

export default function SharedModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: module,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shared-module", moduleId],
    queryFn: () => getSharedModuleById(moduleId as string),
    enabled: !!moduleId && !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Module Not Found</h2>
          <p className="text-slate-500">
            The module does not exist or you don't have access.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/modules")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const attempt = module.attempt;
  const hasAttempt = attempt !== null;
  const isCompleted = hasAttempt && attempt.attemptStatus === "COMPLETED";
  const isOngoing = hasAttempt && attempt.attemptStatus === "ONGOING";
  const isPending = !hasAttempt || attempt.attemptStatus === "PENDING";

  const handleStartTest = () => {
    // TODO: Navigate to test taking page or trigger test start
    console.log("Starting test for module:", moduleId);
  };

  const handleContinueTest = () => {
    // TODO: Navigate to continue the ongoing test
    console.log("Continuing test for module:", moduleId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/modules")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{module.title}</h1>
          <p className="text-slate-500">{module.topic}</p>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-3">Instructions</h2>
        <p className="text-slate-600 mb-4">
          {module.userFields?.problemStatement}
        </p>

        {isPending && (
          <div className="mt-6">
            <Button
              onClick={handleStartTest}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Test
            </Button>
          </div>
        )}

        {isOngoing && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Test in progress</span>
            </div>
            <Button
              onClick={handleContinueTest}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Continue Test
            </Button>
          </div>
        )}
      </section>

      {isCompleted && attempt.attemptReport && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Assessment Results</h2>
          </div>

          {attempt.attemptReport.score !== undefined && (
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-medium text-slate-600">
                  Your Score
                </span>
              </div>
              <div className="text-4xl font-bold text-indigo-600">
                {attempt.attemptReport.score}
                <span className="text-lg text-slate-400 font-normal">/100</span>
              </div>
            </div>
          )}

          {attempt.attemptReport.feedback && (
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareText className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-700">Feedback</span>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap">
                {attempt.attemptReport.feedback}
              </p>
            </div>
          )}
        </section>
      )}

      {isCompleted && !attempt.attemptReport && (
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Assessment Completed</span>
          </div>
          <p className="text-slate-500 mt-2">
            Your results are being processed. Please check back later.
          </p>
        </section>
      )}
    </div>
  );
}
