'use client';

import React from 'react';
import MonacoEditor from '@monaco-editor/react';

type MonacoEditorProps = {
  height?: string;
  language?: string; // <-- add this
  value?: string;    // <-- add this
  onChange?: (value: string | undefined) => void;
};

const Editor: React.FC<MonacoEditorProps> = ({
  height = '90vh',
  language = 'python', // <-- add this
  value,
  onChange,
}) => {
  return (
    <MonacoEditor
      height={height}
      language={language} // <-- add this
      value={value}       // <-- add this
      onChange={onChange}
      theme="vs-dark"
    />
  );
};

export default Editor;