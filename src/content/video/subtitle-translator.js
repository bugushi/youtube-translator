(() => {
    const OVERLAY_CLASS = 'guyu-translation-wrapper';
    const LINE_CLASS = 'guyu-translation-line';
    const HISTORY_EVENT = 'historyStateUpdated_guyu';

    let pauseTimer = null;
    let activeVideoElement;

    const YoutubeSubtitleTranslator = {
        init() {
            this.attachVideoWhenReady();
            this.listenForNavigationChanges();
        },

        attachVideoWhenReady() {
            let attempts = 0;
            const intervalId = setInterval(() => {
                if (attempts > 50 || activeVideoElement) {
                    clearInterval(intervalId);
                    return;
                }

                const candidate = document.querySelector('video');
                if (candidate) {
                    activeVideoElement = candidate;
                    this.registerVideoListeners(candidate);
                }

                attempts += 1;
            }, 200);
        },

        registerVideoListeners(videoEl) {
            videoEl.addEventListener('pause', () => {
                pauseTimer = setTimeout(() => this.translateCurrentCaption(), 50);
            });

            videoEl.addEventListener('play', () => {
                clearTimeout(pauseTimer);
                this.removeOverlay();
            });
        },

        listenForNavigationChanges() {
            chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
                if (request.method !== HISTORY_EVENT) {
                    return false;
                }

                activeVideoElement = document.querySelector('video');
                if (activeVideoElement) {
                    this.registerVideoListeners(activeVideoElement);
                }
                sendResponse();
                return true;
            });
        },

        translateCurrentCaption() {
            const captions = this.getCaptionLines();
            if (!captions.length) {
                return;
            }

            const wrapper = this.ensureOverlay();
            if (!wrapper) {
                return;
            }

            captions.forEach((text, index) => {
                chrome.runtime.sendMessage(
                    { contentScriptQuery: 'fetchTranslation_guyu', text, index },
                    translation => {
                        const line = translation?.sentences?.[0]?.trans || '';
                        this.renderTranslationLine(line, index);
                    }
                );
            });
        },

        getCaptionLines() {
            const captionNodes = document.querySelectorAll('.ytp-caption-segment');
            return Array.from(captionNodes).map(node => node.innerText).filter(Boolean);
        },

        ensureOverlay() {
            const existing = document.querySelector(`.${OVERLAY_CLASS}`);
            if (existing) {
                existing.innerHTML = '';
                return existing;
            }

            const wrapper = document.createElement('div');
            wrapper.classList.add(OVERLAY_CLASS);

            const playerContainer = document.querySelector('#ytd-player');
            if (!playerContainer) {
                return null;
            }

            playerContainer.appendChild(wrapper);
            return wrapper;
        },

        removeOverlay() {
            const existing = document.querySelector(`.${OVERLAY_CLASS}`);
            if (existing) {
                existing.remove();
            }
        },

        renderTranslationLine(text, index) {
            const wrapper = document.querySelector(`.${OVERLAY_CLASS}`);
            const captionSample = document.querySelector('.ytp-caption-segment');
            if (!wrapper || !captionSample) {
                return;
            }

            const translationLine = document.createElement('div');
            translationLine.classList.add(LINE_CLASS);
            const fontSize = parseFloat(captionSample.style.fontSize) || 16;
            translationLine.style.fontSize = fontSize * 0.9 + 'px';
            translationLine.innerText = text;

            const existingLine = document.querySelector(`.${LINE_CLASS}`);
            if (existingLine && index === 1) {
                wrapper.append(translationLine);
                return;
            }

            wrapper.prepend(translationLine);
        }
    };

    YoutubeSubtitleTranslator.init();
})();
