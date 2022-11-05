import "./styles/normolize.css";
import "./styles/style.scss";
import logo from "./assets/logo.svg";
import bird from "./assets/bird.jpg";
import birds from "./data/birds.js";
import getRandomNumber from "./modules/getRandomNumber.js";
import getTimeCode from "./modules/getTimeCode.js";

function init() {

    let levelFinished = false;

    let totalScore = 0;
    let levelScore = 5;

    let currentStage = 0;
    let generatedBird = null;
    let totalBirds = null;

    let generateBirdAudio = null;
    let cardBirdAudio = null;

    let t = null;

    document.querySelector('.header__logo').src = logo;
    document.querySelector('.main__sound-img').src = bird;

    const generateBirdBtn = document.querySelector('.main__sound-play');
    const generateBirdTime = document.querySelector('.main__player-content-time_current');
    const generateBirdProgress = document.querySelector('.main__player-progress');

    function generateBird() {
        generatedBird = birds[currentStage][getRandomNumber(0,5)];
        
        generateBirdAudio = new Audio(generatedBird.audio);
        generateBirdAudio.addEventListener('loadeddata', () => {
            const generatedAudioTime = getTimeCode(generateBirdAudio.duration);
            document.querySelector('.main__player-content-time_total').textContent = `${generatedAudioTime.minutes}:${generatedAudioTime.seconds}`;
        });

        totalBirds = birds[currentStage];
    };
    
    //* MusicPlayer

    function renderPlayer() {
        generateBirdBtn.addEventListener('click', () => generatePlay(generateBirdTime, generateBirdProgress));
        generateTimeline();
        createListOfAnswers();
    };

    function generatePlay(time, progress) {
        if (generateBirdAudio.paused) {
            generateBirdAudio.play();
            generateBirdBtn.classList.add('main__sound-play_pause');
            t = setInterval(() => {
                if (generateBirdAudio.paused) {
                    generateBirdAudio.pause();
                    generateBirdBtn.classList.remove('main__sound-play_pause');
                    clearInterval(t);
                };
                const currentTimes = getTimeCode(generateBirdAudio.currentTime);
                progress.style.width = generateBirdAudio.currentTime / generateBirdAudio.duration * 100 + 1 + '%';
                time.textContent = `${currentTimes.minutes}:${currentTimes.seconds}`;
            }, 200);
        } else {
            generateBirdAudio.pause();
            generateBirdBtn.classList.remove('main__sound-play_pause');
            clearInterval(t);
        };
    };

    function cardAudio() {
        const btn = document.querySelector('.about-bird__play');
        const time = document.querySelector('.about-bird__current');
        const progress = document.querySelector('.about-bird__progress');

        if (cardBirdAudio.paused) {
            cardBirdAudio.play();
            btn.classList.add('main__sound-play_pause');
            t = setInterval(() => {
                if (cardBirdAudio.paused)  {
                    cardBirdAudio.pause();
                    btn.classList.remove('main__sound-play_pause');
                    clearInterval(t);
                };
                const currentTimes = getTimeCode(cardBirdAudio.currentTime);
                progress.style.width = cardBirdAudio.currentTime / cardBirdAudio.duration * 100 + 1 + '%';
                time.textContent = `${currentTimes.minutes}:${currentTimes.seconds}`;
            }, 200);
        } else {
            cardBirdAudio.pause();
            btn.classList.remove('main__sound-play_pause');
            clearInterval(t);
        };
    };

    function cardTimeline(audio) {
        const timeline = document.querySelector('.about-bird__timeline');
        timeline.addEventListener('click', (e) => {
            if (audio.paused) return;
            const timelineWidth = window.getComputedStyle(timeline).width;
            const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
            audio.currentTime = timeToSeek;
        });
    };

    function generateTimeline() {
        const timeline = document.querySelector('.main__player-timeline');
        timeline.addEventListener('click', (e) => {
            if (generateBirdAudio.paused) return;
            const timelineWidth = window.getComputedStyle(timeline).width;
            const timeToSeek = e.offsetX / parseInt(timelineWidth) * generateBirdAudio.duration;
            generateBirdAudio.currentTime = timeToSeek;
        });
    };

    function updateTimeline() {
        document.querySelector('.main__player-progress').style.width = '20%';
        document.querySelector('.about-bird__progress').style.width = '20%';
    };

    //* GenereateListOfButtons

    function createListOfAnswers() {
        const list = document.querySelector('.main__controls-list');
        list.innerHTML = '';

        totalBirds.map(item => {
            list.append(createItemAnswer(item));
        });
    };

    function createItemAnswer(item) {
        const listItem = document.createElement('li');
        const listBtn = document.createElement('button');

        listBtn.textContent = item.name;
        listBtn.addEventListener('click', (e) => checkIsTrue(e));

        listItem.append(listBtn);
        
        return listItem;
    };

    //* CheckAnswerTrueOrFalse

    function checkIsTrue(e) {
        const target = e.target;

        if (e.target.className === 'controls-list__btn_false' || levelFinished) {
            createBirdCard(target);
            return;
        };

        if (target.textContent === generatedBird.name) {
            target.classList.add('controls-list__btn_true');
            birdFinded();
        } else {
            target.classList.add('controls-list__btn_false');
            levelScore -= 1;
        };

        createBirdCard(target);
    };
    
    //* BirdCard

    function createBirdCard(item) {
        if (cardBirdAudio) cardBirdAudio.pause();

        document.querySelector('.main__controls-block-content_about').classList.add('main__controls-block-content_about_active');
        document.querySelector('.main__controls-block-content').classList.remove('main__controls-block-content_active');

        const bird = findBird(item.textContent);
        generateBirdCardContent(bird);

        cardBirdAudio = new Audio(bird.audio);
        cardBirdAudio.addEventListener('loadeddata', () => {
            const cardBirdAudioTime = getTimeCode(cardBirdAudio.duration);
            document.querySelector('.about-total').textContent = `${cardBirdAudioTime.minutes}:${cardBirdAudioTime.seconds}`;
        });

        const cardAudioBtn = document.querySelector('.about-bird__play');
        cardAudioBtn.addEventListener('click', cardAudio);
        cardTimeline(cardBirdAudio);
    };

    function generateBirdCardContent(bird) {
        document.querySelector('.block-content_about__img').src = bird.image;
        document.querySelector('.block-content_about__bird-heading').textContent = bird.name;
        document.querySelector('.block-content_about__bird-description').textContent = bird.species;    
        document.querySelector('.main__controls-block-content_description').textContent = bird.description;
    };

    function findBird(bird) {
        return totalBirds.find((item) => item.name === bird);
    };

    //* FindedBird

    function birdFinded() {
        const heading = document.querySelector('.main__sound-content-title');
        const image = document.querySelector('.main__sound-img');

        totalScore += levelScore;
        levelScore = 5;
        levelFinished = true;

        document.querySelector('.header__score-points').textContent = totalScore;

        heading.textContent = generatedBird.name;
        image.src = generatedBird.image;

        changeStage();
    };

    function changeStage() {
       const btn = document.querySelector('.main__btn');
       btn.disabled = false;
       btn.addEventListener('click', nextStage);
    };

    function nextStage() {
        currentStage += 1;

        generateBirdAudio.pause();
        cardBirdAudio.pause();

        updateTimeline();
        clearStage();

        levelFinished = false;

        generateBird();
        changeStageTab();
        createListOfAnswers();
        document.querySelector('.main__btn').disabled = true;
    };

    function changeStageTab() {
        const tabs = document.querySelectorAll('.header__pagination_button');
        tabs.forEach(item => item.classList.remove('header__pagination-button_active'));
        tabs[currentStage].classList.add('header__pagination-button_active');
    };

    function clearStage() {
        document.querySelector('.main__sound-content-title').textContent = '******';
        document.querySelector('.main__sound-img').src = bird;
        document.querySelector('.main__controls-block-content_about').classList.remove('main__controls-block-content_about_active');
        document.querySelector('.main__controls-block-content').classList.add('main__controls-block-content_active');
    };
    
    generateBird();
    renderPlayer();
};

document.addEventListener("DOMContentLoaded", () => init());