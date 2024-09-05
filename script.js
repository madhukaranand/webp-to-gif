const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById("convertBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("webpFile");
    if (!fileInput.files.length) {
        alert("Please select a WebP file first.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(event) {
        const fileData = event.target.result;
        await convertWebPToGif(new Uint8Array(fileData));
    };

    reader.readAsArrayBuffer(file);
});

async function convertWebPToGif(webpData) {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.webp', webpData);

    // Run FFmpeg command to convert WebP to GIF
    await ffmpeg.run('-i', 'input.webp', 'output.gif');

    const gifData = ffmpeg.FS('readFile', 'output.gif');
    const gifBlob = new Blob([gifData.buffer], { type: 'image/gif' });
    const gifUrl = URL.createObjectURL(gifBlob);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = gifUrl;
    downloadLink.download = 'converted.gif';
    downloadLink.textContent = 'Download GIF';
    downloadLink.classList.remove("hidden");
}
