"use client";

import { useState, useRef, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=DM+Mono:wght@400;500&family=Nanum+Gothic:wght@400;700&display=swap');

  :root {
    --bg: #0f0f0f;
    --surface: #161616;
    --border: #2a2a2a;
    --accent: #c8f060;
    --accent-dim: rgba(200,240,96,0.12);
    --text: #e8e8e8;
    --text-muted: #777;
    --text-dim: #aaa;
    --blue: #60c8f0;
    --orange: #f0a060;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Nanum Gothic', 'Apple SD Gothic Neo', sans-serif;
    font-size: 15px;
    line-height: 1.75;
  }

  .wrapper { max-width: 780px; margin: 0 auto; padding: 60px 28px 100px; }
  .header { border-bottom: 1px solid var(--border); padding-bottom: 36px; margin-bottom: 48px; }
  .badge { display: inline-block; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(200,240,96,0.3); padding: 4px 10px; border-radius: 2px; margin-bottom: 18px; }
  h1 { font-family: 'Nanum Gothic', sans-serif; font-size: 26px; font-weight: 700; line-height: 1.35; color: #fff; margin-bottom: 10px; }
  .subtitle { color: var(--text-muted); font-size: 13px; font-family: 'DM Mono', monospace; }
  .toc-box { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 20px 24px; margin-bottom: 40px; }
  .toc-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; }
  .toc-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
  .toc-item { display: flex; align-items: center; gap: 12px; padding: 6px 8px; border-radius: 3px; cursor: pointer; transition: background .12s; }
  .toc-item:hover { background: rgba(255,255,255,0.04); }
  .toc-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent); min-width: 32px; }
  .toc-title { font-size: 13px; color: var(--text-dim); flex: 1; }
  .toc-meta { font-family: 'DM Mono', monospace; font-size: 10px; color: #444; }
  .toc-bar { width: 48px; height: 3px; background: #222; border-radius: 2px; overflow: hidden; flex-shrink: 0; }
  .toc-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width .3s; }
  .float-btn { position: fixed; z-index: 200; display: flex; flex-direction: column; align-items: center; gap: 8px; user-select: none; }
  .float-drag-hint { font-family: 'DM Mono', monospace; font-size: 9px; color: #444; opacity: 0; transition: opacity .2s; pointer-events: none; }
  .float-btn:hover .float-drag-hint { opacity: 1; }
  .float-circle { width: 52px; height: 52px; border-radius: 50%; background: #161616; border: 1.5px solid #2a2a2a; display: flex; align-items: center; justify-content: center; cursor: grab; transition: border-color .2s, box-shadow .2s; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.6); }
  .float-circle:active { cursor: grabbing; }
  .float-circle:hover { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(200,240,96,0.08), 0 4px 20px rgba(0,0,0,0.6); }
  .float-svg { position: absolute; top: 0; left: 0; width: 52px; height: 52px; transform: rotate(-90deg); }
  .float-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); font-weight: 500; position: relative; z-index: 1; }
  .float-tooltip { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 10px 14px; min-width: 180px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); position: absolute; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0; transition: opacity .15s; white-space: nowrap; }
  .float-tooltip.visible { opacity: 1; pointer-events: auto; }
  .float-tooltip-title { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
  .float-tooltip-row { display: flex; justify-content: space-between; gap: 16px; font-size: 12px; color: var(--text-dim); padding: 2px 0; }
  .float-tooltip-val { font-family: 'DM Mono', monospace; color: var(--accent); }
  .float-tooltip-row.clickable { cursor: pointer; border-radius: 3px; padding: 3px 4px; margin: 0 -4px; transition: background .12s; }
  .float-tooltip-row.clickable:hover { background: rgba(200,240,96,0.08); }
  .timer-widget { position: fixed; top: 20px; right: 20px; z-index: 200; background: #161616; border: 1.5px solid #2a2a2a; border-radius: 8px; padding: 10px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; gap: 6px; user-select: none; min-width: 110px; }
  .timer-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: #444; }
  .timer-display { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 500; line-height: 1; letter-spacing: .04em; transition: color .3s; }
  .timer-display.idle { color: #555; }
  .timer-display.running { color: var(--accent); }
  .timer-display.warning { color: var(--orange); }
  .timer-display.over { color: #ff6b6b; }
  .timer-controls { display: flex; gap: 6px; align-items: center; }
  .timer-btn { font-family: 'DM Mono', monospace; font-size: 10px; color: #555; background: none; border: 1px solid #2a2a2a; border-radius: 3px; padding: 3px 7px; cursor: pointer; transition: color .15s, border-color .15s; }
  .timer-btn.primary { color: var(--accent); border-color: rgba(200,240,96,0.3); }
  .timer-btn.stop { color: var(--orange); border-color: rgba(240,160,96,0.3); }
  .opening { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--blue); border-radius: 4px; padding: 24px 28px; margin-bottom: 40px; }
  .opening-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
  .opening p { color: var(--text-dim); font-size: 14px; line-height: 1.85; }
  .opening p + p { margin-top: 10px; }
  .section { margin-bottom: 44px; }
  .section-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .section-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); min-width: 28px; }
  .section-title { font-size: 15px; font-weight: 600; color: #fff; }
  .section-meta { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-muted); white-space: nowrap; }
  .section-note { background: var(--accent-dim); border-left: 2px solid var(--accent); padding: 8px 14px; border-radius: 2px; font-size: 12px; color: var(--accent); margin-bottom: 14px; font-family: 'DM Mono', monospace; }
  .q-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .q-item { display: flex; flex-direction: column; padding: 10px 14px; border-radius: 4px; border: 1px solid transparent; transition: background .15s, border-color .15s, opacity .2s; gap: 6px; }
  .q-item:hover { background: var(--surface); border-color: var(--border); }
  .q-item-top { display: flex; align-items: flex-start; gap: 12px; }
  .q-check { width: 16px; height: 16px; min-width: 16px; border: 1.5px solid #444; border-radius: 3px; margin-top: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s, border-color .15s; flex-shrink: 0; }
  .q-memo { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid #222; border-radius: 3px; color: #888; font-family: 'Nanum Gothic', sans-serif; font-size: 12px; line-height: 1.6; padding: 5px 8px; resize: none; overflow: hidden; min-height: 28px; outline: none; transition: border-color .15s, color .15s; display: block; }
  .q-memo::placeholder { color: #333; }
  .q-memo:focus { border-color: #3a3a3a; background: rgba(255,255,255,0.05); color: #bbb; }
  .q-item.checked { opacity: 0.4; filter: grayscale(1); }
  .q-item.checked .q-check { background: #555; border-color: #555; }
  .q-item.magic { border-color: rgba(200,240,96,0.2); background: rgba(200,240,96,0.04); }
  .q-item.magic .q-text { color: var(--accent); }
  .q-item.magic .q-num { color: rgba(200,240,96,0.5); }
  .q-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-muted); min-width: 26px; padding-top: 2px; }
  .q-text { font-size: 14px; color: var(--text-dim); line-height: 1.65; }
  .q-text strong { color: var(--text); font-weight: 500; }
  .q-sub { list-style: none; margin-top: 6px; padding-left: 4px; display: flex; flex-direction: column; gap: 4px; }
  .q-sub li { font-size: 13px; color: var(--text-muted); padding-left: 14px; border-left: 1px solid var(--border); line-height: 1.6; }
  .guideline-box { background: #0d1a0d; border: 1px solid rgba(200,240,96,0.2); border-radius: 4px; padding: 20px 24px; margin-bottom: 48px; }
  .guideline-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
  .guideline-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .guideline-list li { display: flex; gap: 10px; font-size: 13px; color: var(--text-dim); line-height: 1.65; }
  .guideline-list li::before { content: "—"; color: var(--accent); font-family: 'DM Mono', monospace; flex-shrink: 0; }
  .progress-section { margin-top: 48px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 24px 28px; }
  .progress-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
  .progress-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
  .progress-count { font-family: 'DM Mono', monospace; font-size: 22px; color: #fff; }
  .progress-bar-track { height: 3px; background: #222; border-radius: 2px; overflow: hidden; margin-top: 12px; }
  .progress-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width .3s ease; }
  .feedback-box { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--orange); border-radius: 4px; padding: 24px 28px; margin-top: 40px; }
  .feedback-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--orange); margin-bottom: 16px; }
  .feedback-intro { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6; }
  .feedback-list { list-style: none; display: flex; flex-direction: column; gap: 0; }
  .feedback-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
  .feedback-item:last-child { border-bottom: none; }
  .feedback-q { font-size: 13.5px; color: var(--text-dim); line-height: 1.7; display: flex; gap: 10px; }
  .feedback-idx { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--orange); min-width: 20px; padding-top: 2px; opacity: 0.7; }
  .feedback-answer { margin-top: 8px; margin-left: 30px; width: calc(100% - 30px); background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 8px 12px; font-size: 12px; color: var(--text-muted); font-family: 'Nanum Gothic', sans-serif; resize: none; outline: none; overflow: hidden; min-height: 48px; transition: border-color .15s; }
  .feedback-answer::placeholder { color: #444; font-style: italic; }
  .feedback-answer:focus { border-color: #3a3a3a; color: #bbb; }
  .tip-box { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 20px 24px; margin-top: 40px; }
  .tip-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--orange); margin-bottom: 12px; }
  .tip-row { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .tip-row:last-child { border-bottom: none; }
  .tip-trigger { color: var(--text-muted); font-family: 'DM Mono', monospace; font-size: 12px; }
  .tip-action { color: var(--text-dim); }
  .closing { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--accent); border-radius: 4px; padding: 24px 28px; margin-top: 48px; }
  .closing-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
  .closing-final { font-size: 13px; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 14px; line-height: 1.7; margin-top: 16px; }
  .closing-final em { color: var(--accent); font-style: normal; font-weight: 500; }
`;

function AutoTextarea({ className, placeholder }) {
  const ref = useRef(null);
  const handleInput = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  return <textarea ref={ref} className={className} placeholder={placeholder} rows={1} onInput={handleInput} />;
}

function QItem({ num, text, sub, magic, id, checked, onToggle }) {
  return (
    <li className={`q-item${magic ? " magic" : ""}${checked ? " checked" : ""}`}>
      <div className="q-item-top">
        <div className="q-check" onClick={onToggle} style={checked ? { background: "#555", borderColor: "#555" } : {}}>
          {checked && (
            <svg viewBox="0 0 10 10" fill="none" style={{ width: 10, height: 10 }}>
              <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="q-num">{num}</span>
        <span className="q-text" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
      {sub && <ul className="q-sub">{sub.map((s, i) => <li key={i}>{s}</li>)}</ul>}
      <AutoTextarea className="q-memo" placeholder="메모..." />
    </li>
  );
}

function Section({ num, title, meta, note, questions, checkedMap, onToggle, anchorId }) {
  return (
    <div className="section" id={anchorId}>
      <div className="section-header">
        <span className="section-num">{num}</span>
        <span className="section-title">{title}</span>
        <span className="section-meta">{meta}</span>
      </div>
      {note && <div className="section-note">{note}</div>}
      <ul className="q-list">
        {questions.map((q) => (
          <QItem key={q.id} {...q} checked={!!checkedMap[q.id]} onToggle={() => onToggle(q.id)} />
        ))}
      </ul>
    </div>
  );
}

const ALL_SECTIONS = [
  {
    num: "01", title: "채널 & 배경 이해", meta: "아이스브레이킹 · 3~5분",
    questions: [
      { id: "q1", num: "1", text: "<strong>유튜브는 왜 시작하셨어요?</strong> 그 중에서 브이로그를 선택하신 이유가 있어요?" },
      { id: "q2", num: "2", text: "직업이 어떻게 되세요? 유튜브는 부업으로 계속 병행하실 생각이세요?" },
      { id: "q3", num: "3", text: "혼자 작업하세요, 아니면 도움받는 분이 있으세요?" },
      { id: "q4", num: "4", text: "유튜버끼리 모이는 커뮤니티 공간이 있어요?" },
      { id: "q5", num: "5", text: "업로드 주기는 어떻게 정하셨어요?" },
      { id: "q6", num: "6", text: "영상 길이는 어떻게 결정해요?" },
      { id: "q7", num: "7", text: "구독자가 자주 요청하는 것들이 있어요? 반영한 게 있어요?" },
    ]
  },
  {
    num: "02", title: "전체 제작 Workflow 파악", meta: "큰 그림 · 5~7분",
    questions: [
      { id: "q8", num: "8", text: "촬영부터 업로드까지 과정을 크게 단계별로 나눠본다면 어떻게 돼요?", sub: ["각 단계마다 시간을 얼마나 쓰고 계세요?", "어떤 단계가 예상보다 오래 걸린다고 느끼세요?"] },
    ]
  },
  {
    num: "02-1", title: "기획 Workflow", meta: "3~4분",
    questions: [
      { id: "q9", num: "9", text: "한 영상에 들어갈 소재를 묶는 기준은 뭐예요?" },
      { id: "q10", num: "10", text: "영상 기획을 따로 하세요? 한다면 어떻게 해요?" },
    ]
  },
  {
    num: "03", title: "촬영 Workflow", meta: "가설 1 검증 · 5분",
    note: "핵심 확인: 촬영 단계에서 이미 편집 pain이 영향을 미치는가?",
    questions: [
      { id: "q13", num: "13", text: "촬영할 때 주로 쓰는 제품이나 앱, 요령이 있어요?" },
      { id: "q14", num: "14", text: "한 영상당 촬영본 양은 얼마나 되고, 포맷은요?" },
      { id: "q15", num: "15", text: "촬영하고 얼마 만에 편집을 시작해요?" },
      { id: "q16", num: "16", text: "촬영 중이나 직후에 \"이 장면 써야지\" 하고 메모하거나 표시해두는 방법이 있어요?" },
      { id: "q17", num: "17", text: "촬영하면서 편집 생각을 많이 하는 편이에요?" },
      { id: "q18", num: "18", text: "<strong>귀찮아서 안 찍은 장면이 있어요?</strong> 어떤 상황이었어요?" },
      { id: "q19", num: "19", text: "촬영 분량이 많을수록 편집이 더 힘들어진다고 느껴요, 아니면 고를 게 많아서 좋아요?" },
      { id: "q20", num: "20", text: "촬영본은 어떻게 관리하고 있어요?" },
      { id: "q21", num: "21", text: "파일명이나 폴더 규칙 같은 게 있어요?" },
    ]
  },
  {
    num: "04", title: "편집 Workflow", meta: "핵심 구간 · 10~12분",
    questions: [
      { id: "q22", num: "22", text: "편집할 때 주로 쓰는 프로그램이나 앱, 요령이 있어요?" },
      { id: "q23", num: "23", text: "편집을 어떻게 배우셨어요?" },
      { id: "q24", num: "24", text: "마지막으로 편집한 게 언제예요?" },
      { id: "q25", num: "25", text: "그때 편집 시작 전에 뭘 하셨고, 마치고는 뭘 하셨어요?" },
      { id: "q26", num: "26", text: "<strong>편집하면서 가장 많이 느끼는 감정이 뭐예요?</strong>" },
      { id: "q27", num: "27", text: "편집 때문에 \"이거 진짜 왜 내가 하고 있지?\" 싶었던 순간이 있어요?" },
      { id: "q28", num: "28", text: "각 단계에서 창의력이 필요한 부분과 단순 반복 작업의 비율이 어떻게 돼요?" },
      { id: "q29", num: "29", text: "<strong>편집하면서 가장 반복적으로 귀찮고 단순하다고 느끼는 작업이 뭐예요?</strong>" },
      { id: "q30", num: "30", text: "업로드까지 과정에서 가장 재미있는 구간은요?" },
      { id: "q31", num: "31", text: "가장 지루하거나 힘든 구간은요?" },
      { id: "q32", num: "32", text: "업로드를 미룬 적이 있어요? 이유가 뭐였어요?" },
      { id: "q33", num: "33", text: "유튜브 그만둘까 생각한 적 있어요?" },
    ]
  },
  {
    num: "05", title: "장면 탐색 & 촬영본 관리", meta: "가설 2 검증 · 여기 오래 파기",
    note: "⚑ 제품의 핵심 Pain이 나올 가능성이 가장 높은 구간",
    questions: [
      { id: "q34", num: "34", text: "<strong>특정 장면을 찾고 싶을 때 어떻게 하세요?</strong>" },
      { id: "q35", num: "35", text: "원하는 장면 찾다가 포기하고 다른 컷을 쓴 경험이 있어요?" },
      { id: "q36", num: "36", text: "촬영본 안에 뭐가 들어있는지 어떻게 관리하세요? 기억으로 하는 편이에요, 아니면 따로 메모해두는 게 있어요?" },
      { id: "q37", num: "37", text: "원하는 장면 찾는 데 오래 걸렸던 경험이 있어요? 얼마나 걸렸어요?" },
      { id: "q38", num: "38", text: "예전 촬영본을 다시 꺼내 쓰는 경우도 있어요? 그럴 때 어떻게 찾아요?" },
    ]
  },
  {
    num: "06", title: "검토 & 업로드", meta: "가설 3 검증 · 5분",
    note: "불안 / 완벽주의 / 반복 검수 패턴 확인",
    questions: [
      { id: "q45", num: "45", text: "편집 완료 후 업로드 전에 영상을 몇 번 다시 봐요?", sub: ["볼 때마다 확인하는 게 달라요?", "검토할 때 가장 신경 쓰이는 게 뭐예요?"] },
      { id: "q46", num: "46", text: "다 됐다고 생각했는데 올리고 나서 실수를 발견한 적 있어요?" },
      { id: "q47", num: "47", text: "올리고 나서 다시 내린 적 있어요? 어떤 이유였어요?" },
    ]
  },
  {
    num: "07", title: "숏폼 Workflow", meta: "가설 4 검증 · 5분",
    questions: [
      { id: "q48", num: "48", text: "숏폼 콘텐츠 올리고 있어요? 안 한다면 이유가 뭐예요?" },
      { id: "q49", num: "49", text: "숏폼은 보통 어떻게 만들어요? 장편에서 클립을 잘라요, 아니면 따로 찍어요?" },
      { id: "q50", num: "50", text: "숏폼용 장면 찾을 때는 어떻게 해요? 어렵지 않아요?" },
      { id: "q51", num: "51", text: "숏폼 하나 만드는 데 시간이 얼마나 걸려요?" },
      { id: "q52", num: "52", text: "\"숏폼용으로 딱 좋겠다\" 싶은 장면이 있었는데 그냥 넘긴 적 있어요?" },
      { id: "q53", num: "53", text: "숏폼을 더 많이 올리고 싶은데 뭔가 걸리는 게 있어요?" },
    ]
  },
  {
    num: "08", title: "효율화 노력 & 비용", meta: "지불 의향 확인 · 5분",
    note: "Pain 있는 곳에 이미 돈을 쓰고 있는가?",
    questions: [
      { id: "q54", num: "54", text: "편집 빨리 하는 법 찾아본 적 있어요? 도움이 됐던 건 뭐예요?" },
      { id: "q55", num: "55", text: "본인만의 편집 시간 단축 비결이 있어요?" },
      { id: "q56", num: "56", text: "처음과 비교했을 때 가장 시간이 줄어든 파트는 어디예요?" },
      { id: "q57", num: "57", text: "편집 효율 올리려고 장비나 소프트웨어 구매한 적 있어요? 얼마였어요?" },
      { id: "q58", num: "58", text: "편집 관련해서 유료로 구독 중인 서비스가 있어요? 얼마예요?" },
      { id: "q59", num: "59", text: "돈 주고까지 결제한 이유가 뭐예요?" },
      { id: "q60", num: "60", text: "지금 쓰는 컴퓨터 사양은요?" },
    ]
  },
  {
    num: "09", title: "외주 & 자동화 욕구", meta: "자동화 영역 확인 · 4분",
    questions: [
      { id: "q61", num: "61", text: "누군가 편집 작업을 도와준 경험이 있어요?" },
      { id: "q62", num: "62", text: "편집자를 고용해야겠다고 느낀 순간이 있었어요?" },
      { id: "q63", num: "63", text: "만약 고용한다면 어떤 부분을 맡기고 싶어요?" },
      { id: "q64", num: "64", text: "\"이건 틀만 잡아주면 누가 대신 해도 되겠다\" 싶은 작업이 있어요?" },
    ]
  },
  {
    num: "10", title: "마법 지팡이 질문", meta: "맨 마지막에 · 3분",
    note: "후반부에 해야 진짜 답이 나옴 — 라포 형성 전에 하면 의미 없음",
    questions: [
      { id: "qm1", num: "✦", text: "지금 브이로그 편집에서 <strong>\"이 부분이 조금만 자동화되어도 생산량이 확 늘어날 것 같다\"</strong>고 생각하는 부분이 있어요?", magic: true },
      { id: "qm2", num: "✦", text: "편집 시간을 절반으로 줄일 수 있다면, 남는 시간에 뭘 하고 싶어요? <strong>퀄리티? 더 많은 업로드? 아니면 그냥 쉬고 싶어요?</strong>", magic: true },
    ]
  },
];

const CLOSING_QUESTIONS = [
  { id: "qc1", num: "끝", text: "채널 성장에 가장 큰 도움이 됐던 게 뭐예요?" },
  { id: "qc2", num: "끝", text: "편집에 대해서 제가 더 여쭤봤으면 하는 게 있어요?" },
  { id: "qc3", num: "끝", text: "제가 놓치고 있는 중요한 불편이 있다고 느끼시는 게 있어요?" },
];

const FEEDBACK_QUESTIONS = [
  "인터뷰의 첫 시작이 자연스러웠는가? 인터뷰 대상자가 바로 이야기를 시작했는가?",
  "인터뷰 대상자의 의견을 왜곡하거나 답변을 유도하는 질문을 무의식 중에 한 적이 있는가?",
  "너무 짧거나 단조로운 답변을 만든 질문이 있었는가? 그 질문을 어떻게 바꾸면 더 열린 답변을 이끌 수 있을까?",
  "즉석에서 한 질문 중 다음 스크립트에 반드시 넣어야 할 내용이 있었는가?",
  "이번에 얻으려 했지만 얻지 못한 정보가 있는가? 다음에는 어떻게 얻을 수 있을까?",
  "인터뷰 대상자가 가장 감정적으로 반응한 지점은 어디였는가?",
];

const TIPS = [
  { trigger: '"항상" / "매번" / "또"', action: "반복 페인포인트 → 즉시 파고들기" },
  { trigger: '"어쩔 수 없어요"', action: "체념 = 해결 안 된 진짜 문제" },
  { trigger: "표정·목소리 변화", action: '"그 부분 조금 더 말씀해주실 수 있어요?"' },
  { trigger: '"좋아 보여요!" 칭찬', action: '무시하고 "실제로 어떻게 하셨어요?"로 전환' },
  { trigger: "시간 부족 시", action: "01 → 02 → 04 → 05 → 10 순서 우선" },
];

function Timer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (running) { intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [running]);
  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const colorState = !running && elapsed===0 ? "idle" : elapsed>=1800 ? "over" : elapsed>=1200 ? "warning" : "running";
  return (
    <div className="timer-widget">
      <div className="timer-label">interview timer</div>
      <div className={`timer-display ${colorState}`}>{fmt(elapsed)}</div>
      <div className="timer-controls">
        {!running ? <button className="timer-btn primary" onClick={() => setRunning(true)}>{elapsed===0?"start":"resume"}</button>
          : <button className="timer-btn stop" onClick={() => setRunning(false)}>pause</button>}
        {elapsed>0 && <button className="timer-btn" onClick={() => { setRunning(false); setElapsed(0); }}>reset</button>}
      </div>
    </div>
  );
}

function CircleProgress({ pct }) {
  const r = 20, circ = 2*Math.PI*r, offset = circ-(pct/100)*circ;
  return (
    <svg className="float-svg" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#2a2a2a" strokeWidth="2.5"/>
      <circle cx="26" cy="26" r={r} fill="none" stroke="#c8f060" strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset .4s ease"}}/>
    </svg>
  );
}

function FloatingProgress({ checked, total, pct, sectionProgress }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth-76, y: window.innerHeight/2-26 });
  const didDrag = useRef(false);
  const dragStart = useRef({});
  const btnRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const onMouseDown = (e) => {
    e.preventDefault();
    didDrag.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, bx: pos.x, by: pos.y };
    const onMove = (ev) => {
      const dx=ev.clientX-dragStart.current.mx, dy=ev.clientY-dragStart.current.my;
      if (Math.abs(dx)>3||Math.abs(dy)>3) didDrag.current=true;
      setPos({ x: Math.min(Math.max(dragStart.current.bx+dx,0),window.innerWidth-56), y: Math.min(Math.max(dragStart.current.by+dy,0),window.innerHeight-56) });
    };
    const onUp = () => { document.removeEventListener("mousemove",onMove); document.removeEventListener("mouseup",onUp); };
    document.addEventListener("mousemove",onMove);
    document.addEventListener("mouseup",onUp);
  };
  const onTouchStart = (e) => {
    const t=e.touches[0];
    didDrag.current=false;
    dragStart.current={ mx:t.clientX, my:t.clientY, bx:pos.x, by:pos.y };
    const onMove = (ev) => {
      const touch=ev.touches[0], dx=touch.clientX-dragStart.current.mx, dy=touch.clientY-dragStart.current.my;
      if (Math.abs(dx)>3||Math.abs(dy)>3) didDrag.current=true;
      setPos({ x:Math.min(Math.max(dragStart.current.bx+dx,0),window.innerWidth-56), y:Math.min(Math.max(dragStart.current.by+dy,0),window.innerHeight-56) });
    };
    const onUp = () => { document.removeEventListener("touchmove",onMove); document.removeEventListener("touchend",onUp); };
    document.addEventListener("touchmove",onMove,{passive:true});
    document.addEventListener("touchend",onUp);
  };
  const onRightHalf = pos.x > window.innerWidth/2;
  const tooltipStyle = onRightHalf
    ? { right:"calc(100% + 12px)", left:"auto", top:"50%", transform:"translateY(-50%)" }
    : { left:"calc(100% + 12px)", right:"auto", top:"50%", transform:"translateY(-50%)" };
  return (
    <div ref={btnRef} className="float-btn" style={{ left:pos.x, top:pos.y }}>
      <div className="float-circle" onMouseDown={onMouseDown} onTouchStart={onTouchStart} onClick={() => { if(!didDrag.current) setOpen(o=>!o); }}>
        <CircleProgress pct={pct}/>
        <span className="float-pct">{pct}%</span>
        <div className={`float-tooltip${open?" visible":""}`} style={tooltipStyle}>
          <div className="float-tooltip-title">진행도</div>
          <div className="float-tooltip-row"><span>완료</span><span className="float-tooltip-val">{checked}/{total}</span></div>
          <div className="float-tooltip-row"><span>남은 질문</span><span className="float-tooltip-val">{total-checked}개</span></div>
          <div style={{height:1,background:"#2a2a2a",margin:"8px 0"}}/>
          {sectionProgress.map(s=>(
            <div className="float-tooltip-row clickable" key={s.num}
              onClick={()=>{ const el=document.getElementById(`sec-${s.num}`); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); }}>
              <span style={{fontSize:11}}>{s.num} {s.title.length>8?s.title.slice(0,8)+"…":s.title}</span>
              <span className="float-tooltip-val" style={{fontSize:11}}>{s.done}/{s.total}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="float-drag-hint">drag</div>
    </div>
  );
}

function TOC({ sections, sectionProgress, closingDone, closingTotal }) {
  const scrollTo = (id) => { const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); };
  return (
    <div className="toc-box">
      <div className="toc-label">목차 — 클릭하면 바로 이동</div>
      <ul className="toc-list">
        {sections.map((s,i)=>{
          const sp=sectionProgress[i], barPct=sp.total>0?Math.round((sp.done/sp.total)*100):0;
          return (
            <li key={s.num}>
              <div className="toc-item" onClick={()=>scrollTo(`sec-${s.num}`)}>
                <span className="toc-num">{s.num}</span>
                <span className="toc-title">{s.title}</span>
                <span className="toc-meta">{s.meta.split("·")[0].trim()}</span>
                <div className="toc-bar"><div className="toc-bar-fill" style={{width:`${barPct}%`}}/></div>
              </div>
            </li>
          );
        })}
        <li>
          <div className="toc-item" onClick={()=>scrollTo("sec-closing")}>
            <span className="toc-num" style={{color:"#c8f060"}}>끝</span>
            <span className="toc-title">마무리 & 클로징</span>
            <span className="toc-meta"></span>
            <div className="toc-bar"><div className="toc-bar-fill" style={{width:closingTotal>0?`${Math.round(closingDone/closingTotal*100)}%`:"0%"}}/></div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default function App() {
  const [checkedMap, setCheckedMap] = useState({});
  const allQ = [...ALL_SECTIONS.flatMap(s=>s.questions), ...CLOSING_QUESTIONS];
  const total=allQ.length, checked=Object.values(checkedMap).filter(Boolean).length, pct=total>0?Math.round((checked/total)*100):0;
  const toggle = (id) => setCheckedMap(prev=>({...prev,[id]:!prev[id]}));
  const sectionProgress = ALL_SECTIONS.map(s=>({ num:s.num, title:s.title, total:s.questions.length, done:s.questions.filter(q=>checkedMap[q.id]).length }));
  const closingDone=CLOSING_QUESTIONS.filter(q=>checkedMap[q.id]).length, closingTotal=CLOSING_QUESTIONS.length;
  return (
    <>
      <style>{styles}</style>
      <Timer/>
      <FloatingProgress checked={checked} total={total} pct={pct} sectionProgress={sectionProgress}/>
      <div className="wrapper">
        <div className="header" id="sec-top">
          <div className="badge">Craphy · Customer Interview</div>
          <h1>브이로그 유튜버<br/>고객 인터뷰 스크립트</h1>
          <div className="subtitle">최종본 · 2025 · 총 11단계</div>
        </div>
        <TOC sections={ALL_SECTIONS} sectionProgress={sectionProgress} closingDone={closingDone} closingTotal={closingTotal}/>
        <div className="guideline-box">
          <div className="guideline-label">인터뷰 지침</div>
          <ul className="guideline-list">
            <li>예/아니오 대답이 나오면 잘못된 질문이다. 열린 질문으로 다시 던져라.</li>
            <li>딴 이야기로 빠져도 2분은 더 들어라. 거기서 진짜 문제가 나온다.</li>
            <li>고객이 "이런 기능이 있으면 좋겠다"고 말하면 → <strong style={{color:"#e8e8e8"}}>"언제, 어떤 상황에서 그 기능을 쓰고 싶으세요?"</strong>로 파고들어라.</li>
            <li>휴게실에서 대화하듯 편안한 분위기를 만들어라.</li>
            <li>90%는 듣는 데 써라. 내가 말하는 순간 인터뷰가 망한다.</li>
          </ul>
        </div>
        <div className="opening">
          <div className="opening-label">〈 오프닝 〉 1~2분</div>
          <p>안녕하세요! 학생 기술창업팀 Craphy의 김민입니다. 통화 괜찮으실까요?</p>
          <p>감사합니다. 오늘은 서비스를 판매하려는 목적보다는, 실제로 브이로그를 제작하시면서 어떤 불편이 있는지 배우고 싶어서 연락드렸습니다.</p>
          <p>촬영부터 편집, 업로드까지의 실제 작업 방식에 대해 편하게 이야기 들을 수 있으면 좋겠습니다!</p>
        </div>
        {ALL_SECTIONS.map(sec=>(
          <Section key={sec.num} anchorId={`sec-${sec.num}`} num={sec.num} title={sec.title} meta={sec.meta} note={sec.note} questions={sec.questions} checkedMap={checkedMap} onToggle={toggle}/>
        ))}
        <div className="closing" id="sec-closing">
          <div className="closing-label">〈 마무리 〉</div>
          <ul className="q-list">
            {CLOSING_QUESTIONS.map(q=><QItem key={q.id} {...q} checked={!!checkedMap[q.id]} onToggle={()=>toggle(q.id)}/>)}
          </ul>
          <div className="closing-final">
            오늘 이야기 정말 많이 도움됐습니다. 감사합니다!<br/><br/>
            <em>혹시 나중에 프로토타입이나 데모를 만들게 되면 한번 보여드려도 괜찮을까요?</em><br/>
            → 초기 유저 풀의 시작점. 반드시 물어볼 것.
          </div>
        </div>
        <div className="tip-box">
          <div className="tip-label">현장 운영 팁</div>
          {TIPS.map((t,i)=><div className="tip-row" key={i}><span className="tip-trigger">{t.trigger}</span><span className="tip-action">{t.action}</span></div>)}
        </div>
        <div className="progress-section">
          <div className="progress-label">인터뷰 진행도</div>
          <div className="progress-header">
            <div className="progress-count">{checked} / {total} <span>질문 완료</span></div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--text-muted)"}}>{total-checked}개 남음 · {pct}%</div>
          </div>
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{width:`${pct}%`}}/></div>
        </div>
        <div className="feedback-box">
          <div className="feedback-label">인터뷰 후 자기 피드백</div>
          <div className="feedback-intro">인터뷰 직후 작성. 기억이 흐려지기 전에.</div>
          <ul className="feedback-list">
            {FEEDBACK_QUESTIONS.map((q,i)=>(
              <li className="feedback-item" key={i}>
                <div className="feedback-q"><span className="feedback-idx">{String(i+1).padStart(2,"0")}</span>{q}</div>
                <AutoTextarea className="feedback-answer" placeholder="메모"/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
