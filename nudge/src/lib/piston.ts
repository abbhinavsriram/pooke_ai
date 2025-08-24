// src/lib/piston.ts

export interface PistonRunOptions {
  language: string;
  version: string;
  files: { content: string }[];
}

export interface PistonRunResult {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  language: string;
  version: string;
}

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

export async function runCodeWithPiston(options: PistonRunOptions): Promise<PistonRunResult> {
  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!response.ok) {
    console.log(response)
    throw new Error(`Piston API error: ${response.status}`);
  }
  return response.json();
}
