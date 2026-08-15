import { GAME_LEVELS } from './LevelsConfig.js';
import { GameState } from './GameState.js';
import { UIHandler } from './UIHandler.js';

export class GameController {
    constructor() {
        this.state = new GameState();
        this.ui = new UIHandler((index) => this.handleCellClick(index));
        
        this.timerInterval = null;
        this.currentTimeLeft = 0;

        this.initGame();
        this.bindResize();
    }

    bindResize() {
        let resizeTimeout;
        const onResize = () => {
            // debounce: evita recalcular a cada pixel durante o arraste da janela
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // só re-renderiza se já houver um tabuleiro carregado
                if (this.state.gridCols > 0 && this.state.gridRows > 0) {
                    this.ui.renderGrid(this.state);
                }
            }, 150);
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
    }

    initGame() {
        this.state.resetGame();
        this.loadCurrentLevel(false);
    }

    loadCurrentLevel(isRetry = false) {
        const levelConfig = GAME_LEVELS[this.state.currentLevelIndex];
        
        this.ui.showStartModal(levelConfig, () => {
            this.startLevelPlay(levelConfig, isRetry);
        });
    }

    startLevelPlay(levelConfig, isRetry) {
        // Informa ao State se deve manter o tabuleiro anterior ou sortear um novo
        this.state.loadLevelConfig(levelConfig, isRetry);
        this.currentTimeLeft = levelConfig.timeLimit;

        this.updateHUD();
        this.ui.renderGrid(this.state);
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.currentTimeLeft--;
            this.updateHUD();

            if (this.currentTimeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleFailure("Time is up!");
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    updateHUD() {
        const levelConfig = GAME_LEVELS[this.state.currentLevelIndex];
        this.ui.updateUI(
            levelConfig.level,
            this.formatTime(this.currentTimeLeft),
            this.state.bonesFound,
            this.state.totalBones,
            this.state.brushCount,
            this.state.lives   // ← novo parâmetro
        );
    }

    handleCellClick(index) {
        const result = this.state.dig(index);
        if (!result.valid) return;

        this.updateHUD();
        this.ui.renderGrid(this.state);

        if (result.status === 'WIN') {
            clearInterval(this.timerInterval);
            this.handleSuccess();
        } else if (result.status === 'LOSE') {
            clearInterval(this.timerInterval);
            this.handleFailure("Out of shovels!");
        }
    }

    handleSuccess() {
        this.ui.showSuccessModal(() => {
            this.state.nextLevel();
            if (this.state.hasNextLevel(GAME_LEVELS.length)) {
                this.loadCurrentLevel(false); // Nova fase = tabuleiro novo aleatório
            } else {
                this.ui.showMessage("CONGRATULATIONS! You beat all 10 levels!");
                this.initGame();
            }
        });
    }

    handleFailure(reason) {
        console.log(`Level failed: ${reason}`);
        const remainingLives = this.state.loseLife();

        if (remainingLives > 0) {
            this.ui.showRetryModal(() => {
                this.loadCurrentLevel(true); // <-- AQUI ESTÁ O AJUSTE: Passa 'true' para manter os ossos no mesmo sítio!
            });
        } else {
            this.ui.showGameOverModal(() => {
                this.initGame();
            });
        }
    }
}