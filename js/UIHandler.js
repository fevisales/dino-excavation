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

    updateUI(level, timeStr, bonesFound, totalBones, brushes) {
        document.getElementById('level-display').innerText = level;
        document.getElementById('timer-display').innerText = timeStr;
        document.getElementById('score-display').innerText = `${bonesFound} / ${totalBones}`;
        document.getElementById('brush-display').innerText = brushes;
    }

    renderGrid(state) {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';

        // Configura dinamicamente as colunas e linhas no CSS Grid
        gridElement.style.gridTemplateColumns = `repeat(${state.gridCols}, 48px)`;
        gridElement.style.gridTemplateRows = `repeat(${state.gridRows}, 48px)`;

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