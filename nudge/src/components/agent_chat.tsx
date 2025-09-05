'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function AgentChat() {
  const [chatInput, setChatInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);


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
    <Tabs defaultValue="chat" className="flex w-[45%] h-[95%]">
      <TabsList>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <Card className="bg-neutral-800 h-full" >
          <CardHeader>
            <CardTitle className="text-white">Agent Chat</CardTitle>
          </CardHeader>
          <CardContent className="bg-neutral-800 h-full">
            <div className="flex flex-col gap-2 h-full overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-slate-600 text-white"
                        : "bg-stone-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <div className="flex gap-2 p-2">
            <Input
              className="text-white placeholder-gray-400 bg-neutral-700"
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
      </TabsContent>
      <TabsContent value="analysis">
        <Card className="bg-neutral-800 h-full w-full">
          <CardHeader>
            <CardTitle className="text-white">Code Analysis</CardTitle>
          </CardHeader>
          <CardContent className="bg-neutral-800">
            <div className="flex flex-col gap-2">
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg max-w-[80%] bg-stone-600 text-white">
                  Analysis results will appear here.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}