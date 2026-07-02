import melissaHeadshot from "../../assets/melissa-headshot.png";
interface Props { size?: "small" | "medium"; }
export function AiAvatar({ size = "small" }: Props) {
  return (
    <span
      className={"block shrink-0 overflow-hidden rounded-full border-2 border-brand/15 bg-brand-soft " + (size === "medium" ? "size-10" : "size-8")}
      style={{ aspectRatio: "1 / 1" }}
      aria-hidden="true"
    >
      <img src={melissaHeadshot} alt="" className="block size-full max-w-none object-cover" />
    </span>
  );
}
