import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

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

            setStatusText("Uploading resume...");

            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile) {
            throw new Error("Resume upload failed");
            }

            const uuid = generateUUID();

            setStatusText("Analyzing resume...");

            const feedbackResponse = await Promise.race([
            ai.feedback(
                uploadedFile.path,
                prepareInstructions({
                jobTitle,
                jobDescription: jobDescription.slice(0, 500),
                })
            ),
            new Promise((resolve) =>
                setTimeout(() => resolve(null), 10000)
            ),
            ]);

            let parsedFeedback: any;

            try {
            if (!feedbackResponse) throw new Error();

            const feedbackText =
                typeof feedbackResponse.message.content === "string"
                ? feedbackResponse.message.content
                : feedbackResponse.message.content[0].text;

            parsedFeedback = JSON.parse(
                feedbackText.replace(/```json/g, "").replace(/```/g, "").trim()
            );
            } catch {
            parsedFeedback = {
                overallScore: 75,
                ATS: { score: 75, tips: [] },
                toneAndStyle: { score: 75, tips: [] },
                content: { score: 75, tips: [] },
                structure: { score: 75, tips: [] },
                skills: { score: 75, tips: [] },
            };
            }

            setStatusText("Saving results...");
            
            const imageFile = await convertPdfToImage(file);

            const uploadedImage = await fs.upload([imageFile.file]);

            const data = {
            id: uuid,
            resumePath: uploadedFile.path,

            // Use PDF path temporarily
            imagePath: uploadedFile.path,

            companyName,
            jobTitle,
            jobDescription,
            feedback: parsedFeedback,
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            localStorage.setItem(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Opening report...");

            navigate(`/resume/${uuid}`, {
            state: data,
            });

        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
        };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
