"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const knowledgeBase = {
  // Nabla-X Products
  querymind: {
    keywords: ["querymind", "query mind", "sql", "database", "natural language", "nlp queries"],
    response: `QueryMind is our AI-powered natural language to SQL translator. It allows users to ask questions in plain English and automatically generates safe, optimized SQL queries. Key features include:

• Natural language processing for database queries
• Automatic safety guardrails and query optimization
• Risk detection to prevent dangerous operations
• Insight generation and visualization recommendations
• Support for complex multi-table joins and aggregations

QueryMind is perfect for data analysts, business users, and developers who want to access database insights without writing SQL.`,
  },
  datasentinel: {
    keywords: ["datasentinel", "data sentinel", "monitoring", "anomaly", "data quality"],
    response: `DataSentinel is our real-time data monitoring and anomaly detection system. It continuously watches your data pipelines and alerts you to issues before they become problems. Features include:

• Real-time anomaly detection with ML models
• Data quality monitoring and validation
• Automated alerting with severity classification
• Pipeline health tracking and diagnostics
• Integration with existing data infrastructure

DataSentinel helps teams maintain data reliability and catch issues early in regulated environments like healthcare and finance.`,
  },
  rootsense: {
    keywords: ["rootsense", "root sense", "explainability", "interpretability", "xai", "explain"],
    response: `RootSense provides explainable AI and model interpretability. It helps you understand why your ML models made specific predictions. Key capabilities:

• Feature importance analysis and rankings
• SHAP and LIME explanations for predictions
• Similar case retrieval and comparison
• Confidence scoring and uncertainty quantification
• Regulatory compliance support for AI decisions

RootSense is essential for teams in regulated industries who need to explain and justify AI decisions to auditors and stakeholders.`,
  },
  eduverse: {
    keywords: ["eduverse", "edu verse", "learning", "education", "training", "courses"],
    response: `Eduverse is our AI-powered learning platform that curates personalized educational content. It helps teams upskill in AI, data science, and related technologies. Features include:

• Personalized learning paths based on skill level
• Curated content from top sources (MIT, Stanford, etc.)
• Video tutorials, articles, and hands-on exercises
• Progress tracking and knowledge assessments
• Integration with your team's learning goals

Eduverse accelerates team learning and ensures everyone has access to high-quality, relevant educational resources.`,
  },

  // AI & Machine Learning
  machinelearning: {
    keywords: ["machine learning", "ml", "supervised", "unsupervised", "training models"],
    response: `Machine Learning (ML) is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. Key concepts:

• **Supervised Learning**: Training models with labeled data (e.g., classification, regression)
• **Unsupervised Learning**: Finding patterns in unlabeled data (e.g., clustering, dimensionality reduction)
• **Reinforcement Learning**: Learning through trial and error with rewards

Common algorithms include linear regression, decision trees, random forests, neural networks, and support vector machines. ML is used in recommendation systems, fraud detection, image recognition, and natural language processing.`,
  },
  deeplearning: {
    keywords: ["deep learning", "neural networks", "cnn", "rnn", "transformer"],
    response: `Deep Learning uses multi-layered neural networks to learn complex patterns from data. Key architectures:

• **Convolutional Neural Networks (CNNs)**: Excellent for image processing and computer vision
• **Recurrent Neural Networks (RNNs)**: Great for sequential data like text and time series
• **Transformers**: State-of-the-art for NLP tasks (powers GPT, BERT, etc.)
• **Autoencoders**: Used for dimensionality reduction and anomaly detection

Deep learning excels at tasks like image classification, speech recognition, natural language understanding, and generative AI. It requires large datasets and significant computational resources.`,
  },
  nlp: {
    keywords: ["nlp", "natural language processing", "text analysis", "sentiment", "tokenization"],
    response: `Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. Key techniques:

• **Tokenization**: Breaking text into words or subwords
• **Embeddings**: Representing words as dense vectors (Word2Vec, GloVe, BERT)
• **Named Entity Recognition**: Identifying people, places, organizations
• **Sentiment Analysis**: Determining emotional tone of text
• **Machine Translation**: Translating between languages

Modern NLP uses transformer models like GPT, BERT, and T5. Applications include chatbots, document summarization, question answering, and content generation.`,
  },

  // Data Science
  datascience: {
    keywords: ["data science", "analytics", "statistics", "data analysis"],
    response: `Data Science combines statistics, programming, and domain expertise to extract insights from data. Core components:

• **Data Collection**: Gathering data from databases, APIs, sensors, etc.
• **Data Cleaning**: Handling missing values, outliers, and inconsistencies
• **Exploratory Data Analysis**: Visualizing and understanding data patterns
• **Statistical Modeling**: Hypothesis testing, regression, time series analysis
• **Machine Learning**: Building predictive models
• **Communication**: Presenting findings through dashboards and reports

Common tools include Python (pandas, NumPy, scikit-learn), R, SQL, Tableau, and Jupyter notebooks.`,
  },
  python: {
    keywords: ["python", "pandas", "numpy", "scikit-learn", "python programming"],
    response: `Python is the most popular language for data science and AI. Key libraries:

• **NumPy**: Numerical computing with arrays and matrices
• **Pandas**: Data manipulation and analysis with DataFrames
• **Matplotlib/Seaborn**: Data visualization
• **Scikit-learn**: Machine learning algorithms and tools
• **TensorFlow/PyTorch**: Deep learning frameworks
• **Jupyter**: Interactive notebooks for analysis

Python's simplicity, extensive libraries, and community support make it ideal for data science, web scraping, automation, and AI development.`,
  },

  // Blockchain & Crypto
  blockchain: {
    keywords: ["blockchain", "distributed ledger", "cryptocurrency", "bitcoin", "ethereum"],
    response: `Blockchain is a distributed ledger technology that records transactions across multiple computers. Key features:

• **Decentralization**: No single point of control or failure
• **Immutability**: Once recorded, data cannot be altered retroactively
• **Transparency**: All transactions are visible to network participants
• **Smart Contracts**: Self-executing contracts with the terms written in code

Use cases include cryptocurrency (Bitcoin, Ethereum), supply chain tracking, digital identity, decentralized finance (DeFi), and NFTs. Blockchain provides security, transparency, and trust without intermediaries.`,
  },

  // Cloud & DevOps
  cloud: {
    keywords: ["cloud computing", "aws", "azure", "gcp", "cloud services"],
    response: `Cloud Computing delivers computing resources (servers, storage, databases, networking) over the internet. Major providers:

• **AWS (Amazon Web Services)**: EC2, S3, Lambda, SageMaker
• **Microsoft Azure**: Virtual Machines, Blob Storage, Azure ML
• **Google Cloud Platform**: Compute Engine, BigQuery, Vertex AI

Benefits include scalability, cost efficiency, global reach, and managed services. Common models are IaaS (Infrastructure), PaaS (Platform), and SaaS (Software) as a Service.`,
  },

  // Cybersecurity
  cybersecurity: {
    keywords: ["cybersecurity", "security", "encryption", "authentication", "data protection"],
    response: `Cybersecurity protects systems, networks, and data from digital attacks. Key concepts:

• **Encryption**: Protecting data with cryptographic algorithms (AES, RSA)
• **Authentication**: Verifying user identity (passwords, MFA, biometrics)
• **Authorization**: Controlling access to resources (RBAC, ABAC)
• **Firewalls**: Filtering network traffic based on security rules
• **Threat Detection**: Identifying malicious activities using ML and anomaly detection

Best practices include regular updates, security audits, employee training, and incident response planning.`,
  },

  // About Nabla-X
  nablax: {
    keywords: ["nabla-x", "nabla x", "company", "about", "who are you"],
    response: `Nabla-X is an AI intelligence company specializing in solutions for regulated environments like healthcare, finance, and government. We build:

• **QueryMind**: Natural language to SQL with safety guardrails
• **DataSentinel**: Real-time data monitoring and anomaly detection
• **RootSense**: Explainable AI and model interpretability
• **Eduverse**: Personalized AI/ML learning platform

Our mission is to make AI safe, explainable, and accessible in industries where trust and compliance are paramount. We focus on HIPAA compliance, SOC 2 certification, and enterprise-grade security.`,
  },
}

function findBestResponse(userInput: string): string {
  const input = userInput.toLowerCase()

  // Check each knowledge area
  for (const [_, data] of Object.entries(knowledgeBase)) {
    for (const keyword of data.keywords) {
      if (input.includes(keyword)) {
        return data.response
      }
    }
  }

  // General AI question patterns
  if (
    input.includes("what is") ||
    input.includes("explain") ||
    input.includes("how does") ||
    input.includes("tell me about")
  ) {
    return "I'd be happy to help! I have detailed information about:\n\n• Nabla-X products (QueryMind, DataSentinel, RootSense, Eduverse)\n• Machine Learning and Deep Learning\n• Natural Language Processing\n• Data Science and Python\n• Blockchain and Cryptocurrency\n• Cloud Computing\n• Cybersecurity\n\nPlease ask me about any of these topics!"
  }

  // Greeting
  if (input.includes("hello") || input.includes("hi ") || input === "hi" || input.includes("hey")) {
    return "Hello! I'm the Nabla-X AI Assistant. I can help you with:\n\n• Information about our products (QueryMind, DataSentinel, RootSense, Eduverse)\n• Questions about AI, machine learning, and data science\n• Technical topics like NLP, blockchain, cloud computing, and more\n\nWhat would you like to know?"
  }

  // Demo/pricing
  if (input.includes("demo") || input.includes("try")) {
    return "You can try our interactive demos at /demo! Each product has a hands-on simulation:\n\n• QueryMind: Convert natural language to SQL\n• DataSentinel: See real-time anomaly detection\n• RootSense: Explore model explanations\n• Eduverse: Browse curated learning content\n\nWould you like to schedule a personalized demo with our team? Visit our Contact page!"
  }

  if (input.includes("price") || input.includes("pricing") || input.includes("cost")) {
    return "Our pricing is customized based on your organization's needs, team size, and usage requirements. We offer:\n\n• Starter plans for small teams\n• Professional plans for growing organizations\n• Enterprise plans with dedicated support\n\nPlease contact our sales team for a personalized quote and to discuss which plan fits your needs best."
  }

  // Contact
  if (input.includes("contact") || input.includes("reach") || input.includes("talk to")) {
    return "You can reach us through our Contact page at /contact. Our team typically responds within 24 hours. You can also:\n\n• Schedule a call directly through our calendar\n• Email us with your specific requirements\n• Request a personalized demo\n\nWe look forward to hearing from you!"
  }

  // Default
  return "I'm not sure about that specific question, but I can help you with:\n\n• **Our Products**: QueryMind, DataSentinel, RootSense, and Eduverse\n• **AI Topics**: Machine learning, deep learning, NLP, neural networks\n• **Data Science**: Python, analytics, statistics, data visualization\n• **Technology**: Blockchain, cloud computing, cybersecurity\n\nCould you rephrase your question or ask about one of these areas?"
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm the Nabla-X AI Assistant. I can answer questions about our products (QueryMind, DataSentinel, RootSense, Eduverse) and topics like AI, machine learning, data science, blockchain, cloud computing, and more. How can I help you?",
    },
  ])

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).analytics) {
      ;(window as any).analytics.track(eventName, properties)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    trackEvent("Chatbot Message Sent", {
      message: userMessage.substring(0, 100),
      messageLength: userMessage.length,
    })

    // Add user message
    const newUserMsg = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      text: userMessage,
    }

    setMessages((prev) => [...prev, newUserMsg])
    setInput("")

    // Generate response
    setTimeout(() => {
      const response = findBestResponse(userMessage)
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        text: response,
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      trackEvent("Chatbot Closed", { method: "keyboard" })
    }
  }

  const toggleChatbot = () => {
    const newState = !isOpen
    setIsOpen(newState)
    trackEvent(newState ? "Chatbot Opened" : "Chatbot Closed", { method: "button" })
  }

  const quickSuggestions = [
    "Tell me about QueryMind",
    "What is machine learning?",
    "Explain blockchain",
    "How does RootSense work?",
  ]

  const handleSuggestionClick = (suggestion: string) => {
    trackEvent("Chatbot Suggestion Clicked", { suggestion })
    setInput(suggestion)

    // Automatically send the suggestion
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      text: suggestion,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      const response = findBestResponse(suggestion)
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        text: response,
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 500)
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#020617]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onKeyDown={handleKeyDown}
            className="fixed bottom-24 right-8 z-50 w-[420px] max-w-[calc(100vw-2rem)] max-h-[600px] flex flex-col"
            role="dialog"
            aria-label="AI Chat Assistant"
            aria-modal="true"
          >
            <Card className="bg-gradient-to-br from-[#0a0a0f] via-[#0f1622] to-[#0a0a0f] border-[#3b82f6]/30 shadow-2xl overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] p-4 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm" aria-hidden="true">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Nabla-X AI Assistant</h3>
                  <p className="text-xs text-blue-100">Ask me anything</p>
                </div>
                <motion.div
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  aria-label="Online status indicator"
                />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" role="log" aria-live="polite">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-[#3b82f6] text-white"
                          : "bg-[#1a1a2e] text-gray-100 border border-white/10"
                      } rounded-2xl p-3`}
                      role={msg.role === "assistant" ? "article" : undefined}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Quick suggestions - only show if no messages yet */}
                {messages.length === 1 && (
                  <div className="space-y-2 pt-2" role="group" aria-label="Suggested questions">
                    <p className="text-xs text-gray-400 px-1">Quick suggestions:</p>
                    {quickSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                        aria-label={`Send message: ${suggestion}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSend(e)
                        }
                      }}
                      placeholder="Ask me anything..."
                      className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] resize-none min-h-[44px] max-h-[120px]"
                      rows={1}
                      aria-label="Message input"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl px-4 h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-[#60a5fa]"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
