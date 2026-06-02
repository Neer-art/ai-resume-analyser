import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
  tips,
  strengths = [],
  detectedSkills = [],
  missingSkills = [],
}: {
  tips: {
    type: "good" | "improve";
    tip: string;
    explanation: string;
  }[];
  strengths?: string[];
  detectedSkills?: string[];
  missingSkills?: string[];
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-700 mb-3">
            ✅ Strengths
          </h3>

          <ul className="list-disc ml-5 space-y-2">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      <div className="flex flex-col gap-4 w-full">
        <h3 className="font-bold text-yellow-700">
          ⚠ Suggestions
        </h3>

        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            )}
          >
            <p className="font-semibold">
              {tip.tip}
            </p>

            <p className="text-sm">
              {tip.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Detected Skills */}
      {detectedSkills.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">
            🎯 Detected Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {detectedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">
            ❌ Missing Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} 
              strengths={feedback.skills.strengths || []}
              detectedSkills={feedback.skills.detectedSkills || []}
              missingSkills={feedback.skills.missingSkills || []}
              tips={feedback.structure.tips}
              strengths={feedback.structure.strengths || []}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
