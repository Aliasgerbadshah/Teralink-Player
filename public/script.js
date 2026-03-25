document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('streamForm');
    const linkInput = document.getElementById('teraboxLink');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const playerWrapper = document.getElementById('playerWrapper');
    const teraboxPlayer = document.getElementById('teraboxPlayer');
    const downloadBtn = document.getElementById('downloadBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = linkInput.value.trim();
        if (!url) return;

        // Reset states
        errorState.classList.add('hidden');
        playerWrapper.classList.add('hidden');
        loadingState.classList.remove('hidden');
        
        if (window.hlsInstance) {
            window.hlsInstance.destroy();
        }
        teraboxPlayer.src = ''; 
        if(downloadBtn) downloadBtn.classList.add('hidden');

        try {
            const response = await fetch('/api/video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                loadingState.classList.add('hidden');
                
                const streamUrl = data.embedUrl;
                
                // Initialize HLS natively if supported, else use HLS.js
                if (Hls.isSupported() && streamUrl.includes('m3u8')) {
                    const hls = new Hls();
                    window.hlsInstance = hls; // Keep instance reference to destroy later
                    hls.loadSource(streamUrl);
                    hls.attachMedia(teraboxPlayer);
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        teraboxPlayer.play();
                    });
                } else if (teraboxPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                    // For Safari which has native HLS support
                    teraboxPlayer.src = streamUrl;
                    teraboxPlayer.addEventListener('loadedmetadata', function() {
                        teraboxPlayer.play();
                    });
                } else {
                    // Fallback for direct MP4 links
                    teraboxPlayer.src = streamUrl;
                    teraboxPlayer.load();
                    teraboxPlayer.play();
                }
                
                if (data.downloadUrl && downloadBtn) {
                    downloadBtn.href = data.downloadUrl;
                    downloadBtn.classList.remove('hidden');
                }

                playerWrapper.classList.remove('hidden');
                playerWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(data.error || 'Invalid video link. Please try again.');
            }

        } catch (error) {
            loadingState.classList.add('hidden');
            errorState.textContent = Math.random() > 0.5 && error.message === 'Failed to fetch' 
                ? 'Network error. Make sure the server is running.' 
                : error.message;
            errorState.classList.remove('hidden');
        }
    });
});
