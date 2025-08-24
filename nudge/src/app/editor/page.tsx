// pooke AI

'use client'
import Editor from '../../components/monaco_editor';
import React, { useState } from 'react';
import { runCodeWithPiston } from '../../lib/piston';
import { version } from 'os';

const languages = [
  { label: 'Java', value: ['java', '// enter your code here'] },
  { label: 'Python', value: ['python', '# enter your code here'] },
  { label: 'JavaScript', value: ['javascript', '// enter your code here'] },
  { label: 'C++', value: ['cpp', '// enter your code here'] },
  { label: 'C', value: ['c', '// enter your code here'] },
];


// Map Monaco language IDs to Piston language names
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
    try {
      const pistonOptions = {
        language: pistonLanguageMap[language][0],
        version: pistonLanguageMap[language][1],
        files: [{ content: code }],
      };
      const data = await runCodeWithPiston(pistonOptions);
      setOutput(data.run?.output || data.run?.stdout || data.run?.stderr || 'No output');
    } catch (err) {
      console.log(err)
      setOutput('Error running code.');
    }
  };

  return (
    <div style={{ width: "50vw" }}>
      <label>
        Language:
        <select value={language} onChange={handleLanguageChange}>
          {languages.map(lang => (
            <option key={lang.value[0]} value={lang.value[0]}>{lang.label}</option>
          ))}
        </select>
      </label>
      <Editor
        height="70vh"
        language={language}
        value={code}
        onChange={value => setCode(value || '')}
      />
      <button onClick={runCode} style={{ marginTop: 12 }}>Run Code</button>
      <div style={{ marginTop: 16, background: '#222', color: '#fff', padding: 12, borderRadius: 4, minHeight: 60 }}>
        <strong>Output:</strong>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
      </div>
    </div>
  );
}


