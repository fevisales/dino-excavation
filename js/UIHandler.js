// js/UIHandler.js
export class UIHandler {
    constructor(onCellClickCallback) {
        this.onCellClickCallback = onCellClickCallback;

        this.startModal = document.getElementById('start-modal');
        this.successModal = document.getElementById('success-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.retryModal = document.getElementById('retry-modal');
        
        this.dinoPreviewImg = document.getElementById('dino-preview-img');
        this.startTitle = document.getElementById('start-title');
    }

    updateUI(level, timeStr, bonesFound, totalBones, brushes, lives) {
    document.getElementById('level-display').innerText = level;
    document.getElementById('timer-display').innerText = timeStr;
    document.getElementById('score-display').innerText = `${bonesFound} / ${totalBones}`;
    document.getElementById('brush-display').innerText = brushes;

    const livesEl = document.getElementById('lives-display');
    if (livesEl) {
        livesEl.innerText = '🤎'.repeat(lives) + '🖤'.repeat(3 - lives);
    }
}

    renderGrid(state) {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';

    const { gridCols: cols, gridRows: rows } = state;

    // Espaço máximo disponível pro tabuleiro (mesmo limite que tínhamos no CSS)
    const maxSize = Math.min(window.innerHeight * 0.65, window.innerWidth * 0.65, 600);

    // Tamanho de cada célula: cabe tanto na largura quanto na altura disponíveis,
    // então funciona igual para tabuleiros quadrados (2x2) e retangulares (7x6).
    const cellSize = Math.floor(Math.min(maxSize / cols, maxSize / rows));

    gridElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    gridElement.style.width = `${cellSize * cols}px`;
    gridElement.style.height = `${cellSize * rows}px`;

    state.board.forEach((cellValue, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (!state.revealed[index]) {
                cell.classList.add('state-covered');
            } else {
                if (cellValue === 1) {
                    cell.classList.add('state-dug-bone');
                    const img = document.createElement('img');
                    img.src = 'assets/images/bone.svg';
                    cell.appendChild(img);
                } else {
                    cell.classList.add('state-dug-empty');
                }
            }

            cell.addEventListener('click', () => {
                this.onCellClickCallback(index);
            });

            gridElement.appendChild(cell);
        });
    }

    showStartModal(levelConfig, onStartCallback) {
        if (this.startTitle) this.startTitle.innerText = `Find the bones of this ${levelConfig.dinosaurName}!`;
        if (this.dinoPreviewImg) this.dinoPreviewImg.src = `assets/images/skeletons/${levelConfig.dinosaur}_assembled.png`;
        
        if (this.startModal) {
            this.startModal.classList.remove('hidden');
            const startBtn = document.getElementById('start-game-btn');
            const newBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newBtn, startBtn);
            
            newBtn.addEventListener('click', () => {
                this.startModal.classList.add('hidden');
                if (onStartCallback) onStartCallback();
            });
        } else {
            if (onStartCallback) onStartCallback(); // Fallback caso a modal ainda não esteja no HTML
        }
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
        } else {
            if (onNextCallback) onNextCallback();
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
        } else {
            if (onRetryCallback) onRetryCallback();
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
        } else {
            if (onRestartCallback) onRestartCallback();
        }
    }

    showMessage(text) {
        alert(text);
    }
}