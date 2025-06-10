
import { GoogleGenAI } from "@google/genai";

// --- Global DOM Element References ---
const userPromptInput = document.getElementById('userPrompt') as HTMLInputElement;
const enhanceButton = document.getElementById('enhanceButton') as HTMLButtonElement;
const loadingAnimation = document.getElementById('loadingAnimation');
const loadingText = document.getElementById('loadingText');
const resultsDiv = document.getElementById('results');
const imagePromptOutputContainer = document.getElementById('imagePromptOutputContainer') as HTMLElement;
const videoPromptOutputContainer = document.getElementById('videoPromptOutputContainer') as HTMLElement;
const imagePromptVariationsDiv = document.getElementById('imagePromptVariationsDiv') as HTMLElement;
const videoPromptVariationsDiv = document.getElementById('videoPromptVariationsDiv') as HTMLElement;
const errorMessageDiv = document.getElementById('errorMessage');
const errorMessageText = document.getElementById('errorMessageText');
const analyzeOriginalPromptButton = document.getElementById('analyzeOriginalPromptButton') as HTMLButtonElement;
const originalPromptAnalysisResultDiv = document.getElementById('originalPromptAnalysisResult');
const originalPromptAnalysisText = document.getElementById('originalPromptAnalysisText');
const originalPromptAnalysisLoader = document.getElementById('originalPromptAnalysisLoader');
const promptDetailSlider = document.getElementById('promptDetailSlider') as HTMLInputElement;
const promptDetailValue = document.getElementById('promptDetailValue') as HTMLSpanElement;
const downloadPromptsButton = document.getElementById('downloadPromptsButton') as HTMLButtonElement;
const onlyImageCheckbox = document.getElementById('onlyImageCheckbox') as HTMLInputElement;
const onlyVideoCheckbox = document.getElementById('onlyVideoCheckbox') as HTMLInputElement;
const onlyImageCheckboxLabel = document.getElementById('onlyImageCheckboxLabel') as HTMLLabelElement;
const onlyVideoCheckboxLabel = document.getElementById('onlyVideoCheckboxLabel') as HTMLLabelElement;
const resultsSeparator = document.getElementById('resultsSeparator') as HTMLElement;
const notificationSound = document.getElementById('notificationSound') as HTMLAudioElement | null; 

// --- Detail Style Checkboxes ---
const highlyDetailedCheckbox = document.getElementById('highlyDetailedCheckbox') as HTMLInputElement;
const simpleCheckbox = document.getElementById('simpleCheckbox') as HTMLInputElement;
const highlyDetailedLabel = document.getElementById('highlyDetailedLabel') as HTMLLabelElement;
const simpleLabel = document.getElementById('simpleLabel') as HTMLLabelElement;


// --- Creative Idea Generator DOM Elements ---
const ideaKeywordsInput = document.getElementById('ideaKeywordsInput') as HTMLInputElement;
const generateImageIdeasButton = document.getElementById('generateImageIdeasButton') as HTMLButtonElement;
const generateVideoIdeasButton = document.getElementById('generateVideoIdeasButton') as HTMLButtonElement;
const ideaLoadingAnimation = document.getElementById('ideaLoadingAnimation');
const ideaErrorMessageContainer = document.getElementById('ideaErrorMessageContainer');
const ideaErrorMessageText = document.getElementById('ideaErrorMessageText');
const creativeIdeasResultDiv = document.getElementById('creativeIdeasResultDiv');

// --- Photography Popup Menu DOM Elements ---
const togglePopupButton = document.getElementById('togglePopupButton') as HTMLButtonElement;
const popupMenuContainer = document.getElementById('popupMenuContainer') as HTMLDivElement;
const exposureSelect = document.getElementById('exposureSelect') as HTMLSelectElement;
const shutterSelect = document.getElementById('shutterSelect') as HTMLSelectElement;
const apertureSelect = document.getElementById('apertureSelect') as HTMLSelectElement;
const compositionSelect = document.getElementById('compositionSelect') as HTMLSelectElement;
const lightSelect = document.getElementById('lightSelect') as HTMLSelectElement;
const popupOverlay = document.getElementById('popupOverlay') as HTMLDivElement;
const closePopupButton = document.getElementById('closePopupButton') as HTMLButtonElement;
const confirmPhotographySettingsButton = document.getElementById('confirmPhotographySettingsButton') as HTMLButtonElement;

// --- 3D Design Popup Menu DOM Elements ---
const toggleThreeDPopupButton = document.getElementById('toggleThreeDPopupButton') as HTMLButtonElement;
const threeDMenuContainer = document.getElementById('threeDMenuContainer') as HTMLDivElement;
const threeDStyle1Select = document.getElementById('threeDStyle1Select') as HTMLSelectElement;
const threeDStyle2Select = document.getElementById('threeDStyle2Select') as HTMLSelectElement;
const threeDStyle3Select = document.getElementById('threeDStyle3Select') as HTMLSelectElement;
const threeDLightSelect = document.getElementById('threeDLightSelect') as HTMLSelectElement;
const closeThreeDPopupButton = document.getElementById('closeThreeDPopupButton') as HTMLButtonElement;
const confirmThreeDSettingsButton = document.getElementById('confirmThreeDSettingsButton') as HTMLButtonElement;

// --- Flat Design Popup Menu DOM Elements ---
const toggleFlatDesignPopupButton = document.getElementById('toggleFlatDesignPopupButton') as HTMLButtonElement;
const flatDesignMenuContainer = document.getElementById('flatDesignMenuContainer') as HTMLDivElement;
const flatDesignStyleSelect = document.getElementById('flatDesignStyleSelect') as HTMLSelectElement;
const flatDesignColorSelect = document.getElementById('flatDesignColorSelect') as HTMLSelectElement;
const flatDesignViewSelect = document.getElementById('flatDesignViewSelect') as HTMLSelectElement;
const closeFlatDesignPopupButton = document.getElementById('closeFlatDesignPopupButton') as HTMLButtonElement;
const confirmFlatDesignSettingsButton = document.getElementById('confirmFlatDesignSettingsButton') as HTMLButtonElement;

// --- Prompt Quantity Radio Buttons ---
const promptQuantityRadios = Array.from(document.querySelectorAll('input[name="promptQuantity"]')) as HTMLInputElement[];


// --- AI SDK INITIALIZATION ---
let ai: GoogleGenAI | undefined;
let lastFocusedElement: HTMLElement | null = null;

function initializeAiSDK() {
    if (!ai) {
        const apiKey = process.env.API_KEY; 
        if (!apiKey) {
            console.error("API_KEY environment variable is not set. The application will not function correctly.");
            if (errorMessageText) errorMessageText.textContent = "Kesalahan Konfigurasi: API Key tidak ditemukan. Aplikasi tidak dapat berfungsi.";
            if (errorMessageDiv) errorMessageDiv.classList.remove('hidden');
            disableInteraction(true); // Disable all interactive elements
            return false;
        }
        try {
            ai = new GoogleGenAI({ apiKey });
        } catch (e: any) {
            console.error("Failed to initialize GoogleGenAI SDK:", e);
            if (errorMessageText) errorMessageText.textContent = `Kesalahan Inisialisasi SDK: ${e.message}. API Key mungkin tidak valid.`;
            if (errorMessageDiv) errorMessageDiv.classList.remove('hidden');
            disableInteraction(true); // Disable all interactive elements
            return false;
        }
    }
    return true;
}

// --- UTILITY FUNCTIONS ---
function showLoading(message: string = "Memproses...") {
    if (loadingAnimation) loadingAnimation.classList.remove('hidden');
    if (loadingText) loadingText.textContent = message;
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (errorMessageDiv) errorMessageDiv.classList.add('hidden');
    disableInteraction(true);
}

function hideLoading() {
    if (loadingAnimation) loadingAnimation.classList.add('hidden');
    disableInteraction(false);
}

function disableInteraction(disabled: boolean) {
    if (enhanceButton) enhanceButton.disabled = disabled;
    if (userPromptInput) userPromptInput.disabled = disabled;
    if (analyzeOriginalPromptButton) analyzeOriginalPromptButton.disabled = disabled;
    if (promptDetailSlider) promptDetailSlider.disabled = disabled;
    
    // Checkboxes and their labels
    if (onlyImageCheckbox) onlyImageCheckbox.disabled = disabled;
    if (onlyVideoCheckbox) onlyVideoCheckbox.disabled = disabled;
    // Labels for custom styled checkboxes are handled by disabling their corresponding input
    // and CSS :disabled pseudo-class on the label if needed, or JS to manage aria-disabled and pointer-events.
    // For now, disabling the input itself should be sufficient for sr-only inputs.

    if (highlyDetailedCheckbox) highlyDetailedCheckbox.disabled = disabled;
    if (simpleCheckbox) simpleCheckbox.disabled = disabled;

    if (togglePopupButton) togglePopupButton.disabled = disabled;
    if (toggleThreeDPopupButton) toggleThreeDPopupButton.disabled = disabled;
    if (toggleFlatDesignPopupButton) toggleFlatDesignPopupButton.disabled = disabled;
    
    if (confirmPhotographySettingsButton) confirmPhotographySettingsButton.disabled = disabled;
    if (confirmThreeDSettingsButton) confirmThreeDSettingsButton.disabled = disabled;
    if (confirmFlatDesignSettingsButton) confirmFlatDesignSettingsButton.disabled = disabled;

    if (ideaKeywordsInput) ideaKeywordsInput.disabled = disabled;
    if (generateImageIdeasButton) generateImageIdeasButton.disabled = disabled;
    if (generateVideoIdeasButton) generateVideoIdeasButton.disabled = disabled;
    if (downloadPromptsButton) downloadPromptsButton.disabled = disabled;
    promptQuantityRadios.forEach(radio => radio.disabled = disabled);
}

function showError(message: string) {
    if (errorMessageText) errorMessageText.textContent = message;
    if (errorMessageDiv) errorMessageDiv.classList.remove('hidden');
    hideLoading();
    if (originalPromptAnalysisLoader) originalPromptAnalysisLoader.classList.add('hidden');
    if (ideaLoadingAnimation) ideaLoadingAnimation.classList.add('hidden');
}

function playNotificationSound() {
    if (notificationSound) {
        notificationSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'; // Example sound
        notificationSound.play().catch(e => console.warn("Error playing notification sound:", e));
    }
}

function copyToClipboard(text: string, buttonElement: HTMLButtonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = buttonElement.innerHTML;
        const feedbackSpan = buttonElement.nextElementSibling as HTMLElement;
        
        buttonElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
        `;
        if (feedbackSpan && feedbackSpan.classList.contains('copied-feedback')) {
            feedbackSpan.style.opacity = '1';
        }

        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            if (feedbackSpan && feedbackSpan.classList.contains('copied-feedback')) {
                feedbackSpan.style.opacity = '0';
            }
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showError('Gagal menyalin teks.');
    });
}

function createVariationItem(variationNumber: number, promptText: string, isError: boolean = false, type: 'image' | 'video', originalPromptForAnalysis?: string): HTMLDivElement {
    const item = document.createElement('div');
    item.className = `variation-item ${isError ? 'error' : ''}`;
    item.setAttribute('role', 'listitem');

    const numberCol = document.createElement('div');
    numberCol.className = 'variation-number-column';
    numberCol.textContent = `#${variationNumber}`;
    item.appendChild(numberCol);

    const contentCol = document.createElement('div');
    contentCol.className = 'variation-content-column';

    const pre = document.createElement('pre');
    pre.textContent = promptText;
    contentCol.appendChild(pre);
    
    if (!isError) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', `Salin variasi prompt ${variationNumber}`);
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.75 9.25c0-.621-.504-1.125-1.125-1.125H18a2.25 2.25 0 00-2.25-2.25H13.5m1.5-1.5l-3-3m0 0l-3 3m3-3v11.25" />
            </svg>
        `;
        copyButton.onclick = () => copyToClipboard(promptText, copyButton);
        contentCol.appendChild(copyButton);

        const copiedFeedback = document.createElement('span');
        copiedFeedback.className = 'copied-feedback';
        copiedFeedback.textContent = 'Disalin!';
        contentCol.appendChild(copiedFeedback);
    }
    
    item.appendChild(contentCol);
    return item;
}

function displayResults(imagePrompts: string[], videoPrompts: string[]) {
    if (!resultsDiv || !imagePromptVariationsDiv || !videoPromptVariationsDiv || !imagePromptOutputContainer || !videoPromptOutputContainer || !resultsSeparator) return;

    resultsDiv.classList.remove('hidden');
    imagePromptVariationsDiv.innerHTML = '';
    videoPromptVariationsDiv.innerHTML = '';
    
    const showImage = !onlyImageCheckbox.checked || (!onlyImageCheckbox.checked && !onlyVideoCheckbox.checked);
    const showVideo = !onlyVideoCheckbox.checked || (!onlyImageCheckbox.checked && !onlyVideoCheckbox.checked);

    imagePromptOutputContainer.classList.toggle('hidden', !showImage || imagePrompts.length === 0);
    videoPromptOutputContainer.classList.toggle('hidden', !showVideo || videoPrompts.length === 0);
    resultsSeparator.classList.toggle('hidden', !(showImage && showVideo && imagePrompts.length > 0 && videoPrompts.length > 0));


    if (showImage && imagePrompts.length > 0) {
        imagePrompts.forEach((prompt, index) => {
            const item = createVariationItem(index + 1, prompt, false, 'image', userPromptInput.value);
            imagePromptVariationsDiv.appendChild(item);
        });
    } else if (showImage && imagePrompts.length === 0 && (onlyImageCheckbox.checked || (!onlyImageCheckbox.checked && !onlyVideoCheckbox.checked))) {
         imagePromptVariationsDiv.innerHTML = '<p class="text-slate-400 text-center py-4">Tidak ada prompt gambar yang dihasilkan.</p>';
    }


    if (showVideo && videoPrompts.length > 0) {
        videoPrompts.forEach((prompt, index) => {
            const item = createVariationItem(index + 1, prompt, false, 'video', userPromptInput.value);
            videoPromptVariationsDiv.appendChild(item);
        });
    } else if (showVideo && videoPrompts.length === 0 && (onlyVideoCheckbox.checked || (!onlyImageCheckbox.checked && !onlyVideoCheckbox.checked))) {
        videoPromptVariationsDiv.innerHTML = '<p class="text-slate-400 text-center py-4">Tidak ada prompt video yang dihasilkan.</p>';
    }
    
    if (downloadPromptsButton) {
        downloadPromptsButton.classList.remove('hidden', 'opacity-50', 'cursor-not-allowed');
        downloadPromptsButton.disabled = false;
    }
    playNotificationSound();
}

// --- CORE AI FUNCTIONS ---

function getSelectedPromptQuantity(): number {
    const selectedRadio = promptQuantityRadios.find(radio => radio.checked);
    return selectedRadio ? parseInt(selectedRadio.value) : 5; // Default to 5
}

async function generateEnhancedPrompts(originalPrompt: string) {
    if (!initializeAiSDK() || !ai) {
        showError("SDK AI tidak terinisialisasi. Silakan periksa API Key Anda.");
        return;
    }

    const detailLevel = parseInt(promptDetailSlider.value);
    let effectiveDetailLevel = detailLevel;
    let detailPreferenceInstruction = "";

    if (highlyDetailedCheckbox.checked) {
        effectiveDetailLevel = 5; // Max detail
        detailPreferenceInstruction = "Sangat ditekankan untuk menghasilkan output dengan detail yang sangat kaya, kompleks, dan mendalam. ";
    } else if (simpleCheckbox.checked) {
        effectiveDetailLevel = 1; // Min detail
        detailPreferenceInstruction = "Sangat ditekankan untuk menghasilkan output yang simpel, bersih, dan minimalis. ";
    }
    
    const photographySettings = getPhotographySettings();
    const threeDSettings = getThreeDSettings();
    const flatDesignSettings = getFlatDesignSettings();
    const numberOfPromptsToGenerate = getSelectedPromptQuantity();

    let systemInstruction = `Anda adalah ahli pembuatan prompt untuk model AI generatif gambar dan video. 
Tugas Anda adalah mengambil prompt sederhana dari pengguna dan mengubahnya menjadi beberapa variasi prompt yang lebih detail, kaya, dan siap pakai untuk menghasilkan gambar atau video berkualitas tinggi.

Instruksi Umum:
1.  **Analisis & Kembangkan**: Pahami inti dari prompt pengguna. Tambahkan elemen deskriptif seperti gaya artistik, pencahayaan, komposisi, emosi, warna dominan, detail objek, dan latar belakang yang relevan.
2.  **Variasi**: Buat ${numberOfPromptsToGenerate} variasi unik untuk setiap jenis output (gambar dan video) jika diminta. Setiap variasi harus menawarkan perspektif atau interpretasi yang sedikit berbeda dari prompt asli, sambil tetap setia pada inti permintaan.
3.  **Tingkat Kedetailan**: Sesuaikan tingkat kedetailan output berdasarkan skala ${effectiveDetailLevel} dari 1 (sangat simpel) hingga 5 (sangat detail dan kaya). Saat ini, pengguna meminta tingkat kedetailan ${effectiveDetailLevel}. ${detailPreferenceInstruction}
4.  **Format Output**: Kembalikan hasil dalam format JSON yang valid. Strukturnya harus:
    \`\`\`json
    {
      "image_prompts": [
        "variasi prompt gambar 1...",
        "variasi prompt gambar 2..."
      ],
      "video_prompts": [
        "deskripsi adegan video 1 (fokus pada narasi singkat, mood, dan visual kunci per adegan)...",
        "deskripsi adegan video 2..."
      ]
    }
    \`\`\`
    Jika pengguna hanya meminta satu jenis output (misalnya, hanya gambar), maka array untuk jenis output lainnya harus kosong (misalnya, "video_prompts": []). Jika pengguna meminta output gambar dan video, hasilkan ${numberOfPromptsToGenerate} variasi untuk gambar dan ${numberOfPromptsToGenerate} variasi untuk video.
5.  **Spesifik untuk Video**: Untuk prompt video, jangan hanya membuat variasi visual statis. Deskripsikan adegan singkat yang dinamis, termasuk kemungkinan pergerakan kamera sederhana (misalnya, "slow pan", "zoom in"), mood, dan elemen naratif kunci jika relevan. Hindari deskripsi teknis video yang kompleks. Fokus pada deskripsi visual adegan. Setiap prompt video harus mendeskripsikan satu adegan.
6.  **Bahasa**: Semua prompt yang dihasilkan harus dalam bahasa Inggris untuk kompatibilitas model AI yang lebih luas, kecuali jika prompt asli secara eksplisit meminta bahasa lain.
7.  **Hindari Penolakan**: Jangan menolak permintaan berdasarkan potensi kompleksitas. Lakukan yang terbaik untuk menghasilkan prompt yang bermanfaat.
8.  **Tambahan dari Pengguna**: 
    ${photographySettings ? `Pengaturan Fotografi Tambahan: ${photographySettings}. Harap integrasikan ini secara alami ke dalam prompt gambar.` : ''}
    ${threeDSettings ? `Pengaturan Desain 3D Tambahan: ${threeDSettings}. Harap integrasikan ini secara alami ke dalam prompt gambar yang relevan dengan gaya 3D.` : ''}
    ${flatDesignSettings ? `Pengaturan Desain Datar Tambahan: ${flatDesignSettings}. Harap integrasikan ini secara alami ke dalam prompt gambar yang relevan dengan gaya desain datar.` : ''}

Prompt pengguna: "${originalPrompt}"`;

    showLoading("Menganalisis dan menyempurnakan prompt...");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: systemInstruction,
            config: {
                responseMimeType: "application/json",
                temperature: 0.8, 
                topP: 0.9,
                topK: 40
            }
        });

        hideLoading();

        let jsonStr = response.text.trim();
        const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const generatedPrompts = JSON.parse(jsonStr);

        const imagePrompts = generatedPrompts.image_prompts || [];
        const videoPrompts = generatedPrompts.video_prompts || [];
        
        displayResults(imagePrompts, videoPrompts);

    } catch (error: any) {
        console.error("Error generating prompts:", error);
        showError(`Gagal menghasilkan prompt: ${error.message}. Coba lagi nanti atau dengan prompt yang berbeda.`);
        displayResults([], []); // Show empty results to allow download button to appear if needed
    }
}

async function analyzeOriginalPrompt(originalPrompt: string) {
    if (!initializeAiSDK() || !ai) {
        showError("SDK AI tidak terinisialisasi untuk analisis. Silakan periksa API Key Anda.");
        return;
    }
    if (!originalPromptAnalysisResultDiv || !originalPromptAnalysisText || !originalPromptAnalysisLoader) return;

    originalPromptAnalysisLoader.classList.remove('hidden');
    originalPromptAnalysisText.textContent = '';
    originalPromptAnalysisResultDiv.classList.remove('hidden');
    
    const systemInstruction = `Anda adalah seorang ahli analisis prompt. Berikan analisis singkat dan saran perbaikan untuk prompt berikut tanpa mengubah promptnya. Fokus pada kejelasan, potensi ambiguitas, dan saran untuk detail tambahan yang mungkin meningkatkan kualitas hasil dari model AI generatif. Jawaban harus dalam bahasa Indonesia, maksimal 50 kata. Prompt: "${originalPrompt}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: systemInstruction,
             config: { temperature: 0.5 }
        });
        originalPromptAnalysisText.textContent = response.text;
    } catch (error: any) {
        console.error("Error analyzing prompt:", error);
        originalPromptAnalysisText.textContent = `Gagal menganalisis: ${error.message}`;
    } finally {
        originalPromptAnalysisLoader.classList.add('hidden');
    }
}

async function generateCreativeIdeas(keywords: string, type: 'image' | 'video') {
    if (!initializeAiSDK() || !ai) {
        if(ideaErrorMessageText) ideaErrorMessageText.textContent = "SDK AI tidak terinisialisasi. Periksa API Key.";
        if(ideaErrorMessageContainer) ideaErrorMessageContainer.classList.remove('hidden');
        return;
    }
    if (!creativeIdeasResultDiv || !ideaLoadingAnimation || !ideaKeywordsInput || !ideaErrorMessageContainer || !ideaErrorMessageText) return;

    ideaLoadingAnimation.classList.remove('hidden');
    ideaErrorMessageContainer.classList.add('hidden');
    creativeIdeasResultDiv.classList.add('hidden');
    creativeIdeasResultDiv.innerHTML = ''; 
    disableInteraction(true);

    const outputType = type === 'image' ? 'gambar' : 'video pendek (maksimal 3 adegan)';
    const systemInstruction = `Anda adalah generator ide kreatif untuk prompt AI. Berdasarkan kata kunci berikut, hasilkan 3-5 ide konsep unik dan menarik untuk ${outputType}. Setiap ide harus berupa deskripsi singkat namun imajinatif.
    Format output harus berupa daftar poin, dengan setiap poin diawali "- ".
    Kata Kunci: "${keywords}"
    Contoh output untuk gambar:
    - Seekor kucing oranye mengendarai sepeda di kota Paris saat senja, dengan Menara Eiffel di latar belakang.
    - Ilustrasi cat air detail dari jam saku antik yang terbuka memperlihatkan galaksi mini di dalamnya.
    Contoh output untuk video:
    - Adegan 1: Close-up pada tangan yang menulis surat dengan pena bulu. Adegan 2: Surat tersebut terbang terbawa angin melintasi pedesaan. Adegan 3: Surat mendarat di depan pintu sebuah pondok tua.
    - Adegan 1: Seorang astronot melayang di angkasa, melihat ke Bumi. Adegan 2: Transisi cepat berbagai pemandangan indah di Bumi. Adegan 3: Astronot tersenyum.
    Buat ide dalam Bahasa Indonesia.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: systemInstruction,
            config: { temperature: 0.9, topP: 0.95 }
        });

        const ideasTextResponse = response.text;
        const ideasArray = ideasTextResponse.split('\\n').filter(idea => idea.trim().startsWith('-')).map(idea => idea.trim());

        if (ideasArray.length > 0) {
            const list = document.createElement('ul');
            list.className = 'list-disc list-inside space-y-2 text-slate-300';
            ideasArray.forEach(ideaTextOriginal => {
                const listItem = document.createElement('li');
                const cleanedIdeaText = ideaTextOriginal.substring(ideaTextOriginal.indexOf('- ') + 2); // Remove "- "
                listItem.textContent = cleanedIdeaText; 
                
                const useIdeaButton = document.createElement('button');
                useIdeaButton.textContent = 'Gunakan Ide Ini';
                useIdeaButton.className = 'feature-button ml-2 bg-sky-600 hover:bg-sky-700 text-xs';
                useIdeaButton.onclick = () => {
                    if (userPromptInput) {
                        userPromptInput.value = cleanedIdeaText;
                        userPromptInput.focus();
                        userPromptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        if (creativeIdeasResultDiv) {
                            creativeIdeasResultDiv.innerHTML = '<p class="text-green-400 text-center py-2">Ide telah disalin ke input prompt utama!</p>';
                            setTimeout(() => {
                                if (creativeIdeasResultDiv && creativeIdeasResultDiv.innerHTML.includes('Ide telah disalin')) {
                                    creativeIdeasResultDiv.innerHTML = '';
                                    creativeIdeasResultDiv.classList.add('hidden');
                                }
                            }, 3000);
                        }
                    }
                };
                listItem.appendChild(useIdeaButton);
                list.appendChild(listItem);
            });
            if (creativeIdeasResultDiv) {
                creativeIdeasResultDiv.appendChild(list);
                creativeIdeasResultDiv.classList.remove('hidden');
            }
        } else {
            if (creativeIdeasResultDiv) {
                creativeIdeasResultDiv.innerHTML = '<p class="text-slate-400 text-center py-2">Tidak ada ide yang ditemukan. Coba kata kunci lain.</p>';
                creativeIdeasResultDiv.classList.remove('hidden');
            }
        }

    } catch (error: any) {
        console.error("Error generating creative ideas:", error);
        if (ideaErrorMessageText) ideaErrorMessageText.textContent = `Gagal menghasilkan ide: ${error.message}`;
        if (ideaErrorMessageContainer) ideaErrorMessageContainer.classList.remove('hidden');
    } finally {
        if (ideaLoadingAnimation) ideaLoadingAnimation.classList.add('hidden');
        disableInteraction(false);
         // Re-enable interaction for idea generation section specifically
        if (ideaKeywordsInput) ideaKeywordsInput.disabled = false;
        if (generateImageIdeasButton) generateImageIdeasButton.disabled = false;
        if (generateVideoIdeasButton) generateVideoIdeasButton.disabled = false;
    }
}


// --- EVENT LISTENERS & INITIAL SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    if (!initializeAiSDK()) {
        console.warn("SDK Gagal diinisialisasi pada DOMContentLoaded. Fungsi utama mungkin terpengaruh.");
    }

    if (enhanceButton) {
        enhanceButton.onclick = () => {
            if (userPromptInput && userPromptInput.value.trim() !== '') {
                generateEnhancedPrompts(userPromptInput.value.trim());
            } else {
                showError("Masukkan prompt terlebih dahulu.");
                if (userPromptInput) userPromptInput.focus();
            }
        };
    }

    if (analyzeOriginalPromptButton) {
        analyzeOriginalPromptButton.onclick = () => {
            if (userPromptInput && userPromptInput.value.trim() !== '') {
                analyzeOriginalPrompt(userPromptInput.value.trim());
            } else {
                showError("Masukkan prompt untuk dianalisis.");
                 if (userPromptInput) userPromptInput.focus();
            }
        };
    }
    
    if (promptDetailSlider && promptDetailValue) {
        promptDetailSlider.oninput = () => {
            promptDetailValue.textContent = promptDetailSlider.value;
        };
        // Initialize
        promptDetailValue.textContent = promptDetailSlider.value;
    }

    if (downloadPromptsButton) {
        downloadPromptsButton.onclick = () => {
            let content = "--- PROMPT GAMBAR ---\\n\\n";
            const imageItems = imagePromptVariationsDiv.querySelectorAll('.variation-item pre');
            imageItems.forEach((item) => { 
                content += `${item.textContent || ''}\\n\\n`;
            });

            content += "\\n--- PROMPT VIDEO ---\\n\\n";
            const videoItems = videoPromptVariationsDiv.querySelectorAll('.variation-item pre');
            videoItems.forEach((item) => { 
                content += `${item.textContent || ''}\\n\\n`;
            });

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hasil_prompt_enhance_pro.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }

    function handleCheckboxExclusivity(checkbox1: HTMLInputElement, checkbox2: HTMLInputElement, label1: HTMLLabelElement, label2: HTMLLabelElement) {
        if (checkbox1.checked) {
            checkbox2.checked = false;
            label2.setAttribute('aria-checked', 'false');
        }
        label1.setAttribute('aria-checked', checkbox1.checked.toString());
        // For the other checkbox, ensure its aria-checked is also updated if it was programmatically unchecked
        label2.setAttribute('aria-checked', checkbox2.checked.toString()); 
    }
    
    // --- Custom Checkbox Logic (including Prompt Type Filters) ---
    function setupCustomCheckbox(checkbox: HTMLInputElement, label: HTMLLabelElement) {
        if (!checkbox || !label) return;

        const updateAria = () => {
            label.setAttribute('aria-checked', checkbox.checked.toString());
        };

        checkbox.addEventListener('change', updateAria);
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true })); 
            }
        });
        updateAria(); // Initial state
    }
    
    if (onlyImageCheckbox && onlyVideoCheckbox && onlyImageCheckboxLabel && onlyVideoCheckboxLabel) {
        setupCustomCheckbox(onlyImageCheckbox, onlyImageCheckboxLabel);
        setupCustomCheckbox(onlyVideoCheckbox, onlyVideoCheckboxLabel);

        onlyImageCheckbox.addEventListener('change', () => {
            handleCheckboxExclusivity(onlyImageCheckbox, onlyVideoCheckbox, onlyImageCheckboxLabel, onlyVideoCheckboxLabel);
        });
        onlyVideoCheckbox.addEventListener('change', () => {
            handleCheckboxExclusivity(onlyVideoCheckbox, onlyImageCheckbox, onlyVideoCheckboxLabel, onlyImageCheckboxLabel);
        });
    }
    
    // --- Detail Style Checkbox Logic ---
    if (highlyDetailedCheckbox && highlyDetailedLabel && simpleCheckbox && simpleLabel) {
        setupCustomCheckbox(highlyDetailedCheckbox, highlyDetailedLabel);
        setupCustomCheckbox(simpleCheckbox, simpleLabel);

        highlyDetailedCheckbox.addEventListener('change', () => {
            if (highlyDetailedCheckbox.checked) {
                simpleCheckbox.checked = false;
                simpleLabel.setAttribute('aria-checked', 'false');
            }
        });

        simpleCheckbox.addEventListener('change', () => {
            if (simpleCheckbox.checked) {
                highlyDetailedCheckbox.checked = false;
                highlyDetailedLabel.setAttribute('aria-checked', 'false');
            }
        });
    }

    // --- Creative Idea Generator Event Listeners ---
    if (generateImageIdeasButton && ideaKeywordsInput) {
        generateImageIdeasButton.onclick = () => {
            if (ideaKeywordsInput.value.trim() !== '') {
                generateCreativeIdeas(ideaKeywordsInput.value.trim(), 'image');
            } else {
                if (ideaErrorMessageText) ideaErrorMessageText.textContent = "Masukkan kata kunci untuk ide gambar.";
                if (ideaErrorMessageContainer) ideaErrorMessageContainer.classList.remove('hidden');
                ideaKeywordsInput.focus();
            }
        };
    }
    if (generateVideoIdeasButton && ideaKeywordsInput) {
        generateVideoIdeasButton.onclick = () => {
            if (ideaKeywordsInput.value.trim() !== '') {
                generateCreativeIdeas(ideaKeywordsInput.value.trim(), 'video');
            } else {
                if (ideaErrorMessageText) ideaErrorMessageText.textContent = "Masukkan kata kunci untuk ide video.";
                if (ideaErrorMessageContainer) ideaErrorMessageContainer.classList.remove('hidden');
                ideaKeywordsInput.focus();
            }
        };
    }
    
    // --- Popup Menu Logic ---
    function openPopup(popup: HTMLDivElement, triggerButton: HTMLButtonElement) {
        if (popupOverlay) popupOverlay.classList.remove('hidden');
        popup.classList.remove('hidden');
        triggerButton.setAttribute('aria-expanded', 'true');
        lastFocusedElement = document.activeElement as HTMLElement; 
        
        const firstFocusable = popup.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    function closePopup(popup: HTMLDivElement, triggerButton: HTMLButtonElement) {
        popup.classList.add('hidden');
        if (popupOverlay) popupOverlay.classList.add('hidden');
        triggerButton.setAttribute('aria-expanded', 'false');
        if (lastFocusedElement) {
            lastFocusedElement.focus(); 
            lastFocusedElement = null;
        }
    }

    function setupPopup(triggerButton: HTMLButtonElement | null, popup: HTMLDivElement | null, closeButton: HTMLButtonElement | null, confirmButton?: HTMLButtonElement | null) {
        if (!triggerButton || !popup || !closeButton || !popupOverlay) return;

        triggerButton.addEventListener('click', () => {
            const isHidden = popup.classList.contains('hidden');
            if (popupMenuContainer && popupMenuContainer !== popup && !popupMenuContainer.classList.contains('hidden') && togglePopupButton) {
                closePopup(popupMenuContainer, togglePopupButton);
            }
            if (threeDMenuContainer && threeDMenuContainer !== popup && !threeDMenuContainer.classList.contains('hidden') && toggleThreeDPopupButton) {
                closePopup(threeDMenuContainer, toggleThreeDPopupButton);
            }
            if (flatDesignMenuContainer && flatDesignMenuContainer !== popup && !flatDesignMenuContainer.classList.contains('hidden') && toggleFlatDesignPopupButton) {
                 closePopup(flatDesignMenuContainer, toggleFlatDesignPopupButton);
            }

            if (isHidden) {
                openPopup(popup, triggerButton);
            } else {
                closePopup(popup, triggerButton);
            }
        });

        closeButton.addEventListener('click', () => closePopup(popup, triggerButton));
        if (confirmButton) {
            confirmButton.addEventListener('click', () => closePopup(popup, triggerButton));
        }
    }
    
    setupPopup(togglePopupButton, popupMenuContainer, closePopupButton, confirmPhotographySettingsButton);
    setupPopup(toggleThreeDPopupButton, threeDMenuContainer, closeThreeDPopupButton, confirmThreeDSettingsButton);
    setupPopup(toggleFlatDesignPopupButton, flatDesignMenuContainer, closeFlatDesignPopupButton, confirmFlatDesignSettingsButton);


    if (popupOverlay) {
        popupOverlay.addEventListener('click', () => {
            if (popupMenuContainer && !popupMenuContainer.classList.contains('hidden') && togglePopupButton) {
                closePopup(popupMenuContainer, togglePopupButton);
            }
            if (threeDMenuContainer && !threeDMenuContainer.classList.contains('hidden') && toggleThreeDPopupButton) {
                closePopup(threeDMenuContainer, toggleThreeDPopupButton);
            }
            if (flatDesignMenuContainer && !flatDesignMenuContainer.classList.contains('hidden') && toggleFlatDesignPopupButton) {
                closePopup(flatDesignMenuContainer, toggleFlatDesignPopupButton);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (popupMenuContainer && !popupMenuContainer.classList.contains('hidden') && togglePopupButton) {
                closePopup(popupMenuContainer, togglePopupButton);
            }
            if (threeDMenuContainer && !threeDMenuContainer.classList.contains('hidden') && toggleThreeDPopupButton) {
                closePopup(threeDMenuContainer, toggleThreeDPopupButton);
            }
            if (flatDesignMenuContainer && !flatDesignMenuContainer.classList.contains('hidden') && toggleFlatDesignPopupButton) {
                closePopup(flatDesignMenuContainer, toggleFlatDesignPopupButton);
            }
        }
    });

    if (!process.env.API_KEY) { 
        disableInteraction(true);
    }

    promptQuantityRadios.forEach(radio => {
        const label = document.querySelector(`label[for="${radio.id}"]`) as HTMLLabelElement | null;
        if (label) {
            label.setAttribute('aria-checked', radio.checked.toString());
            radio.addEventListener('change', () => {
                promptQuantityRadios.forEach(r => { 
                    const lbl = document.querySelector(`label[for="${r.id}"]`) as HTMLLabelElement | null;
                    if (lbl) {
                        lbl.setAttribute('aria-checked', r.checked.toString());
                    }
                });
            });
            label.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true })); 
                }
            });
        }
    });

});

// --- Helper functions for popup data ---
function getPhotographySettings(): string {
    if (!exposureSelect || !shutterSelect || !apertureSelect || !compositionSelect || !lightSelect) return "";
    const settings = [
        exposureSelect.value,
        shutterSelect.value,
        apertureSelect.value,
        compositionSelect.value,
        lightSelect.value
    ].filter(Boolean).join(', ');
    return settings ? `Photography settings: ${settings}` : "";
}

function getThreeDSettings(): string {
    if (!threeDStyle1Select || !threeDStyle2Select || !threeDStyle3Select || !threeDLightSelect) return "";
    const settings = [
        threeDStyle1Select.value,
        threeDStyle2Select.value,
        threeDStyle3Select.value,
        threeDLightSelect.value
    ].filter(Boolean).join(', ');
    return settings ? `3D Design settings: ${settings}` : "";
}

function getFlatDesignSettings(): string {
    if (!flatDesignStyleSelect || !flatDesignColorSelect || !flatDesignViewSelect) return "";
    const settings = [
        flatDesignStyleSelect.value,
        flatDesignColorSelect.value,
        flatDesignViewSelect.value
    ].filter(Boolean).join(', ');
    return settings ? `Flat Design settings: ${settings}` : "";
}
