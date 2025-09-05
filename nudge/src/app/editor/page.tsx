'use client'
import Editor from '../../components/monaco_editor';
import React, { useState } from 'react';
import AgentChat from '@/components/agent_chat';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const languages = [
  { label: 'Java', value: ['java', '// enter your code here'] },
  { label: 'Python', value: ['python', '# enter your code here'] },
  { label: 'JavaScript', value: ['javascript', '// enter your code here'] },
  { label: 'C++', value: ['cpp', '// enter your code here'] },
  { label: 'C', value: ['c', '// enter your code here'] },
];

const pistonLanguageMap: Record<string, [string, string]> = {
  python: ['python3', "3.10.0"],
  java: ['java', "15.0.2"],
  javascript: ['javascript', "18.15.0"],
  cpp: ['cpp', "10.2.0"],
  c: ['c', "10.2.0"],
};

export default function EditorPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# enter your code here');
  const [output, setOutput] = useState('');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = languages.find(lang => lang.value[0] === e.target.value);
    setLanguage(selected?.value[0] || 'python');
    setCode(selected?.value[1] || '');
  };

  const runCode = async () => {
    setOutput('Running...');
    const langInfo = pistonLanguageMap[language];
    try {
      const res = await fetch('http://localhost:8000/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langInfo[0],
          version: langInfo[1],
          code,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        setOutput('Error: ' + error);
        return;
      }
      const data = await res.json();
      setOutput(data.run?.output || data.run?.stdout || data.run?.stderr || 'No output');
    } catch (err) {
      setOutput('Error connecting to backend.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen items-start">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <label>
            Language:
            <select value={language} onChange={handleLanguageChange} className="ml-2">
              {languages.map(lang => (
                <option key={lang.value[0]} value={lang.value[0]}>{lang.label}</option>
              ))}
            </select>
          </label>
          <Editor
            height="65vh"
            language={language}
            value={code}
            onChange={value => setCode(value || '')}
          />
          <button onClick={runCode} style={{ marginTop: 12 }}>Run Code</button>
          <div style={{ marginTop: 16, background: '#222', color: '#fff', padding: 12, borderRadius: 4, minHeight: 60 }}>
            <strong>Output:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
          </div>
        </CardContent>
      </Card>
      <AgentChat />
    </div>
  );
}