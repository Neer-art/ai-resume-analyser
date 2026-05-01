import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
]);

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth, id, navigate]);

  // ✅ Load resume (FAST)
  useEffect(() => {
    const loadResume = async () => {
      try {
        let data = location.state;

        // fallback localStorage
        if (!data) {
          const saved = localStorage.getItem("resumeData");
          if (saved) data = JSON.parse(saved);
        }

        // fallback KV (slow)
        if (!data) {
          const stored = await kv.get(`resume:${id}`);
          if (!stored) return;
          data = JSON.parse(stored);
        }

        // ✅ Load PDF
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) return;

        const pdfBlob = new Blob([resumeBlob], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(pdfBlob);
        setResumeUrl(url);

        // ✅ Load feedback instantly
        setFeedback(data.feedback);

      } catch (err) {
        console.error("Load error:", err);
      }
    };

    loadResume();
  }, [id, location, kv, fs]);

  // ✅ Loading UI
  if (!feedback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="animate-pulse text-gray-600">
          Loading resume... ⏳
        </h2>
      </div>
    );
  }

  return (
    <main className="!pt-0">
      {/* NAV */}
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">

        {/* ✅ LEFT SIDE (FIXED HEIGHT + SCROLL PDF VIEWER) */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 flex items-center justify-center">

          {resumeUrl && (
            <div className="resume-viewer">
              <iframe
                src={resumeUrl}
                className="resume-iframe"
              />
            </div>
          )}

        </section>

        {/* RIGHT SIDE */}
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">
            Resume Review
          </h2>

          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <Summary feedback={feedback} />
            <ATS
              score={feedback.ATS?.score || 0}
              suggestions={feedback.ATS?.tips || []}
            />
            <Details feedback={feedback} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;