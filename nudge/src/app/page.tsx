'use client'
import Editor from '../components/monaco_editor';
import React, { useState } from 'react';

const languages = [
  { label: 'Java', value: ['java', '// enter your code here'] },
  { label: 'Python', value: ['python', '# enter your code here'] },
  { label: 'JavaScript', value: ['javascript', '// enter your code here'] },
  { label: 'C++', value: ['cpp', '// enter your code here'] },
];

export default function HomePage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# enter your code here');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = languages.find(lang => lang.value[0] === e.target.value);
    setLanguage(selected?.value[0] || 'python');
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
        height="90vh"
        language={language}
        value={code}
        onChange={value => setCode(value || '')}
      />
    </div>
  );
}