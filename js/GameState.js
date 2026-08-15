export class GameState {
    constructor() {
        this.isFirstLoad = true;
        this.resetGame();
    }

    resetGame() {
        this.score = 0;
        this.currentLevelIndex = 0;
        this.lives = 5;
        this.maxLives = 5;
        this.lastGeneratedBoard = null;
        this.resetLevelState();
    }

    resetLevelState() {
        this.bonesFound = 0;
        this.totalBones = 0;
        this.brushCount = 0;
        this.gridRows = 0;
        this.gridCols = 0;
        this.board = [];
        this.revealed = [];
    }

    loadLevelConfig(levelConfig, isRetry = false) {
        this.gridRows = levelConfig.grid.rows;
        this.gridCols = levelConfig.grid.cols;
        this.totalBones = levelConfig.bonesCount;
        this.brushCount = levelConfig.maxShovels;
        this.bonesFound = 0;

        const totalCells = this.gridRows * this.gridCols;
        this.revealed = new Array(totalCells).fill(false);

        if (isRetry && this.lastGeneratedBoard && this.lastGeneratedBoard.length === totalCells) {
            this.board = [...this.lastGeneratedBoard];
        } else {
            // 0 representa areia/vazio
            this.board = new Array(totalCells).fill(0);
            
            // Distribuição randômica atribuindo cada osso específico da fase
            let placedBones = 0;
            while (placedBones < this.totalBones) {
                const randomIndex = Math.floor(Math.random() * totalCells);
                if (this.board[randomIndex] === 0) {
                    const boneAsset = (levelConfig.boneImages && levelConfig.boneImages[placedBones]) 
                        ? levelConfig.boneImages[placedBones] 
                        : 'assets/images/bone.svg';
                    this.board[randomIndex] = boneAsset;
                    placedBones++;
                }
            }
            this.lastGeneratedBoard = [...this.board];
        }
    }

    nextLevel() {
        this.currentLevelIndex++;
        this.lastGeneratedBoard = null; 
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
        }
        return this.lives;
    }

    isGameOver() {
        return this.lives <= 0;
    }

    hasNextLevel(totalLevels) {
        return this.currentLevelIndex < totalLevels;
    }

    dig(index) {
        if (this.revealed[index] || this.brushCount <= 0) {
            return { valid: false };
        }

        this.revealed[index] = true;
        this.brushCount--;

        const foundBone = this.board[index] !== 0;

        if (foundBone) {
            this.bonesFound++;
        }

        if (this.bonesFound === this.totalBones) {
            return { valid: true, status: 'WIN' };
        }

        if (this.brushCount <= 0) {
            return { valid: true, status: 'LOSE' };
        }

        return { valid: true, status: 'CONTINUE' };
    }
}