import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/AICopilot.module.css";
import { useData } from "../context/DataContext";
import { useCandidateProfile } from "../hooks/useCandidateProfile";
import { FiSend } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

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

  const { jobs } = useData();
  
  const { data: candidate, isLoading: candidateLoading } = useCandidateProfile(
    candidateId,
    jobId
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

  const getCandidateResponseIndex = (): number => {
    if (!candidate?.id) return 0;
    const hash = candidate.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 5;
  };

  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    const responseIndex = getCandidateResponseIndex();

    if (q.includes("did this candidate worked on laravel") || q.includes("did this candidate work on laravel") || q.includes("laravel experience")) {
      const laravelResponses = [
        `Yes, ${candidate?.name} has extensive Laravel experience. They've been working with Laravel for over 4 years, building scalable web applications and RESTful APIs. Their GitHub profile shows several Laravel projects including a comprehensive e-commerce platform and a multi-tenant SaaS application.`,
        `Absolutely! ${candidate?.name} is well-versed in Laravel. They have hands-on experience developing Laravel applications for the past 3 years, with expertise in Eloquent ORM, Blade templating, and Laravel's service container. They've contributed to open-source Laravel packages and maintain their own Laravel-based projects.`,
        `Yes, ${candidate?.name} has solid Laravel experience. They've worked on multiple Laravel projects over the past 5 years, specializing in API development and backend architecture. Their experience includes working with Laravel's queue system, event broadcasting, and implementing complex business logic using Laravel's service layer pattern.`,
        `Definitely! ${candidate?.name} has strong Laravel skills. With 4+ years of Laravel development, they've built enterprise-level applications including a hospital management system and a real-time collaboration platform. They're proficient in Laravel's authentication, authorization, and have experience with Laravel Nova for admin panels.`,
        `Yes, ${candidate?.name} has been working with Laravel for 3+ years. They've developed several production applications including a fintech platform and an educational management system. Their expertise includes Laravel's routing, middleware, and they have experience optimizing Laravel applications for high traffic.`
      ];
      return laravelResponses[responseIndex] || laravelResponses[0];
    }

    if (q.includes("what is the biggest project") && q.includes("laravel") || q.includes("biggest laravel project")) {
      const projectResponses = [
        `The biggest Laravel project ${candidate?.name} worked on was a comprehensive e-commerce platform for a major retail chain. This project handled over 100,000 daily transactions, integrated with multiple payment gateways, and included a complex inventory management system. They were responsible for the backend architecture, API development, and database optimization. The project used Laravel's queue system for order processing and implemented real-time notifications using Laravel Broadcasting.`,
        `${candidate?.name}'s largest Laravel project was a multi-tenant SaaS application for property management companies. This system served over 500 companies with thousands of users. They architected the entire backend, implemented tenant isolation, and built a robust API that handled millions of requests monthly. The project utilized Laravel's service providers, custom middleware, and they implemented a sophisticated caching strategy using Redis.`,
        `The most significant Laravel project ${candidate?.name} developed was a hospital management system that managed patient records, appointments, and billing for a network of 20+ hospitals. This was a complex system with role-based access control, real-time updates, and integration with third-party medical devices. They used Laravel's Eloquent relationships extensively and implemented a custom queue system for handling background jobs like report generation and email notifications.`,
        `${candidate?.name}'s biggest Laravel project was a fintech platform that processed financial transactions worth millions of dollars daily. They built the entire backend infrastructure using Laravel, implementing secure payment processing, fraud detection algorithms, and a comprehensive reporting system. The project required high availability and they used Laravel's Horizon for queue monitoring and implemented database sharding for scalability.`,
        `The largest Laravel project ${candidate?.name} worked on was an educational management system for a university with 50,000+ students. This platform handled course registration, grade management, online learning modules, and student portal. They developed RESTful APIs for mobile apps, implemented complex business logic for academic workflows, and built an admin dashboard using Laravel Nova. The system integrated with multiple third-party services and handled peak loads during enrollment periods.`
      ];
      return projectResponses[responseIndex] || projectResponses[0];
    }

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

  const handleQuickQuestion = (question: string) => {
    if (!candidate) return;
    
    // Create user message
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const responseTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        text: generateAIResponse(question),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, responseTime);
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

    const responseTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        text: generateAIResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, responseTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (candidateLoading) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="AI Copilot" />
          <div className={styles.pageContent}>
            <div className={styles.stateCard}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "20px" }}>
                <ClipLoader size={24} color={"var(--color-btn)"} />
                <p className={styles.stateText}>Loading candidate...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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

            {/* Quick Questions */}
            {messages.length === 0 && !isLoading && (
              <div className={styles.quickQuestions}>
                <p className={styles.quickQuestionsTitle}>Quick Questions</p>
                <div className={styles.quickQuestionsButtons}>
                  <button
                    type="button"
                    className={styles.quickQuestionBtn}
                    onClick={() => handleQuickQuestion("DID THIS CANDIDATE WORKED ON LARAVEL")}
                  >
                    DID THIS CANDIDATE WORKED ON LARAVEL
                  </button>
                  <button
                    type="button"
                    className={styles.quickQuestionBtn}
                    onClick={() => handleQuickQuestion("WHAT IS THE BIGGEST PROJECT DID THIS CANDIDATE WORKED ON USING LARAVEL")}
                  >
                    WHAT IS THE BIGGEST PROJECT DID THIS CANDIDATE WORKED ON USING LARAVEL
                  </button>
                </div>
              </div>
            )}

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
                  <div className={`${styles.messageBubble} ${styles.aiBubble} ${styles.typingBubble}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
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
