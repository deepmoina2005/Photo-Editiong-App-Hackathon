import axios from "axios";

const API_KEY = "wx08frrxe86v2lo7k"; // Aapka OCR API Key
const BASE_URL = "https://techhk.aoscdn.com/";
const MAX_RETRIES = 60; // Maximum 60 tries (1 sec interval)

export const performOCR = async (file) => {
  try {
    // Step 1: Upload image and create OCR task
    const taskId = await createOCRTask(file);
    console.log("OCR Task Created, Task ID:", taskId);

    // Step 2: Poll for OCR result
    const ocrResult = await pollForOCRResult(taskId);
    console.log("OCR Result:", ocrResult);

    return ocrResult;
  } catch (error) {
    console.error("OCR Error:", error.message);
    throw error;
  }
};

// Create OCR task
const createOCRTask = async (file) => {
  const formData = new FormData();
  formData.append("image_file", file); // file: { uri, type, name }
  formData.append("format", "txt");    // Output format (txt, pdf, docx, etc.)

  const { data } = await axios.post(`${BASE_URL}/api/tasks/document/ocr`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-API-KEY": API_KEY,
    },
  });

  if (!data?.data?.task_id) {
    throw new Error("Failed to create OCR task!");
  }
  return data.data.task_id;
};

// Polling for OCR result
const pollForOCRResult = async (taskId, retries = 0) => {
  const result = await fetchOCRResult(taskId);

  if (result.state !== 1) { // state 1 = completed
    if (retries >= MAX_RETRIES) throw new Error("OCR result timeout");

    console.log(`OCR processing... (${retries}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 sec
    return pollForOCRResult(taskId, retries + 1);
  }

  return result;
};

// Fetch OCR result
const fetchOCRResult = async (taskId) => {
  const { data } = await axios.get(`${BASE_URL}/api/tasks/document/ocr/${taskId}`, {
    headers: { "X-API-KEY": API_KEY },
  });

  if (!data?.data) {
    throw new Error("OCR result not found!");
  }

  return data.data;
};
