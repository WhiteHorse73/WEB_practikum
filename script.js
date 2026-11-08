// Практичні роботи №6–8 — Основи JavaScript, маніпуляція DOM, обробка подій і форми
// Варіант 4: Каталог настільних ігор

console.log('script.js підключено');

// Прибираємо статичні картки-приклади з практикуму 2: вони лишаються в HTML
// як орієнтир структури, але тепер картки генеруються з масиву games
const staticCards = document.querySelectorAll('#games-list .game-card');
staticCards.forEach(card => card.remove());

// Дані варіанта: масив ігор каталогу з діапазоном кількості гравців, жанром,
// обкладинкою (якщо є) та коротким описом
const games = [
    {
        title: 'Cyberpunk 2077', minPlayers: 1, maxPlayers: 4, genre: 'rpg',
        image: 'assets/img/cyberpunk.jpg',
        description: 'Настільна адаптація з фокусом на спеціалізовані білди, зброю та тактичні бої у Найт-Сіті.'
    },
    {
        title: 'Stardew Valley', minPlayers: 1, maxPlayers: 4, genre: 'coop',
        image: 'assets/img/stardew.jpg',
        description: 'Кооперативна гра про спільний розвиток ферми, риболовлю та дослідження шахт.'
    },
    {
        title: 'Catan', minPlayers: 3, maxPlayers: 4, genre: 'strategy',
        image: 'assets/img/catan.jpg',
        description: 'Класична стратегія, де гравці збирають ресурси для розбудови власних поселень на острові.'
    },
    {
        title: 'Gloomhaven', minPlayers: 1, maxPlayers: 4, genre: 'rpg',
        image: 'assets/img/gloomhaven.jpg',
        description: 'Масштабна тактична рольова гра з глибокими підземеллями у похмурому фентезійному світі.'
    },
    {
        title: 'Codenames', minPlayers: 2, maxPlayers: 8, genre: 'party',
        description: 'Командна гра на асоціації: капітан одним словом підказує, які агенти належать його команді.'
    },
    {
        title: 'Terraforming Mars', minPlayers: 1, maxPlayers: 5, genre: 'strategy',
        description: 'Корпорації змагаються, перетворюючи Марс на планету, придатну для життя.'
    },
    {
        title: 'Dixit', minPlayers: 3, maxPlayers: 6, genre: 'party',
        description: 'Гра на уяву: гравці загадують сюрреалістичні картинки та відгадують чужі асоціації.'
    },
    {
        title: '7 Wonders Duel', minPlayers: 2, maxPlayers: 2, genre: 'strategy',
        description: 'Дуель двох цивілізацій: розвиток науки, армії та будівництво семи чудес світу.'
    },
    {
        title: 'Avalon', minPlayers: 5, maxPlayers: 10, genre: 'party',
        description: 'Гра на соціальну дедукцію: лицарі Артура шукають зрадників серед своїх.'
    }
];

// Підписи жанрів для бейджа на картці (ключі - значення option у формах)
const genreLabels = {
    coop: 'Кооперативні',
    rpg: 'Рольові (RPG)',
    strategy: 'Стратегії',
    party: 'Вечіркові'
};

// Контейнер списку ігор і підсумковий елемент на сторінці
const listContainer = document.querySelector('#games-list');
const gamesCount = document.querySelector('#games-count');

// Кількість гравців, обрана у фільтрі (null - фільтр не задано).
// Значення встановлює обробник change у функції applyFilters
let targetPlayers = null;

// Кількість гравців для виводу в консоль (практикум 6)
const playersCount = 5;

// Стрілкова функція: перевіряє, чи гра підходить для n гравців
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

// Стрілкова функція: повертає правильну форму слова для числа n (1 гравець, 4 гравці, 5 гравців)
const playersWord = n => {
    const lastTwo = n % 100;
    const last = n % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'гравців';
    if (last === 1) return 'гравець';
    if (last >= 2 && last <= 4) return 'гравці';
    return 'гравців';
};

// Стрілкова функція: повертає діапазон гравців рядком, напр. «1–4 гравці» або «2 гравці»
const formatPlayers = game => game.minPlayers === game.maxPlayers
    ? `${game.maxPlayers} ${playersWord(game.maxPlayers)}`
    : `${game.minPlayers}–${game.maxPlayers} ${playersWord(game.maxPlayers)}`;

// Рендер списку ігор: очищає контейнер #games-list і для кожної гри масиву
// створює картку article (обкладинка, бейджі гравців і жанру, назва, опис), задає
// атрибути data-players і data-genre, додає клас fits, якщо у фільтрі обрано
// кількість гравців і гра їй підходить, і вставляє картку в контейнер;
// наприкінці оновлює підсумок
function renderGames(gameList) {
    listContainer.innerHTML = '';

    gameList.forEach(game => {
        const card = document.createElement('article');
        card.classList.add('game-card');
        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
        card.dataset.genre = game.genre;
        if (targetPlayers !== null && fitsPlayers(game, targetPlayers)) {
            card.classList.add('fits');
        }

        // Обкладинка: зображення, якщо воно є, інакше кольорова заглушка з назвою
        let cover;
        if (game.image) {
            cover = document.createElement('img');
            cover.src = game.image;
            cover.alt = `Обкладинка настільної гри ${game.title}`;
        } else {
            cover = document.createElement('div');
            cover.classList.add('card-img-placeholder');
            cover.setAttribute('aria-hidden', 'true');
            cover.textContent = game.title;
        }
        cover.classList.add('card-img');

        const content = document.createElement('div');
        content.classList.add('card-content');

        const badges = document.createElement('div');
        badges.classList.add('card-badges');

        const players = document.createElement('p');
        players.classList.add('player-badge');
        players.textContent = formatPlayers(game);

        const genre = document.createElement('p');
        genre.classList.add('genre-badge');
        genre.textContent = genreLabels[game.genre];

        badges.append(players, genre);

        const title = document.createElement('h3');
        title.textContent = game.title;

        content.append(badges, title);

        // У форми додавання немає поля опису, тому в нової гри він порожній
        if (game.description) {
            const description = document.createElement('p');
            description.textContent = game.description;
            content.append(description);
        }

        card.append(cover, content);
        listContainer.append(card);
    });

    updateGamesCount(gameList);
}

// Оновлює текст наявного елемента p#games-count: скільки ігор показано,
// скільки їх усього в каталозі і для якої кількості гравців задано фільтр
function updateGamesCount(gameList) {
    let text = `Ігор у списку: ${gameList.length}`;
    if (gameList.length < games.length) {
        text += ` із ${games.length}`;
    }
    if (targetPlayers !== null) {
        text += ` (для ${targetPlayers} ${targetPlayers === 1 ? 'гравця' : 'гравців'})`;
    }
    if (gameList.length === 0) {
        text += '. Спробуйте змінити фільтри';
    }
    gamesCount.textContent = text;
}

// ---------- Практикум 8: обробка подій, форма, валідація ----------

// Елементи форми фільтрів
const filtersForm = document.querySelector('#filters-form');
const playersFilter = document.querySelector('#player-count');
const genreFilter = document.querySelector('#genre-select');

// Елементи форми додавання гри
const addForm = document.querySelector('#add-game-form');
const titleInput = document.querySelector('#new-title');
const minPlayersInput = document.querySelector('#new-min-players');
const maxPlayersInput = document.querySelector('#new-max-players');
const genreInput = document.querySelector('#new-genre');
const formError = document.querySelector('#form-error');
const formStatus = document.querySelector('#form-status');

// Стрілкова функція: перевіряє, чи гра відповідає поточним значенням фільтрів
const matchesFilters = game =>
    (targetPlayers === null || fitsPlayers(game, targetPlayers)) &&
    (genreFilter.value === '' || game.genre === genreFilter.value);

// Зчитує select кількості гравців (value - рядок, тому Number) і рендерить
// лише ті ігри, що проходять фільтри
function applyFilters() {
    targetPlayers = playersFilter.value === '' ? null : Number(playersFilter.value);
    renderGames(games.filter(matchesFilters));
}

// Показує текст помилки під полями форми або ховає елемент, якщо текст порожній
function showFormError(message) {
    formError.textContent = message;
    formError.hidden = message === '';
    const isInvalid = String(message !== '');
    minPlayersInput.setAttribute('aria-invalid', isInvalid);
    maxPlayersInput.setAttribute('aria-invalid', isInvalid);
}

// Перевірка варіанта: мінімум гравців не може перевищувати максимум.
// Повертає текст помилки або порожній рядок, якщо діапазон коректний
function getRangeError() {
    const min = Number(minPlayersInput.value);
    const max = Number(maxPlayersInput.value);
    return min > max
        ? `Мінімум гравців (${min}) не може бути більшим за максимум (${max})`
        : '';
}

// Подія change на select «кількість гравців»: перефільтровує список через fitsPlayers.
// Так само реагує select жанру - обидва фільтри діють разом
playersFilter.addEventListener('change', applyFilters);
genreFilter.addEventListener('change', applyFilters);

// Подія input на всій формі (спливає від кожного поля): прибирає повідомлення
// про успіх і знімає текст помилки, щойно користувач виправив діапазон
addForm.addEventListener('input', () => {
    formStatus.textContent = '';
    if (!formError.hidden) {
        showFormError(getRangeError());
    }
});

// Подія submit форми додавання. Браузер викликає її лише тоді, коли пройдено
// вбудовану перевірку (required, pattern, min, max), тож порожні поля сюди не доходять
addForm.addEventListener('submit', event => {
    // Без цього стандартна поведінка form перезавантажить сторінку й скине масив games
    event.preventDefault();

    // Додаткова перевірка перед push: при помилці форму не очищаємо, щоб можна було виправити
    const rangeError = getRangeError();
    if (rangeError !== '') {
        showFormError(rangeError);
        console.warn(`Помилка валідації: ${rangeError}`);
        minPlayersInput.focus();
        return;
    }

    // Новий об'єкт має ту саму форму, що й елементи масиву games
    const newGame = {
        title: titleInput.value.trim(),
        minPlayers: Number(minPlayersInput.value),
        maxPlayers: Number(maxPlayersInput.value),
        genre: genreInput.value,
        description: ''
    };
    games.push(newGame);
    console.log(`Додано гру: ${newGame.title} (${formatPlayers(newGame)}). Усього ігор: ${games.length}`);

    // Нова гра має одразу з'явитися на сторінці, тому заважаючі фільтри скидаємо
    let status = `Гру «${newGame.title}» додано до каталогу.`;
    if (!matchesFilters(newGame)) {
        filtersForm.reset();
        status += ' Фільтри скинуто, щоб її було видно.';
    }

    applyFilters();
    addForm.reset();
    formStatus.textContent = status;

    // Повідомлення стоїть над полями форми, а нова картка - над ним: якщо притиснути
    // повідомлення до низу вікна, на екрані видно і його, і щойно додану картку
    formStatus.scrollIntoView({ block: 'end' });
});

// Перший рендер сторінки
applyFilters();

// ---------- Практикум 6: вивід у консоль ----------

// Виводить у консоль увесь каталог і підсумкову інформацію:
// кількість ігор та середню максимальну кількість гравців
function printCatalogSummary(gameList) {
    let maxPlayersSum = 0;

    console.log('--- Каталог ігор ---');
    for (let i = 0; i < gameList.length; i++) {
        const game = gameList[i];
        console.log(`${i + 1}. ${game.title} (${formatPlayers(game)})`);
        maxPlayersSum += game.maxPlayers;
    }

    const averageMax = maxPlayersSum / gameList.length;
    console.log(`Усього ігор у каталозі: ${gameList.length}`);
    console.log(`Середня максимальна кількість гравців: ${averageMax.toFixed(1)}`);
}

// Виводить ігри, що підходять для n гравців; для кожної гри
// умовою if перевіряє, чи n входить у її діапазон, і повертає кількість знайдених
function printGamesForPlayers(gameList, n) {
    let foundCount = 0;

    console.log(`--- Ігри для ${n} гравців ---`);
    for (const game of gameList) {
        if (n >= game.minPlayers && n <= game.maxPlayers) {
            console.log(`✔ ${game.title} — підходить (${formatPlayers(game)})`);
            foundCount++;
        } else if (n < game.minPlayers) {
            console.log(`✘ ${game.title} — замало гравців (потрібно від ${game.minPlayers})`);
        } else {
            console.log(`✘ ${game.title} — забагато гравців (максимум ${game.maxPlayers})`);
        }
    }

    const summary = foundCount > 0
        ? `Знайдено ігор: ${foundCount}`
        : 'Немає ігор для такої кількості гравців';
    console.log(summary);
    return foundCount;
}

printCatalogSummary(games);
printGamesForPlayers(games, playersCount);

// Перевірка стрілкової функції fitsPlayers на реальних даних
console.log('--- Перевірка fitsPlayers ---');
console.log(`Catan для 2 гравців: ${fitsPlayers(games[2], 2)}`);
console.log(`Catan для 4 гравців: ${fitsPlayers(games[2], 4)}`);
games.forEach(game => {
    console.log(`${game.title} для ${playersCount} гравців: ${fitsPlayers(game, playersCount)}`);
});

// Типи даних, які використано в скрипті
console.log('--- Типи даних ---');
console.log(`typeof games[0].title: ${typeof games[0].title}`);
console.log(`typeof playersCount: ${typeof playersCount}`);
console.log(`typeof fitsPlayers(games[0], 2): ${typeof fitsPlayers(games[0], 2)}`);
console.log(`typeof fitsPlayers: ${typeof fitsPlayers}`);
