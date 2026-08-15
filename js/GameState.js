export class GameState {
    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.score = 0;
        this.currentLevelIndex = 0;
        this.lives = 5;
        this.lastGeneratedBoard = null; // Guarda o tabuleiro da tentativa atual
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

    // Recebe um parâmetro booleano isRetry para saber se reaproveita o mapa
    loadLevelConfig(levelConfig, isRetry = false) {
        this.gridRows = levelConfig.grid.rows;
        this.gridCols = levelConfig.grid.cols;
        this.totalBones = levelConfig.bonesCount;
        this.brushCount = levelConfig.maxShovels;
        this.bonesFound = 0;

        const totalCells = this.gridRows * this.gridCols;
        this.revealed = new Array(totalCells).fill(false);

        // Se for um Retry e já existir um tabuleiro salvo para esta fase, reutilizamos!
        if (isRetry && this.lastGeneratedBoard && this.lastGeneratedBoard.length === totalCells) {
            this.board = [...this.lastGeneratedBoard];
        } else {
            // Caso contrário, gera um novo mapa aleatório e guarda como referência para um possível retry
            this.board = new Array(totalCells).fill(0);
            let placedBones = 0;
            while (placedBones < this.totalBones) {
                const randomIndex = Math.floor(Math.random() * totalCells);
                if (this.board[randomIndex] === 0) {
                    this.board[randomIndex] = 1; // 1 representa osso
                    placedBones++;
                }
            }
            this.lastGeneratedBoard = [...this.board];
        }
    }

    // Se avançar de fase com sucesso, limpamos o cache do tabuleiro anterior para gerar novos aleatórios na próxima fase
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

        const foundBone = this.board[index] === 1;

        if (foundBone) {
            this.bonesFound++;
        }

        // Vitória: achou o último osso que faltava, independente de sobrar pincelada
        if (this.bonesFound === this.totalBones) {
            return { valid: true, status: 'WIN' };
        }

        // Derrota: acabaram as pinceladas e ainda faltam ossos — seja porque
        // a última pincelada foi usada num osso (mas não o último) ou num vazio.
        if (this.brushCount <= 0 && this.bonesFound < this.totalBones) {
            return { valid: true, status: 'LOSE' };
        }

        return { valid: true, status: foundBone ? 'HIT' : 'MISS' };
    }
}