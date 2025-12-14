import { useState, useRef, useEffect } from "react";
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
  const candidate = candidates.find((c) => c.id === candidateId);
  const job = jobs.find((j) => j.id === jobId || j.id === candidate?.jobId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !candidate) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text, candidate, job),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateAIResponse = (question: string, candidate: any, job: any): string => {
    const questionLower = question.toLowerCase();
    
    // Simple response generation based on candidate data
    if (questionLower.includes("react") || questionLower.includes("laravel")) {
      return `Yes, ${candidate.name} has experience with both React and Laravel.\n\nReact: Built a dashboard for e-commerce platform (Github: ${candidate.github || "N/A"})\nLaravel: Developed RESTful APIs for furniture SaaS\n\n${candidate.name} demonstrated strong alignment with our organizational values and the specific requirements of the ${job?.title || "Position"} role. The system notes exceptional synergy between the candidate's reported experience and our team culture.`;
    }
    
    if (questionLower.includes("experience") || questionLower.includes("years")) {
      return `${candidate.name} has ${candidate.level || "senior"} level experience. Based on the candidate's profile and application materials, they demonstrate strong technical skills and cultural fit for the ${job?.title || "position"}.`;
    }
    
    if (questionLower.includes("location") || questionLower.includes("where")) {
      return `${candidate.name} is located in ${candidate.location || "N/A"}. The candidate is ${job?.location ? (candidate.location?.includes(job.location) ? "in the same location" : "in a different location") : "location information available"}.`;
    }
    
    return `Based on ${candidate.name}'s profile and application materials, they appear to be a strong candidate for the ${job?.title || "position"}. The candidate has relevant experience and skills that align with the job requirements.`;
  };

  if (!candidate) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="AI Copilot" />
          <div className={styles.pageContent}>
            <div className={styles.errorMessage}>Candidate not found</div>
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
          <div className={styles.chatContainer}>
            <div className={styles.messagesArea}>
              {messages.length === 0 && (
                <div className={styles.emptyState}>
                  <p>Ask me anything about {candidate.name}</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.sender === "user" ? styles.userMessage : styles.aiMessage
                  }`}
                >
                  <p className={styles.messageText}>{message.text}</p>
                </div>
              ))}
              
              {isLoading && (
                <div className={`${styles.message} ${styles.aiMessage}`}>
                  <p className={styles.messageText}>Thinking...</p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
              <input
                type="text"
                className={styles.input}
                placeholder="Ask about candidate"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <FiSend size={20} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

