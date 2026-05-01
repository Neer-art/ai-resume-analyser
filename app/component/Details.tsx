import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

// ✅ Score Badge (safe)
const ScoreBadge = ({ score = 0 }: { score?: number }) => {
  const safeScore = score ?? 0;

  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        safeScore > 69
          ? "bg-badge-green"
          : safeScore > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >
      <img
        src={safeScore > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          safeScore > 69
            ? "text-badge-green-text"
            : safeScore > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >
        {safeScore}/100
      </p>
    </div>
  );
};

// ✅ Header
const CategoryHeader = ({
  title,
  categoryScore = 0,
}: {
  title: string;
  categoryScore?: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

// ✅ Content
const CategoryContent = ({
  tips = [],
}: {
  tips?: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  if (!tips.length) {
    return (
      <p className="text-gray-400 text-center py-4">
        No suggestions available
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex gap-2 items-center" key={index}>
            <img
              src={
                tip.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              className="size-5"
            />
            <p className="text-xl text-gray-500">{tip.tip}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex gap-2 items-center">
              <img
                src={
                  tip.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                className="size-5"
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ MAIN COMPONENT (SAFE)
const Details = ({ feedback }: { feedback: Feedback | null }) => {
  // 🔥 NORMALIZED SAFE DATA
  const safeFeedback = {
    toneAndStyle: {
      score: feedback?.toneAndStyle?.score ?? 0,
      tips: feedback?.toneAndStyle?.tips ?? [],
    },
    content: {
      score: feedback?.content?.score ?? 0,
      tips: feedback?.content?.tips ?? [],
    },
    structure: {
      score: feedback?.structure?.score ?? 0,
      tips: feedback?.structure?.tips ?? [],
    },
    skills: {
      score: feedback?.skills?.score ?? 0,
      tips: feedback?.skills?.tips ?? [],
    },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={safeFeedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={safeFeedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={safeFeedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={safeFeedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={safeFeedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={safeFeedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={safeFeedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={safeFeedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;