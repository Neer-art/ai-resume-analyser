export async function convertPdfToImage(file: File) {
  if (typeof window === "undefined") {
    return { imageUrl: "", file: null, error: "Client only" };
  }

  try {
    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Canvas not available");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ imageUrl: "", file: null, error: "Blob failed" });
          return;
        }

        resolve({
          imageUrl: URL.createObjectURL(blob),
          file: new File([blob], "resume.png", { type: "image/png" }),
        });
      });
    });

  } catch (err) {
    console.error("PDF ERROR:", err);
    return {
      imageUrl: "",
      file: null,
      error: "Failed to convert PDF to image",
    };
  }
}