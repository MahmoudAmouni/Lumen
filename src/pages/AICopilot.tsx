import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/AICopilot.module.css";
import { useData } from "../context/DataContext";
import { FiSend } from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AICopilot() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");

  const { candidates, jobs } = useData();

  const candidate = useMemo(
    () => candidates.find((c) => c.id === candidateId),
    [candidates, candidateId]
  );

  const job = useMemo(
    () => jobs.find((j) => j.id === jobId || j.id === candidate?.jobId),
    [jobs, jobId, candidate?.jobId]
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("react") || q.includes("laravel")) {
      return `Yes, ${
        candidate?.name
      } has experience with both React and Laravel.

React: Built a dashboard for e-commerce platform (Github: ${
        candidate?.github || "N/A"
      })
Laravel: Developed RESTful APIs for furniture SaaS

${
  candidate?.name
} demonstrated strong alignment with our values and the requirements of the ${
        job?.title || "position"
      }.`;
    }

    if (q.includes("experience") || q.includes("years")) {
      return `${candidate?.name} has ${
        candidate?.level || "senior"
      } level experience and shows strong fit for ${
        job?.title || "this role"
      }.`;
    }

    if (q.includes("location") || q.includes("where")) {
      return `${candidate?.name} is located in ${
        candidate?.location || "N/A"
      }.`;
    }

    return `Based on ${
      candidate?.name
    }'s profile, they appear to be a strong candidate for the ${
      job?.title || "position"
    }.`;
  };

  const handleSend = async () => {
    if (!candidate) return;
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        text: generateAIResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!candidate) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="AI Copilot" />
          <div className={styles.pageContent}>
            <div className={styles.stateCard}>
              <p className={styles.stateText}>Candidate not found</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CandidateSidebar />

      <div className={styles.main}>
        <Header title="AI Copilot" />

        <div className={styles.pageContent}>
          <div className={styles.chatShell}>
            {/* Top context card */}
            <div className={styles.contextCard}>
              <div className={styles.contextLeft}>
                <h2 className={styles.contextTitle}>
                  Ask about {candidate.name}
                </h2>
                <p className={styles.contextMeta}>
                  {job?.title || "N/A"} • {candidate.stage || "stage"}
                </p>
              </div>
              <span className={styles.badge}>COPILOT</span>
            </div>

            {/* Messages */}
            <div className={styles.messagesArea} role="log" aria-live="polite">
              {messages.length === 0 && !isLoading && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>Start a conversation</p>
                  <p className={styles.emptyText}>
                    Ask about skills, experience, fit, or anything in the
                    profile.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${
                    message.sender === "user" ? styles.rowUser : styles.rowAI
                  }`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.sender === "user"
                        ? styles.userBubble
                        : styles.aiBubble
                    }`}
                  >
                    <p className={styles.messageText}>{message.text}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className={`${styles.messageRow} ${styles.rowAI}`}>
                  <div className={`${styles.messageBubble} ${styles.aiBubble}`}>
                    <p className={styles.messageText}>Thinking…</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputBar}>
              <input
                type="text"
                className={styles.input}
                placeholder="Ask about candidate…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                type="button"
              >
                <FiSend />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
