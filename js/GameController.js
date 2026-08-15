// js/GameController.js
import { GAME_LEVELS } from './LevelsConfig.js'; // <- Adicionado o ./
import { GameState } from './GameState.js';      // <- Adicionado o ./
import { UIHandler } from './UIHandler.js';      // <- Adicionado o ./

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
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
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

        if (this.state.isFirstLoad) {
            this.state.isFirstLoad = false;
            this.ui.showTutorialModal(() => {
                this.loadCurrentLevel(false);
            });
        } else {
            this.loadCurrentLevel(false);
        }
    }

    loadCurrentLevel(isRetry = false) {
        const levelConfig = GAME_LEVELS[this.state.currentLevelIndex];
        
        this.state.loadLevelConfig(levelConfig, isRetry);
        this.ui.renderGrid(this.state);

        this.currentTimeLeft = levelConfig.timeLimit;
        this.updateHUD();

        if (this.timerInterval) clearInterval(this.timerInterval);

        const previewTimeMs = 5000 + (this.state.currentLevelIndex * 1000);

        this.ui.showStartModal(levelConfig.dinoImage, previewTimeMs, () => {
            this.startTimer();
        });
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

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
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formattedMins = String(mins).padStart(2, '0');
        const formattedSecs = String(secs).padStart(2, '0');
        return `${formattedMins}:${formattedSecs}`;
    }

    updateHUD() {
        const levelConfig = GAME_LEVELS[this.state.currentLevelIndex];
        this.ui.updateUI(
            levelConfig.level,
            this.formatTime(this.currentTimeLeft),
            this.state.bonesFound,
            this.state.totalBones,
            this.state.brushCount,
            this.state.lives,
            this.state.maxLives
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
                this.loadCurrentLevel(false);
            } else {
                this.ui.showMessage("CONGRATULATIONS! You beat all levels!");
                this.initGame();
            }
        });
    }

    handleFailure(reason) {
        console.log(`Level failed: ${reason}`);
        const remainingLives = this.state.loseLife();

        if (remainingLives > 0) {
            this.ui.showRetryModal(() => {
                this.loadCurrentLevel(true);
            });
        } else {
            this.ui.showGameOverModal(() => {
                this.initGame();
            });
        }
    }
}