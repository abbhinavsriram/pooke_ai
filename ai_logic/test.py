from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional, List
import os
from openai import OpenAI

client = OpenAI()

class AppState(TypedDict):
    code: str
    errors: Optional[str]
    user_question: Optional[str]
    hints: List[str]

# ---- Helpers ----
def ask_ai(role: str, instruction: str, code: str, context: Optional[str]) -> str:
    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-5"),
        messages=[
            {"role": "system", "content": f"You are a coding tutor specializing in {role}. Only give hints, never code solutions."},
            {"role": "user", "content": f"{instruction}\n\nCode:\n{code[:1500]}\n\nContext:\n{context or 'N/A'}"}
        ],
        temperature=0.3,
    )
    return resp.choices[0].message.content

# ---- Nodes ----
def syntax_agent(state: AppState) -> AppState:
    hint = ask_ai("syntax checking", "Explain syntax issues as hints.", state["code"], state["errors"])
    state["hints"].append(hint)
    return state

def runtime_agent(state: AppState) -> AppState:
    hint = ask_ai("runtime debugging", "Identify possible infinite loops or runtime issues.", state["code"], state["errors"])
    state["hints"].append(hint)
    return state

def best_practices_agent(state: AppState) -> AppState:
    hint = ask_ai("style and best practices", "Comment on variable naming and readability.", state["code"], None)
    state["hints"].append(hint)
    return state

def efficiency_agent(state: AppState) -> AppState:
    hint = ask_ai("performance optimization", "Suggest conceptual ways to improve efficiency.", state["code"], None)
    state["hints"].append(hint)
    return state

def chat_agent(state: AppState) -> AppState:
    if state.get("user_question"):
        hint = ask_ai("concept explanation", "Answer conceptual question with hints only.", state["code"], state["user_question"])
        state["hints"].append(hint)
    return state

# ---- Build Graph ----
graph = StateGraph(AppState)
graph.add_node("syntax_agent", syntax_agent)
graph.add_node("runtime_agent", runtime_agent)
graph.add_node("best_practices_agent", best_practices_agent)
graph.add_node("efficiency_agent", efficiency_agent)
graph.add_node("chat_agent", chat_agent)

# Sequential edges
graph.set_entry_point("syntax_agent")
graph.add_edge("syntax_agent", "runtime_agent")
graph.add_edge("runtime_agent", "best_practices_agent")
graph.add_edge("best_practices_agent", "efficiency_agent")
graph.add_edge("efficiency_agent", "chat_agent")
graph.add_edge("chat_agent", END)

compiled = graph.compile()
