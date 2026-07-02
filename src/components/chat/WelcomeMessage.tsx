import { WELCOME_MESSAGE } from "../../config/chatContent";
import { AiAvatar } from "./AiAvatar";
export function WelcomeMessage() { return <div className="flex gap-3"><div className="mt-0.5 shrink-0"><AiAvatar /></div><div className="min-w-0 text-[14px] leading-6 text-slate"><p className="font-bold text-ink">{WELCOME_MESSAGE.title}</p>{WELCOME_MESSAGE.paragraphs.map((paragraph) => <p className="mt-3" key={paragraph}>{paragraph}</p>)}</div></div>; }
