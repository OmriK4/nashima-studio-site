"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { images } from "@/content/images";

/**
 * "נשימה כאן" — העוזרת הדיגיטלית של הסטודיו.
 *
 * מדברת עם /api/chat — פרוקסי באותו מקור לסוכנת ב-n8n, לא עם n8n
 * ישירות. כך הווידג'ט עובד מכל כתובת שהאתר רץ עליה, כולל כתובות
 * דיפלוימנט זמניות של Vercel, בלי תלות ברשימת allowedOrigins ב-n8n.
 * התשובה מגיעה כשורות NDJSON ({type:'begin'|'item'|'end'|'error'})
 * ונכתבת למסך תוך כדי.
 *
 * שלוש החלטות שחשוב לשמור עליהן:
 * 1. הטקסט מהמודל נכנס כ-children של React בלבד, לעולם לא כ-HTML.
 * 2. epoch — סגירה או איפוס מקדמים מונה, כך שהרצה שעדיין נגמרת
 *    לא יכולה לכתוב לתוך השיחה שהחליפה אותה.
 * 3. [[REGISTERED]] הוא סימון טכני שהסוכנת מוסיפה רק כשההרשמה באמת
 *    בוצעה. הדף מסתיר אותו ומשתמש בו כמקור האמת היחיד להצלחה.
 */

const ENDPOINT = "/api/chat";
const SESSION_KEY = "nashima_chat_session_v1";
const SENTINEL = "[[REGISTERED]]";
const TIMEOUT_MS = 120000;

const OPENING =
  "היי, אני העוזרת הדיגיטלית של סטודיו נשימה. אפשר לשאול אותי על הקבוצות, על המחיר או על מה שצריך להביא — ואם תרצי, גם לשמור לך מקום.";

type Role = "user" | "bot";
type Message = { id: number; role: Role; text: string; registered?: boolean };

function newSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "nashima-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function readSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = newSessionId();
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return newSessionId();
  }
}

/** מסתיר את הסימון, כולל זנב חלקי שמגיע טוקן-טוקן באמצע הסטרימינג */
function visibleText(raw: string) {
  const at = raw.indexOf(SENTINEL);
  if (at >= 0) return raw.slice(0, at).replace(/\s+$/, "");
  for (let n = SENTINEL.length - 1; n > 0; n--) {
    if (raw.slice(-n) === SENTINEL.slice(0, n)) {
      return raw.slice(0, raw.length - n).replace(/\s+$/, "");
    }
  }
  return raw;
}

/** שורות ו-**מודגש** בלבד. React מבריח את הטקסט בעצמו. */
function renderRich(text: string) {
  return text.split("\n").map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split("**").map((seg, si) =>
        si % 2 === 1 ? <strong key={si}>{seg}</strong> : <span key={si}>{seg}</span>,
      )}
    </span>
  ));
}

export function NashimaAgent() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: OPENING },
  ]);

  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const epochRef = useRef(0);
  const nextId = useRef(1);

  // הודעה חדשה — גוללים לתחתית הלוג
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const cancelRun = useCallback(() => {
    epochRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }, []);

  const closePanel = useCallback(() => {
    cancelRun();
    setOpen(false);
  }, [cancelRun]);

  const resetChat = useCallback(() => {
    cancelRun();
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    nextId.current = 1;
    setMessages([{ id: 0, role: "bot", text: OPENING }]);
  }, [cancelRun]);

  // Escape סוגר את החלון
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || busy) return;

      const myEpoch = epochRef.current;
      const userId = nextId.current++;
      const botId = nextId.current++;

      setDraft("");
      setBusy(true);
      setMessages((prev) => [...prev, { id: userId, role: "user", text: clean }]);

      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      let acc = "";
      let started = false;
      let sawError = false;

      const paint = () => {
        const shown = visibleText(acc);
        setMessages((prev) => {
          const without = prev.filter((m) => m.id !== botId);
          return [...without, { id: botId, role: "bot", text: shown }];
        });
      };

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: readSessionId(),
            chatInput: clean,
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error("http " + res.status);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const handle = (evt: { type?: string; content?: string }) => {
          if (epochRef.current !== myEpoch) return;
          if (evt.type === "error") {
            // התוכן נושא פרטים פנימיים ולעולם לא מוצג
            sawError = true;
            return;
          }
          if (evt.type === "item") {
            started = true;
            acc += evt.content ?? "";
            paint();
          }
        };

        for (;;) {
          const { done, value } = await reader.read();
          buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            try {
              handle(JSON.parse(line));
            } catch {}
          }
          if (done) break;
        }

        clearTimeout(timer);
        if (epochRef.current !== myEpoch) return;

        const shown = visibleText(acc);
        if (!started || !shown.trim()) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== botId),
            {
              id: botId,
              role: "bot",
              text: sawError
                ? "משהו השתבש אצלי לרגע ולא הצלחתי לענות. אפשר לנסות שוב."
                : "לא הגיעה תשובה. אפשר לנסות שוב.",
            },
          ]);
        } else if (acc.includes(SENTINEL)) {
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, registered: true } : m)),
          );
        }
      } catch {
        clearTimeout(timer);
        if (epochRef.current !== myEpoch) return;
        const shown = visibleText(acc);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== botId),
          {
            id: botId,
            role: "bot",
            text: shown.trim()
              ? shown + "\n\n(החיבור נקטע באמצע. אפשר לשלוח שוב.)"
              : "לא הצלחתי להתחבר כרגע. אפשר לנסות שוב, או למלא את טופס ההרשמה בעמוד.",
          },
        ]);
      } finally {
        if (epochRef.current === myEpoch) setBusy(false);
      }
    },
    [busy],
  );

  return (
    <>
      {/* הכפתור הצף — פינה שמאלית תחתונה, מחוץ לדרך של ניווט הנקודות */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "סגירת הצ׳אט" : "פתיחת הצ׳אט עם העוזרת הדיגיטלית"}
        className={`agent-launcher fixed bottom-5 left-5 z-50 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-clay/30 bg-milk shadow-[0_10px_28px_-12px_rgba(58,51,44,0.45)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:border-clay/60 sm:h-20 sm:w-20 ${
          open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
        }`}
      >
        {/*
          סימן הלוגו בלבד, בלי המילה "נשימה" — הכפתור עגול והמילה
          לא הייתה נקראת בגודל הזה. הקו של הסימן בהיר מאוד בקובץ,
          ולכן brightness מכהה אותו כדי שייקרא על רקע החלב.
        */}
        <Image
          src={images.logoGlyph.src}
          alt=""
          aria-hidden
          width={images.logoGlyph.width}
          height={images.logoGlyph.height}
          className="h-8 w-auto brightness-[0.62] sm:h-9"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="נשימה כאן — העוזרת הדיגיטלית של סטודיו נשימה"
          className="fixed bottom-5 left-5 z-50 flex max-h-[min(620px,calc(100dvh-3rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-sand bg-cream shadow-[0_24px_60px_-20px_rgba(58,51,44,0.5)]"
        >
          <div className="flex items-center gap-3 border-b border-sand bg-milk px-4 py-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-deep text-clay"
            >
              <Image
                src={images.logoGlyph.src}
                alt=""
                width={images.logoGlyph.width}
                height={images.logoGlyph.height}
                className="h-4 w-auto brightness-[0.62]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base">נשימה כאן</span>
                <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[11px] text-taupe">
                  עוזרת דיגיטלית
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={resetChat}
              aria-label="שיחה חדשה"
              title="שיחה חדשה"
              className="rounded-full p-1.5 text-taupe transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={closePanel}
              aria-label="סגירת הצ׳אט"
              className="rounded-full p-1.5 text-taupe transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-clay text-cream"
                      : m.registered
                        ? "border border-clay/40 bg-milk text-ink"
                        : "border border-sand bg-milk text-ink"
                  }`}
                >
                  {renderRich(m.text)}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-end">
                <div className="rounded-2xl border border-sand bg-milk px-3.5 py-2.5 text-sm text-taupe">
                  כותבת…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="flex items-end gap-2 border-t border-sand bg-milk px-3 py-3"
          >
            <label htmlFor="nashima-agent-input" className="sr-only">
              ההודעה שלך
            </label>
            <textarea
              id="nashima-agent-input"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(draft);
                }
              }}
              placeholder="אפשר לכתוב לי כאן…"
              enterKeyHint="send"
              className="max-h-28 min-h-[2.6rem] flex-1 resize-none rounded-xl border border-sand bg-cream px-3 py-2.5 text-[15px] text-ink placeholder:text-taupe/70 transition-colors focus:border-clay focus:ring-2 focus:ring-clay/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="שליחת ההודעה"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-cream transition-colors hover:bg-clay-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M21 3L3 10.5l7 3 3 7L21 3z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
