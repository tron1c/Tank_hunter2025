const gameState = {
    currentScreen: 'home',
    lives: 3,
    timeLeft: 60,
    timer: null,
    currentWave: 0,
    currentEnemy: 0,
    score: 0
};

const elements = {
    // Audio elements
    gameMusic: document.getElementById('game-music'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    muteBtn: document.getElementById('mute-btn'),
    
    // Game elements
    screens: {
        home: document.getElementById('home-screen'),
        instructions: document.getElementById('instructions'),
        story: document.getElementById('story'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over')
    },
    messageBoxes: {
        game: document.getElementById('game-message-box'),
        gameOver: document.getElementById('game-over-message-box')
    },
    hintElement: document.getElementById('hint'),
    coordinateInput: document.getElementById('coordinate-input'),
    timerElement: document.getElementById('timer'),
    livesElement: document.getElementById('lives'),
    scoreElement: document.getElementById('score'),
    enemiesRemaining: document.getElementById('enemies-remaining'),
    gameOverTitle: document.getElementById('game-over-title'),
    revealBtn: document.getElementById('reveal-btn'),
    revealedAnswer: document.getElementById('revealed-answer'),
    finalScore: document.getElementById('final-score'),
    victoryScreen: document.getElementById('victory-screen'),
    victoryScore: document.getElementById('victory-score'),
    victoryRestartBtn: document.getElementById('victory-restart-btn')
};

function showScreen(screen) {
    Object.values(elements.screens).forEach(s => s.style.display = 'none');
    elements.victoryScreen.style.display = 'none';
    
    if (screen === 'game-over' || screen === 'victory-screen') {
        elements[screen].style.display = 'block';
    } else {
        elements.screens[screen].style.display = 'block';
    }
    gameState.currentScreen = screen;
}

function addMessage(message, className = '') {
    const p = document.createElement('p');
    p.textContent = message;
    if (className) p.className = className;
    elements.messageBoxes.game.appendChild(p);
    elements.messageBoxes.game.scrollTop = elements.messageBoxes.game.scrollHeight;
}

function updateLivesDisplay() {
    elements.livesElement.textContent = 'LIVES: ' + '❤'.repeat(gameState.lives);
}

function updateTimerDisplay() {
    elements.timerElement.textContent = `TIME: ${gameState.timeLeft}s`;
    if (gameState.timeLeft <= 10) {
        elements.timerElement.classList.add('timer-warning');
    } else {
        elements.timerElement.classList.remove('timer-warning');
    }
}

function updateScoreDisplay() {
    elements.scoreElement.textContent = `SCORE: ${gameState.score}`;
}

function togglePlayPause() {
    if (elements.gameMusic.paused) {
        elements.gameMusic.play();
        elements.playPauseBtn.textContent = '❚❚';
    } else {
        elements.gameMusic.pause();
        elements.playPauseBtn.textContent = '▶';
    }
}

function toggleMute() {
    elements.gameMusic.muted = !elements.gameMusic.muted;
    elements.muteBtn.textContent = elements.gameMusic.muted ? '🔇' : '🔊';
}

function startGame() {
    showScreen('game');
    gameState.lives = gameData.settings.initialLives;
    gameState.currentWave = 0;
    gameState.score = 0;
    updateScoreDisplay();
    startWave();
}

function startWave() {
    gameState.currentEnemy = 0;
    gameState.timeLeft = gameData.settings.timePerWave;
    elements.revealedAnswer.textContent = '';
    
    const wave = gameData.waves[gameState.currentWave];
    addMessage(wave.message);
    addMessage("Decode the 4-digit code before time runs out!");
    
    showNextEnemy();
    startTimer();
}

function showNextEnemy() {
    const wave = gameData.waves[gameState.currentWave];
    
    if (gameState.currentEnemy >= wave.enemies) {
        if (gameState.currentWave < gameData.waves.length - 1) {
            gameState.currentWave++;
            addMessage("Wave cleared! Next wave incoming...");
            setTimeout(startWave, 2000);
        } else {
            winGame();
        }
        return;
    }
    
    const hint = wave.hints[gameState.currentEnemy];
    addMessage(`ENEMY TRANSMISSION: ${hint.encrypted}`);
    elements.hintElement.textContent = `HINT: ${hint.hint}`;
    elements.enemiesRemaining.textContent = `Enemies left: ${wave.enemies - gameState.currentEnemy}`;
    elements.coordinateInput.value = '';
    elements.coordinateInput.focus();
}

function checkAnswer() {
    const wave = gameData.waves[gameState.currentWave];
    const hint = wave.hints[gameState.currentEnemy];
    const answer = parseInt(elements.coordinateInput.value);
    
    if (isNaN(answer)) {
        addMessage("ERROR: Please enter a valid number", 'error');
        return;
    }
    
    if (answer === hint.answer) {
        gameState.score += hint.points;
        updateScoreDisplay();
        addMessage(`HIT! Code ${answer} confirmed. +${hint.points} points`, 'success');
        gameState.currentEnemy++;
        elements.coordinateInput.value = '';
        showNextEnemy();
    } else {
        addMessage(`MISS! ${answer} is incorrect.`, 'error');
        gameState.timeLeft = Math.max(5, gameState.timeLeft - gameData.settings.timePenalty);
        updateTimerDisplay();
    }
}

function revealAnswer() {
    const wave = gameData.waves[gameState.currentWave];
    const hint = wave.hints[gameState.currentEnemy];
    elements.revealedAnswer.textContent = `ANSWER: ${hint.answer}`;
    gameState.timeLeft = Math.max(5, gameState.timeLeft - gameData.settings.revealPenalty);
    updateTimerDisplay();
    addMessage("Used reveal answer (-5 seconds)", 'warning');
}

function startTimer() {
    clearInterval(gameState.timer);
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    clearInterval(gameState.timer);
    gameState.lives--;
    updateLivesDisplay();
    
    addMessage("TIME'S UP! Enemy located your position!", 'error');
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        setTimeout(startWave, 2000);
    }
}

function gameOver() {
    showScreen('game-over');
    elements.gameOverTitle.textContent = "MISSION FAILED";
    elements.finalScore.textContent = `Final Score: ${gameState.score}`;
}

function winGame() {
    showScreen('victory-screen');
    elements.victoryScore.textContent = `Final Score: ${gameState.score}`;
}

function restartGame() {
    clearInterval(gameState.timer);
    
    Object.assign(gameState, {
        currentScreen: 'home',
        lives: gameData.settings.initialLives,
        timeLeft: gameData.settings.timePerWave,
        currentWave: 0,
        currentEnemy: 0,
        score: 0
    });
    
    elements.messageBoxes.game.innerHTML = '';
    elements.messageBoxes.gameOver.innerHTML = '';
    elements.hintElement.textContent = '';
    elements.revealedAnswer.textContent = '';
    elements.coordinateInput.value = '';
    
    updateLivesDisplay();
    updateTimerDisplay();
    updateScoreDisplay();
    showScreen('home');
}

function initGame() {
    // Initialize audio
    elements.gameMusic.volume = 0.5;
    elements.playPauseBtn.addEventListener('click', togglePlayPause);
    elements.muteBtn.addEventListener('click', toggleMute);
    
    // Game event listeners
    document.getElementById('start-btn').addEventListener('click', () => showScreen('instructions'));
    document.getElementById('instructions-continue').addEventListener('click', () => showScreen('story'));
    document.getElementById('story-continue').addEventListener('click', startGame);
    
    document.getElementById('submit-btn').addEventListener('click', checkAnswer);
    elements.coordinateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    
    document.getElementById('reveal-btn').addEventListener('click', revealAnswer);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('victory-restart-btn').addEventListener('click', restartGame);
    
    // Initialize displays
    updateLivesDisplay();
    updateTimerDisplay();
    updateScoreDisplay();
    showScreen('home');
}

document.addEventListener('DOMContentLoaded', initGame);