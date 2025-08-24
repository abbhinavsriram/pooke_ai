'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AgentChat() {
  const [chatInput, setChatInput] = React.useState('');
  const [chatReply, setChatReply] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setChatReply('');
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatReply(data.reply);
    } catch {
      setChatReply("Error connecting to chatbot.");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Agent Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Ask the agent..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
            disabled={loading}
          />
          <Button onClick={sendChat} disabled={loading || !chatInput.trim()}>
            Send
          </Button>
        </div>
        <div className="min-h-[40px] bg-muted rounded p-2">
          <span className="font-semibold">Bot:</span>{" "}
          {loading ? <span className="italic text-muted-foreground">Thinking...</span> : chatReply}
        </div>
      </CardContent>
    </Card>
  );
}