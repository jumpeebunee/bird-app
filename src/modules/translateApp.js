import translations from "../data/translations";

function translateApp(appLanguage) {
    const nav = document.querySelectorAll('.header__pagination_button');
    const gallery = document.querySelector('.bird-gallery');
    const language = document.querySelector('.change-langue');
    const score = document.querySelector('.header__score-points');
    const descrptionTop = document.querySelector('.main__controls-description-top');
    const descrptionBottom = document.querySelector('.main__controls-description-bottom');
    const levelButton = document.querySelector('.main__btn');
    const congratulate = document.querySelector('.main-winner__heading');
    
    if (appLanguage === 'ru') {
        nav.forEach((item, index) => {
            item.innerHTML = translations.ru.list[index];
        });

        gallery.textContent = translations.ru.options[0];
        language.textContent = translations.ru.options[1];
        score.textContent = translations.ru.options[2];

        descrptionTop.textContent = translations.ru.description[0];
        descrptionBottom.textContent = translations.ru.description[1];

        levelButton.textContent = translations.ru.buttons[0];
        congratulate.textContent = translations.ru.finishGame[0];
    } else {
        nav.forEach((item, index) => {
            item.innerHTML = translations.en.list[index];
        });

        gallery.textContent = translations.en.options[0];
        language.textContent = translations.en.options[1];
        score.textContent = translations.en.options[2];

        descrptionTop.textContent = translations.en.description[0];
        descrptionBottom.textContent = translations.en.description[1];
        
        levelButton.textContent = translations.en.buttons[0];
        congratulate.textContent = translations.en.finishGame[0];
    };
};

export default translateApp;