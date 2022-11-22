import "./styles/normolize.css";
import "./styles/style.scss";
import logo from "./assets/logo.svg";
import bird from "./assets/bird.jpg";
import birds from "./data/birds.js";
import birdsEn from "./data/birdsEn.js";
import getRandomNumber from "./modules/getRandomNumber.js";
import getTimeCode from "./modules/getTimeCode.js";
import success from "./audio/success.ogg";
import error from "./audio/error.ogg";
import translations from "./data/translations";
import translateApp from "./modules/translateApp";

function init() {    
    const successAudio = new Audio(success);
    const errorAudio = new Audio(error); 

    let appLanguage = (localStorage.getItem('language')) ? localStorage.getItem('language') : 'en';

    let levelFinished = false;

    let currentStage = 0;
    let totalScore = 0;
    let levelScore = 5;

    let generatedBird = null;
    let totalBirds = null;

    let mainAudio = null;
    let cardAudio = null;

    function createStartImages() {
        document.querySelector('.header__logo').src = logo;
        document.querySelector('.main__sound-img').src = bird;
    };

    function createStartButtons() {
        const modal = document.querySelector('.modal');
        const gallery = document.querySelector('.bird-gallery');
        const language = document.querySelector('.change-langue');

        const play = document.querySelector('.main__sound-play');
        const time = document.querySelector('.main__player-content-time_current');
        const progress = document.querySelector('.main__player-progress');

        const mainVolume = document.querySelector('.main__player-range');
        const cardVolume = document.querySelector('.current__player-range');

        mainVolume.addEventListener("input", (e) => {
            mainAudio.volume = e.target.value;  
        });

        cardVolume.addEventListener('input', (e) => {
            cardAudio.volume = e.target.value;
        });

        gallery.addEventListener('click', () => {
            modal.classList.toggle('modal_active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target.className === 'modal modal_active') modal.classList.remove('modal_active');
        });

        language.addEventListener('click', () => changeLanguage());

        play.addEventListener('click', () => generateItemPlay(mainAudio, play, time, progress));
    };

    function generateBird() {
        if (appLanguage === 'ru') {
            totalBirds = birds[currentStage];
            generatedBird = birds[currentStage][getRandomNumber(0,5)];
        } else {
            totalBirds = birdsEn[currentStage];
            generatedBird = birdsEn[currentStage][getRandomNumber(0,5)];
        }

        document.querySelector('.main__player-content-time_total').textContent = (appLanguage === 'ru') ? 'Загрузка...' : 'Loading...';
        document.querySelector('.generate-bird__play').disabled = true;

        mainAudio = new Audio(generatedBird.audio);
        mainAudio.volume = 0.7;
        mainAudio.addEventListener('loadeddata', () => {
            const time = getTimeCode(mainAudio.duration);
            document.querySelector('.main__player-content-time_total').textContent = `${time.minutes}:${time.seconds}`;
            createTimeline(document.querySelector('.main__player-timeline'), mainAudio);
            document.querySelector('.generate-bird__play').disabled = false;
        });
    };

    function createGallery() {
        const list = document.querySelector('.modal-content');

        let totalBirds = [];

        if (appLanguage === 'ru') {
            birds.map(item => totalBirds.push(...item));
        } else {
            birdsEn.map(item => totalBirds.push(...item));
        }

        totalBirds.forEach((bird, index) => {
            createGalleryItem(list, bird, index);
        });
    };

    function createGalleryItem(list, bird, index) {
        const audio = new Audio(bird.audio);

        audio.addEventListener('loadeddata', () => {
            const generatedAudioTime = getTimeCode(audio.duration);
            totalTime.textContent = `${generatedAudioTime.minutes}:${generatedAudioTime.seconds}`;
        });

        audio.volume = 0.7;

        const item = document.createElement('li');

        const content = document.createElement('div');
        const contentDescription = document.createElement('div');
        const heading = document.createElement('h2');
        const species = document.createElement('h3');

        const description = document.createElement('p');
        const image = document.createElement('img');

        const player = document.createElement('div');
        const playerBtn = document.createElement('button');
        const playerContent = document.createElement('div');
        const timeline = document.createElement('div');
        const progress = document.createElement('div');
        const circle = document.createElement('div');

        const contentTime = document.createElement('div');
        const currentTime = document.createElement('div');
        const totalTime = document.createElement('div');

        const range = document.createElement('input');
        range.classList.add('main__player-range')
        range.min = '0';
        range.max = '1';
        range.step = '0.1';
        range.type = 'range';

        range.addEventListener('input', (e) => audio.volume = +e.target.value)

        circle.classList.add('main__player-progress-circle');
        progress.classList.add('main__player-progress');
        timeline.classList.add('main__player-timeline');
        playerContent.classList.add('main__player-content');
        player.classList.add('main__sound-player');
        playerBtn.classList.add('main__sound-play');

        contentTime.classList.add('main__player-content-time');
        currentTime.classList.add('main__player-content-time_current');
        totalTime.classList.add('main__player-content-time_total');
        contentDescription.classList.add('main__player-content')
        
        currentTime.textContent = '00:00';
        totalTime.textContent = '00:00';

        contentTime.append(currentTime, totalTime);

        progress.append(circle);
        timeline.append(progress);
        playerContent.append(timeline, contentTime);
        player.append(playerBtn, playerContent, range);
        playerBtn.addEventListener('click', () => generateItemPlay(audio, playerBtn, currentTime, progress));
        createTimeline(timeline, audio)

        item.classList.add('gallery__item');
        content.classList.add('gallery__item-content');

        heading.textContent = bird.name;
        species.textContent = bird.species;
        image.src = bird.image; 
        description.textContent = bird.description;

        contentDescription.append(heading, species, player);
        content.append(image, contentDescription);
        item.append(content, description);
        list.append(item);
    };

    function generateItemPlay(audio, button, time, progress) {
        if (audio.paused) {
            audio.play();
            button.classList.add('main__sound-play_pause');
            const t = setInterval(() => {
                if (audio.paused) {
                    audio.pause();
                    button.classList.remove('main__sound-play_pause');
                    clearInterval(t);
                };
                const currentTimes = getTimeCode(audio.currentTime);
                progress.style.width = audio.currentTime / audio.duration * 100 + 1 + '%';
                time.textContent = `${currentTimes.minutes}:${currentTimes.seconds}`;
            });
        } else {
            audio.pause();
            button.classList.remove('main__sound-play_pause');
        };
    };

    function changeLanguage() {
        appLanguage = (appLanguage === 'ru') ? 'en' : 'ru';
        localStorage.setItem('language', appLanguage);
        window.location.reload();
    };

    function createTimeline(timeline, audio) {
        timeline.addEventListener('click', (e) => {
            if (audio.paused) return;
            const timelineWidth = window.getComputedStyle(timeline).width;
            const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
            audio.currentTime = timeToSeek;
        });
    };

    function clearTimeline() {
        document.querySelector('.main__player-progress').style.width = '20%';
        document.querySelector('.about-bird__progress').style.width = '20%';
    };

    function createListOfAnswers() {
        const list = document.querySelector('.main__controls-list');
        list.innerHTML = '';

        totalBirds.map(item => {
            list.append(createItemAnswer(item));
        });
    };

    function createItemAnswer(bird) {
        const item = document.createElement('li');
        const button = document.createElement('button');

        button.textContent = bird.name;
        button.addEventListener('click', (e) => checkIsTrue(e));

        item.append(button);
        
        return item;
    };

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
            errorAudio.play();
            levelScore -= 1;
        };

        createBirdCard(target);
    };

    function createBirdCard(item) {
        if (cardAudio) cardAudio.pause();

        const bird = findBird(item.textContent);
        generateBirdCardContent(bird);

        document.querySelector('.main__controls-block-content_about').classList.add('main__controls-block-content_about_active');
        document.querySelector('.main__controls-block-content').classList.remove('main__controls-block-content_active');

        document.querySelector('.about-bird__play').disabled = true;
        document.querySelector('.card-bird__time').textContent = (appLanguage === 'ru') ? 'Загрузка...' : 'Loading...';

        cardAudio = new Audio(bird.audio);
        cardAudio.addEventListener('loadeddata', () => {
            const time = getTimeCode(cardAudio.duration);
            document.querySelector('.about-total').textContent = `${time.minutes}:${time.seconds}`;
            document.querySelector('.about-bird__play').disabled = false;
        });

        const button = document.querySelector('.about-bird__play');

        button.addEventListener('click', play);

        function play() {
            generateItemPlay(cardAudio, button, document.querySelector('.about-total'), document.querySelector('.about-bird__progress'));
        };

        const timeline = document.querySelector('.about-bird__timeline');
        createTimeline(timeline, cardAudio);
    };

    function generateBirdCardContent(bird) {
        const button = document.createElement('button');
        const wrapper = document.querySelector('.main__sound-wrapper');

        button.classList.add('main__sound-play','about-bird__play');

        wrapper.innerHTML = '';
        wrapper.append(button);

        document.querySelector('.block-content_about__img').src = bird.image;
        document.querySelector('.block-content_about__bird-heading').textContent = bird.name;
        document.querySelector('.block-content_about__bird-description').textContent = bird.species;    
        document.querySelector('.main__controls-block-content_description').textContent = bird.description;
    };

    function findBird(bird) {
        return totalBirds.find((item) => item.name === bird);
    };

    function birdFinded() {
        successAudio.play();
        mainAudio.pause();
        cardAudio.pause();

        const heading = document.querySelector('.main__sound-content-title');
        const image = document.querySelector('.main__sound-img');

        totalScore += levelScore;
        levelScore = 5;
        levelFinished = true;

        document.querySelector('.header__score-points').textContent = `${(appLanguage === 'ru' ? translations.ru.options[2] : translations.en.options[2])} ${totalScore}`;

        heading.textContent = generatedBird.name;
        image.src = generatedBird.image;

        changeStage();
    };

    function changeStage() {
       const btn = document.querySelector('.main__btn');
       btn.classList.add('btn-active')
       btn.disabled = false;
       btn.addEventListener('click', nextStage);
    };

    function nextStage() {

        currentStage += 1;

        mainAudio.pause();
        cardAudio.pause();
        clearTimeline();

        if (currentStage === 6) {
            finishGame();
        } else {
            clearStage();
            levelFinished = false;
    
            generateBird();
            changeStageTab();
            createListOfAnswers();
            document.querySelector('.main__btn').disabled = true;
            document.querySelector('.main__btn').classList.remove('btn-active');
        };
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

    function finishGame() {

        const btnReload = document.querySelector('.btn-reload');

        const finishTextStart = (appLanguage === 'ru') ? translations.ru.finishGame[1] : translations.en.finishGame[1];
        const finishTextEnd = (appLanguage === 'ru') ? translations.ru.finishGame[2] : translations.en.finishGame[2];
        const finishTextMax = (appLanguage === 'ru') ? translations.ru.finishGame[3] : translations.en.finishGame[3];

        if (totalScore === 30) {
            document.querySelector('.main-winner__description').textContent = finishTextMax;
        } else {
            document.querySelector('.main-winner__description').textContent = `${finishTextStart} ${totalScore} ${finishTextEnd}`;
        };
    
        totalScore = 0;
        levelScore = 5;
        currentStage = -1;

        document.querySelector('.main-game').classList.remove('main-game_active');
        document.querySelector('.main-winner').classList.add('main-winner_active');

        btnReload.addEventListener('click', newGame);
    };

    function newGame() {
        document.querySelector('.main-game').classList.add('main-game_active');
        document.querySelector('.main-winner').classList.remove('main-winner_active');
        document.querySelector('.header__score-points').textContent = 0;
        nextStage();
    }; 

    createStartImages();
    createStartButtons();
    translateApp(appLanguage);
    generateBird();
    createGallery();
    createListOfAnswers();

    document.querySelector('.loader_description').textContent = (appLanguage === 'ru') ? 'Загрузка приложения...' : 'App is loading...';
    document.querySelector('.header__score-points').textContent = `${(appLanguage === 'ru' ? translations.ru.options[2] : translations.en.options[2])} ${totalScore}`;

    window.onload = function() {
        document.querySelector('.loading').classList.remove('loading_active');
        document.querySelector('.loader').classList.remove('loader_active');
    };
};


document.addEventListener('DOMContentLoaded', init);

