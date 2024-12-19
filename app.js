'use strict';
// @charset "UTF-8";
let tg = window.Telegram.WebApp;
tg.expand();

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Исходный массив вопросов
const originalQuestions = [
    {
        question: "Что такое Bitcoin?",
        answers: [
            "Первая децентрализованная криптовалюта",
            "Акции технологической компании",
            "Платёжная система Visa",
            "Банковская карта"
        ],
        correct: 0
    },
    {
        question: "Кто создал Bitcoin?",
        answers: [
            "Илон Маск",
            "Сатоши Накамото",
            "Виталик Бутерин",
            "Марк Цукерберг"
        ],
        correct: 1
    },
    {
        question: "Что такое блокчейн?",
        answers: [
            "Социальная сеть",
            "Игровая платформа",
            "Распределённый реестр данных",
            "Поисковая система"
        ],
        correct: 2
    },
    {
        question: "Что такое майнинг?",
        answers: [
            "Процесс добычи золота",
            "Процесс создания новых блоков в блокчейне",
            "Покупка криптовалюты",
            "Продажа криптовалюты"
        ],
        correct: 1
    },
    {
        question: "Что такое смарт-контракт?",
        answers: [
            "Бумажный договор",
            "Программа на блокчейне",
            "Кредитный договор",
            "Страховой полис"
        ],
        correct: 1
    },
    {
        question: "На какой платформе работает большинство DeFi проектов?",
        answers: [
            "Bitcoin",
            "Ethereum",
            "Visa",
            "PayPal"
        ],
        correct: 1
    },
    {
        question: "Что такое NFT?",
        answers: [
            "Невзаимозаменяемый токен",
            "Новый вид криптовалюты",
            "Платёжная система",
            "Тип банковской карты"
        ],
        correct: 0
    },
    {
        question: "Что такое халвинг Bitcoin?",
        answers: [
            "Удвоение цены",
            "Раздел монет пополам",
            "Уменьшение награды за майнинг вдвое",
            "Деление блокчейна"
        ],
        correct: 2
    },
    {
        question: "Что такое private key?",
        answers: [
            "Публичный адрес кошелька",
            "Секретный ключ для доступа к кошельку",
            "Пароль от биржи",
            "Имя пользователя"
        ],
        correct: 1
    },
    {
        question: "Что такое Market Cap в криптовалютах?",
        answers: [
            "Максимальная цена монеты",
            "Минимальная цена монеты",
            "Рыночная капитализация",
            "Объём торгов"
        ],
        correct: 2
    }
];

// Создаем копию вопросов и перемешиваем их
let questions = [];

function initQuiz() {
    questions = shuffleArray([...originalQuestions]);
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = '0';
    showQuestion();
}

let currentQuestion = 0;
let score = 0;

// Добавим переменные для таймера
let timerInterval;
const QUESTION_TIME = 20; // время в секундах

function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectForAnswer(index);
        answersContainer.appendChild(button);
    });

    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.onclick = null;

    updateProgress();
    startTimer(); // Запускаем таймер
}

let selectedAnswerIndex = null;

function selectForAnswer(index) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(button => button.classList.remove('selected'));
    buttons[index].classList.add('selected');
    
    selectedAnswerIndex = index;
    document.getElementById('submit-button').disabled = false;
    
    document.getElementById('submit-button').onclick = () => submitAnswer();
}

function submitAnswer() {
    if (selectedAnswerIndex === null) return;
    
    // Останавливаем таймер
    clearInterval(timerInterval);
    
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(button => button.disabled = true);
    document.getElementById('submit-button').disabled = true;
    
    if (selectedAnswerIndex === question.correct) {
        buttons[selectedAnswerIndex].classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
    } else {
        buttons[selectedAnswerIndex].classList.add('wrong');
        buttons[question.correct].classList.add('correct');
        showErrorPopup();
    }

    setTimeout(() => {
        currentQuestion++;
        selectedAnswerIndex = null;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showErrorPopup() {
    const popup = document.getElementById('error-popup');
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 2000);
}

function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function showResults() {
    document.getElementById('question-container').classList.add('hidden');
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hidden');
    
    const resultScore = resultContainer.querySelector('.result-score');
    const resultText = `Ваш результат: ${score} из ${questions.length}`;
    resultScore.textContent = resultText;
    
    document.getElementById('restart-button').onclick = restartQuiz;
}

function restartQuiz() {
    clearInterval(timerInterval); // Очищаем таймер при перезапуске
    questions = shuffleArray([...originalQuestions]);
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    showQuestion();
}

// Инициализация квиза
initQuiz();

// Обработчик кнопки "Начать заново"
document.getElementById('restart-quiz-btn').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите начать заново? Текущий прогресс будет потерян.')) {
        restartQuiz();
    }
});

// Функция обновления курсов криптовалют
async function updateCryptoPrices() {
    const pairs = {
        'BTCUSDT': '.btc-price',
        'LTCUSDT': '.ltc-price',
        'DOGEUSDT': '.doge-price'
    };

    for (const [pair, selector] of Object.entries(pairs)) {
        try {
            const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const price = parseFloat(data.lastPrice);
            
            const priceElement = document.querySelector(selector);
            const widgetElement = priceElement.closest('.price-widget');
            
            widgetElement.classList.add('updating');
            
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: pair === 'DOGEUSDT' ? 4 : 2,
                maximumFractionDigits: pair === 'DOGEUSDT' ? 4 : 2
            }).format(price);
            
            priceElement.textContent = formattedPrice;
            
            setTimeout(() => {
                widgetElement.classList.remove('updating');
            }, 300);
            
        } catch (error) {
            console.error(`Ошибка при получении курса ${pair}:`, error);
            document.querySelector(selector).textContent = 'Loading...';
        }
    }
}

// Запускаем обновление курсов
updateCryptoPrices();
const cryptoInterval = setInterval(updateCryptoPrices, 5000);

// Очищаем интервал при уходе со страницы
window.addEventListener('beforeunload', () => {
    clearInterval(cryptoInterval);
});

// Добавим функции для работы с таймером
function startTimer() {
    let timeLeft = QUESTION_TIME;
    const timerText = document.getElementById('timer-text');
    const timerProgress = document.getElementById('timer-progress');
    
    // Сбрасываем стили
    timerProgress.style.width = '100%';
    timerProgress.classList.remove('warning');
    
    // Очищаем предыдущий интервал если есть
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerText.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        // Обновляем прогресс
        const percentage = (timeLeft / QUESTION_TIME) * 100;
        timerProgress.style.width = `${percentage}%`;
        
        // Добавляем красный цвет когда осталось мало времени
        if (timeLeft <= 5) {
            timerProgress.classList.add('warning');
        }
        
        // Время вышло
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

// Функция для обработки окончания времени
function timeOut() {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(button => button.disabled = true);
    
    const question = questions[currentQuestion];
    buttons[question.correct].classList.add('correct');
    
    showErrorPopup();
    
    setTimeout(() => {
        currentQuestion++;
        selectedAnswerIndex = null;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Добавим обработчик для кнопки старта
document.getElementById('start-quiz-btn').addEventListener('click', () => {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    initQuiz(); // Запускаем квиз
});

// Уберем автоматический запуск квиза при загрузке страницы
// initQuiz(); // Закомментируем или удалим эту строку
