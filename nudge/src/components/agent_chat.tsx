'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function AgentChat() {
  const [chatInput, setChatInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user" as const, text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setChatInput('');
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chatInput }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot" as const, text: data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Error connecting to chatbot." }]);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>Agent Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-y-auto mb-2 bg-muted rounded p-2">
        <div className="flex flex-col gap-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="flex gap-2 p-2 border-t">
        <Input
          placeholder="Type your message..."
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) sendChat(); }}
          disabled={loading}
        />
        <Button onClick={sendChat} disabled={loading || !chatInput.trim()}>
          Send
        </Button>
      </div>
    </Card>
  );
}