const flagsContainer = document.getElementById('flags-container');
const countryNameElement = document.getElementById('country-name');
const scoreElement = document.getElementById('score');
const attemptsElement = document.getElementById('attempts');
const highScoreElement = document.getElementById('high-score');
const resetButton = document.getElementById('reset-button');

let score = 0;
let attempts = 5;
let correctCountry = '';
let countries = [];

// 🚩 Cargar el récord guardado en localStorage
const loadHighScore = () => {
    const highScore = localStorage.getItem('highScore') || 0;
    highScoreElement.textContent = highScore;
};

// 🚩 Guardar el nuevo récord en localStorage
const saveHighScore = () => {
    const highScore = Math.max(score, localStorage.getItem('highScore') || 0);
    localStorage.setItem('highScore', highScore);
    highScoreElement.textContent = highScore;
};

// 🚩 Reiniciar el juego
const resetGame = () => {
    score = 0;
    attempts = 5;
    scoreElement.textContent = score;
    attemptsElement.textContent = attempts;
    resetButton.classList.add('hidden');
    loadHighScore();
    fetchFlags();
};

// 🚩 Obtener banderas de la API
const fetchFlags = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        loadNewQuestion();
    } catch (error) {
        console.error('Error al cargar las banderas:', error);
    }
};

// 🚩 Cargar una nueva pregunta
const loadNewQuestion = () => {
    if (attempts <= 0) {
        saveHighScore();
        resetButton.classList.remove('hidden');
        countryNameElement.textContent = '¡Juego Terminado!';
        return;
    }

    const options = [];
    while (options.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry) && randomCountry.flags) {
            options.push(randomCountry);
        }
    }

    const correctOption = options[Math.floor(Math.random() * options.length)];
    correctCountry = correctOption.name.common;
    countryNameElement.textContent = `¿Cuál es la bandera de ${correctCountry}?`;

    flagsContainer.innerHTML = '';
    options.forEach(country => {
        const flagElement = document.createElement('div');
        flagElement.className = 'flag';
        flagElement.innerHTML = `<img src="${country.flags.png}" alt="${country.name.common}">`;
        flagElement.addEventListener('click', () => selectFlag(country.name.common));
        flagsContainer.appendChild(flagElement);
    });
};

// 🚩 Comprobar la respuesta
const selectFlag = (selectedCountry) => {
    if (selectedCountry === correctCountry) {
        score++;
        scoreElement.textContent = score;
    } else {
        attempts--;
        attemptsElement.textContent = attempts;
    }
    loadNewQuestion();
};

// 🚩 Eventos
resetButton.addEventListener('click', resetGame);

// 🚩 Inicializar el juego
window.onload = () => {
    loadHighScore();
    fetchFlags();
};
