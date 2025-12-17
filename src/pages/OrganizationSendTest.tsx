import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { createModule } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { ListChecks } from "lucide-react";

export default function OrganizationSendTest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [aiRole, setAiRole] = useState("");
  const [userRole, setUserRole] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [userEmails, setUserEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user?.type !== "ORGANIZATION") {
    return (
      <div className="p-8">
        <h2 className="text-xl font-medium">Not authorized</h2>
        <p className="text-muted-foreground">This page is only for organization accounts.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic || !aiRole || !userRole || !systemPrompt || !firstMessage || !problemStatement) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emails = userEmails
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Basic client-side email validation
    const invalid = emails.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (invalid) {
      toast.error(`Invalid email address: ${invalid}`);
      return;
    }

    const payload = {
      title,
      topic,
      difficulty,
      aiFields: {
        role: aiRole,
        systemPrompt,
        firstMessage,
      },
      userFields: {
        role: userRole,
        problemStatement,
      },
      userEmails: emails,
    };

    try {
      setSubmitting(true);
      console.debug("Assign test payload:", payload);
      await createModule(payload);
      toast.success("Test assigned successfully");
      navigate("/manage-tests");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMsg = (err.response && (err.response as any).data && (err.response as any).data.message) || err.message;
        console.error("API error creating module:", err.response || err.message);
        toast.error(serverMsg as string);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to assign test");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Assign a New Test</h1>
        <Link to="/manage-tests">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
            <ListChecks className="h-4 w-4" />
            Manage Tests
          </Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Customer Support Simulation" />
        </div>

        <div>
          <Label>Topic</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        </div>

        <div>
          <Label>AI Role</Label>
          <Input value={aiRole} onChange={(e) => setAiRole(e.target.value)} placeholder="Role the AI will play (e.g., Customer, Manager)" />
        </div>

        <div>
          <Label>User Role</Label>
          <Input value={userRole} onChange={(e) => setUserRole(e.target.value)} placeholder="Role the test taker will simulate (e.g., Support Agent)" />
        </div>

        <div>
          <Label>Difficulty</Label>
          <select className="w-full rounded-md border px-3 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        <div>
          <Label>System Prompt</Label>
          <textarea className="w-full rounded-md border px-3 py-2" rows={4} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Instructions for the AI agent's behavior" />
        </div>

        <div>
          <Label>First Message</Label>
          <textarea className="w-full rounded-md border px-3 py-2" rows={3} value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} placeholder="The initial message the AI will send" />
        </div>

        <div>
          <Label>Problem Statement</Label>
          <textarea className="w-full rounded-md border px-3 py-2" rows={4} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} placeholder="The problem or scenario the test taker needs to solve" />
        </div>

        <div>
          <Label>User Emails (comma separated)</Label>
          <Input value={userEmails} onChange={(e) => setUserEmails(e.target.value)} placeholder="user1@example.com, user2@example.com" />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={submitting}>{submitting ? 'Assigning...' : 'Assign Test'}</Button>
        </div>
      </form>
    </div>
  );
}
