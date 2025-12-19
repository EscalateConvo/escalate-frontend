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
  UserCircle,
  Sparkles,
  BookOpen,
  Clock,
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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-rose-100 to-orange-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Module Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            The module does not exist or you don't have access to view it.
          </p>
          <Button
            onClick={() => navigate("/modules")}
            variant="outline"
            className="border-slate-300 hover:bg-slate-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
          </Button>
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-start gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/modules")}
            className="mt-1 hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                {module.title}
              </h1>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
              {isOngoing && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 animate-pulse">
                  <Clock className="w-3 h-3" />
                  In Progress
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium">{module.topic}</p>
          </div>
        </div>

        {module.userFields?.role && (
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-500 via-teal-500 to-emerald-500 p-px">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                  Your Role
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {module.userFields.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-teal-50 to-transparent rounded-bl-full opacity-60" />
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Instructions</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              {module.userFields?.problemStatement}
            </p>

            {isPending && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <Button
                  onClick={handleStartTest}
                  className="bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-8 py-6 h-auto rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Assessment
                </Button>
              </div>
            )}

            {isOngoing && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                  <RotateCcw
                    className="w-4 h-4 text-amber-600 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <span className="text-sm font-semibold text-amber-700">
                    Assessment in progress
                  </span>
                </div>
                <div>
                  <Button
                    onClick={handleContinueTest}
                    className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 h-auto rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Continue Assessment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {isCompleted && attempt.attemptReport && (
          <section className="rounded-2xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6" />
                <h2 className="text-xl font-bold">Assessment Results</h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {attempt.attemptReport.score !== undefined && (
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-teal-500/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-cyan-500/20 to-transparent rounded-tr-full" />
                  <div className="relative flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-1">
                        Your Score
                      </p>
                      <div className="text-5xl font-black text-white">
                        {attempt.attemptReport.score}
                        <span className="text-2xl text-slate-500 font-semibold ml-1">
                          / 100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {attempt.attemptReport.feedback && (
                <div className="rounded-2xl bg-linear-to-br from-slate-50 to-teal-50/50 border border-slate-200/60 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                      <MessageSquareText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">Feedback</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {attempt.attemptReport.feedback}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {isCompleted && !attempt.attemptReport && (
          <section className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-800">
                  Assessment Completed
                </h3>
                <p className="text-emerald-600">
                  Your results are being processed. Please check back later.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
