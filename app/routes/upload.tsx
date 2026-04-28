import { useState } from "react";
import type { FormEvent } from "react";

import Navbar from "../component/Navbar";
import FileUploader from "../component/FileUploader";
import { usePuterStore } from "../lib/puter";
import { useNavigate } from "react-router-dom";
import { generateUUID } from "../lib/utils";
import { prepareInstructions } from "../constants";

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      // 1️⃣ Upload PDF
      setStatusText("Uploading resume...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Upload failed");

      // 2️⃣ Convert PDF → Image (client only)
      setStatusText("Converting PDF...");
      if (typeof window === "undefined") {
        throw new Error("Client-side only");
      }

      const { convertPdfToImage } = await import("../lib/pdf2img");
      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {
        throw new Error(imageFile.error || "Conversion failed");
      }

      // 3️⃣ Upload image
      setStatusText("Uploading image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) throw new Error("Image upload failed");

      // 4️⃣ Save initial data
      setStatusText("Preparing data...");
      const uuid = generateUUID();

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // 5️⃣ AI Analysis (with timeout)
      setStatusText("Analyzing resume (10–20 sec)...");

      const shortDescription = jobDescription.slice(0, 1000);

      const feedback = await Promise.race([
        ai.feedback(
          uploadedFile.path,
          prepareInstructions({
            jobTitle,
            jobDescription: shortDescription,
          })
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 15000)
        ),
      ]).catch((err) => {
        console.error("AI ERROR:", err);
        return null;
      });

      if (!feedback) throw new Error("AI failed");

      // 6️⃣ Parse AI response safely
      let parsedFeedback = {};
      try {
        const content =
          typeof feedback?.message?.content === "string"
            ? feedback.message.content
            : feedback?.message?.content?.[0]?.text || "{}";

        parsedFeedback = JSON.parse(content);
      } catch (err) {
        console.error("JSON ERROR:", err);
      }

      data.feedback = parsedFeedback;

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // 7️⃣ Redirect
      setStatusText("Done! Redirecting...");
      navigate(`/resume/${uuid}`);

    } catch (err: any) {
      console.error("ERROR:", err);
      setStatusText(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2 className="animate-pulse text-gray-600">
                {statusText} ⏳
              </h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score</h2>
          )}

          {!isProcessing && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <input name="company-name" placeholder="Company Name" />
              <input name="job-title" placeholder="Job Title" />
              <textarea name="job-description" placeholder="Job Description" />

              <FileUploader onFileSelect={handleFileSelect} />

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;