// js/UIHandler.js
import { GAME_CONFIG } from './config.js'; // <- Adicionado o ./

const DIG_ANIMATION_DURATION = 2500;

export class UIHandler {
    constructor(onCellClickCallback) {
        this.onCellClickCallback = onCellClickCallback;

        this.tutorialModal = document.getElementById('tutorial-modal');
        this.startModal = document.getElementById('start-modal');
        this.successModal = document.getElementById('success-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.retryModal = document.getElementById('retry-modal');

        this.dinoPreviewImg = document.getElementById('dino-preview-img');
        this.startTitle = document.getElementById('start-title');
        this.startReadyBtn = document.getElementById('start-ready-btn');

        this.brushSound = new Audio(GAME_CONFIG.SOUNDS.BRUSH);
        this.brushSound.preload = 'auto';

        this.bgMusic = new Audio(GAME_CONFIG.SOUNDS.MUSIC);
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.05;
        this.bgMusic.preload = 'auto';
        this.musicStarted = false;

        this.isMuted = localStorage.getItem('dinoGameMuted') === 'true';
        this.bgMusic.muted = this.isMuted;
        this.brushSound.muted = this.isMuted;

        this.isDigging = false;
        this.previewTimer = null;

        this.setupSoundToggle();
    }

    setupSoundToggle() {
        const btn = document.getElementById('sound-toggle-btn');
        if (!btn) return;

        btn.textContent = this.isMuted ? '🔇' : '🔊';

        btn.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            this.bgMusic.muted = this.isMuted;
            this.brushSound.muted = this.isMuted;
            btn.textContent = this.isMuted ? '🔇' : '🔊';
            localStorage.setItem('dinoGameMuted', this.isMuted);

            if (!this.isMuted) this.tryStartMusic();
        });
    }

    // Navegadores só permitem áudio com som depois de um gesto do usuário
    // (clique/toque) — por isso essa chamada acontece dentro dos handlers
    // dos botões "GOT IT!" e "I'M READY", que já são gestos do usuário.
    tryStartMusic() {
        if (this.musicStarted || this.isMuted) return;
        this.bgMusic.play()
            .then(() => { this.musicStarted = true; })
            .catch(() => {});
    }

    updateUI(level, timeStr, bonesFound, totalBones, brushes, lives, maxLives) {
        document.getElementById('level-display').innerText = level;
        document.getElementById('timer-display').innerText = timeStr;
        document.getElementById('score-display').innerText = `${bonesFound} / ${totalBones}`;
        document.getElementById('brush-display').innerText = brushes;

        const livesElement = document.getElementById('lives-display');
        if (livesElement) {
            const filledHearts = '🤎'.repeat(lives);
            const emptyHearts = '🖤'.repeat(Math.max(0, maxLives - lives));
            livesElement.innerText = filledHearts + emptyHearts;
        }
    }

    showTutorialModal(onCloseCallback) {
        if (this.tutorialModal) {
            this.tutorialModal.classList.remove('hidden');
            const btn = document.getElementById('tutorial-start-btn');
            
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                this.tutorialModal.classList.add('hidden');
                this.tryStartMusic();
                if (onCloseCallback) onCloseCallback();
            });
        } else if (onCloseCallback) {
            onCloseCallback();
        }
    }

    showStartModal(dinoImage, previewTimeMs, onCompleteCallback) {
        if (this.startModal) {
            if (this.dinoPreviewImg && dinoImage) {
                this.dinoPreviewImg.src = dinoImage;
            }
            if (this.startTitle) {
                this.startTitle.innerText = "Find this dino!";
            }

            this.startModal.classList.remove('hidden');

            let isCompleted = false;

            const finishPreview = () => {
                if (isCompleted) return;
                isCompleted = true;

                if (this.previewTimer) {
                    clearTimeout(this.previewTimer);
                    this.previewTimer = null;
                }

                this.startModal.classList.add('hidden');
                if (onCompleteCallback) onCompleteCallback();
            };

            if (this.startReadyBtn) {
                const newBtn = this.startReadyBtn.cloneNode(true);
                this.startReadyBtn.parentNode.replaceChild(newBtn, this.startReadyBtn);
                this.startReadyBtn = newBtn;

                this.startReadyBtn.addEventListener('click', () => {
                    this.tryStartMusic();
                    finishPreview();
                });
            }

            this.previewTimer = setTimeout(() => {
                finishPreview();
            }, previewTimeMs);

        } else if (onCompleteCallback) {
            onCompleteCallback();
        }
    }

    renderGrid(gameState) {
        const gridElement = document.getElementById('grid');
        if (!gridElement) return;

        gridElement.style.gridTemplateColumns = `repeat(${gameState.gridCols}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${gameState.gridRows}, 1fr)`;
        gridElement.innerHTML = '';

        gameState.board.forEach((cellValue, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (gameState.revealed[index]) {
                if (cellValue !== 0) {
                    cell.classList.add('state-dug-bone');
                    const boneImg = document.createElement('img');
                    boneImg.src = cellValue;
                    boneImg.alt = 'Bone fragment';
                    cell.appendChild(boneImg);
                } else {
                    cell.classList.add('state-dug-empty');
                }
            } else {
                cell.classList.add('state-covered');
                cell.addEventListener('click', () => {
                    if (this.isDigging) return;

                    this.isDigging = true;
                    cell.classList.remove('state-covered');
                    cell.classList.add('digging');
                    this.brushSound.currentTime = 0;
                    this.brushSound.play().catch(() => {});

                    setTimeout(() => {
                        cell.classList.remove('digging');
                        this.isDigging = false;
                        this.onCellClickCallback(index);
                    }, DIG_ANIMATION_DURATION);
                });
            }

            gridElement.appendChild(cell);
        });
    }

    showSuccessModal(onNextCallback) {
        if (this.successModal) {
            this.successModal.classList.remove('hidden');
            const nextBtn = document.getElementById('next-level-btn');
            const newBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newBtn, nextBtn);

            newBtn.addEventListener('click', () => {
                this.successModal.classList.add('hidden');
                if (onNextCallback) onNextCallback();
            });
        } else if (onNextCallback) {
            onNextCallback();
        }
    }

    showRetryModal(onRetryCallback) {
        if (this.retryModal) {
            this.retryModal.classList.remove('hidden');
            const retryBtn = document.getElementById('retry-btn');
            const newBtn = retryBtn.cloneNode(true);
            retryBtn.parentNode.replaceChild(newBtn, retryBtn);

            newBtn.addEventListener('click', () => {
                this.retryModal.classList.add('hidden');
                if (onRetryCallback) onRetryCallback();
            });
        } else if (onRetryCallback) {
            onRetryCallback();
        }
    }

    showGameOverModal(onRestartCallback) {
        if (this.gameOverModal) {
            this.gameOverModal.classList.remove('hidden');
            const restartBtn = document.getElementById('restart-game-btn');
            const newBtn = restartBtn.cloneNode(true);
            restartBtn.parentNode.replaceChild(newBtn, restartBtn);

            newBtn.addEventListener('click', () => {
                this.gameOverModal.classList.add('hidden');
                if (onRestartCallback) onRestartCallback();
            });
        } else if (onRestartCallback) {
            onRestartCallback();
        }
    }

    showMessage(msg) {
        alert(msg);
    }
}