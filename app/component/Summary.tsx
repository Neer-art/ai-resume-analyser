import ScoreGauge from "~/component/ScoreGauge";
import ScoreBadge from "~/component/ScoreBadge";

// ✅ SAFE CATEGORY COMPONENT
const Category = ({ title, score = 0 }: { title: string; score?: number }) => {
  const safeScore = score ?? 0;

  const textColor =
    safeScore > 70
      ? "text-green-600"
      : safeScore > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={safeScore} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{safeScore}</span>/100
        </p>
      </div>
    </div>
  );
};

// ✅ SAFE SUMMARY COMPONENT
const Summary = ({ feedback }: { feedback: Feedback | null }) => {
  // 🔥 DEFAULT SAFE STRUCTURE
  const safeFeedback = {
    overallScore: feedback?.overallScore ?? 0,
    toneAndStyle: {
      score: feedback?.toneAndStyle?.score ?? 0,
    },
    content: {
      score: feedback?.content?.score ?? 0,
    },
    structure: {
      score: feedback?.structure?.score ?? 0,
    },
    skills: {
      score: feedback?.skills?.score ?? 0,
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={safeFeedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      {/* ✅ SAFE CATEGORY USAGE */}
      <Category title="Tone & Style" score={safeFeedback.toneAndStyle.score} />
      <Category title="Content" score={safeFeedback.content.score} />
      <Category title="Structure" score={safeFeedback.structure.score} />
      <Category title="Skills" score={safeFeedback.skills.score} />
    </div>
  );
};

export default Summary;