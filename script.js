// Практичні роботи №6–7 — Основи JavaScript, маніпуляція DOM
// Варіант 4: Каталог настільних ігор

console.log('script.js підключено');

// Прибираємо статичні картки-приклади з практикуму 2: вони лишаються в HTML
// як орієнтир структури, але тепер картки генеруються з масиву games
const staticCards = document.querySelectorAll('#games-list .game-card');
staticCards.forEach(card => card.remove());

// Дані варіанта: масив ігор каталогу з діапазоном кількості гравців,
// обкладинкою (якщо є) та коротким описом
const games = [
    {
        title: 'Cyberpunk 2077', minPlayers: 1, maxPlayers: 4,
        image: 'assets/img/cyberpunk.jpg',
        description: 'Настільна адаптація з фокусом на спеціалізовані білди, зброю та тактичні бої у Найт-Сіті.'
    },
    {
        title: 'Stardew Valley', minPlayers: 1, maxPlayers: 4,
        image: 'assets/img/stardew.jpg',
        description: 'Кооперативна гра про спільний розвиток ферми, риболовлю та дослідження шахт.'
    },
    {
        title: 'Catan', minPlayers: 3, maxPlayers: 4,
        image: 'assets/img/catan.jpg',
        description: 'Класична стратегія, де гравці збирають ресурси для розбудови власних поселень на острові.'
    },
    {
        title: 'Gloomhaven', minPlayers: 1, maxPlayers: 4,
        image: 'assets/img/gloomhaven.jpg',
        description: 'Масштабна тактична рольова гра з глибокими підземеллями у похмурому фентезійному світі.'
    },
    {
        title: 'Codenames', minPlayers: 2, maxPlayers: 8,
        description: 'Командна гра на асоціації: капітан одним словом підказує, які агенти належать його команді.'
    },
    {
        title: 'Terraforming Mars', minPlayers: 1, maxPlayers: 5,
        description: 'Корпорації змагаються, перетворюючи Марс на планету, придатну для життя.'
    },
    {
        title: 'Dixit', minPlayers: 3, maxPlayers: 6,
        description: 'Гра на уяву: гравці загадують сюрреалістичні картинки та відгадують чужі асоціації.'
    },
    {
        title: '7 Wonders Duel', minPlayers: 2, maxPlayers: 2,
        description: 'Дуель двох цивілізацій: розвиток науки, армії та будівництво семи чудес світу.'
    },
    {
        title: 'Avalon', minPlayers: 5, maxPlayers: 10,
        description: 'Гра на соціальну дедукцію: лицарі Артура шукають зрадників серед своїх.'
    }
];

// Контейнер списку ігор і підсумковий елемент на сторінці
const listContainer = document.querySelector('#games-list');
const gamesCount = document.querySelector('#games-count');

// Кількість гравців для позначки «підходить» (жорстко задана — форма з'явиться в практикумі 8)
const targetPlayers = 4;

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
// створює картку article (обкладинка, бейдж гравців, назва, опис), задає
// атрибут data-players, додає клас fits, якщо гра підходить для targetPlayers
// гравців, і вставляє картку в контейнер; наприкінці оновлює підсумок
function renderGames(gameList) {
    listContainer.innerHTML = '';

    gameList.forEach(game => {
        const card = document.createElement('article');
        card.classList.add('game-card');
        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
        if (fitsPlayers(game, targetPlayers)) {
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

        const players = document.createElement('p');
        players.classList.add('player-badge');
        players.textContent = formatPlayers(game);

        const title = document.createElement('h3');
        title.textContent = game.title;

        const description = document.createElement('p');
        description.textContent = game.description;

        content.append(players, title, description);
        card.append(cover, content);
        listContainer.append(card);
    });

    updateGamesCount(gameList);
}

// Оновлює текст наявного елемента p#games-count: кількість ігор у списку
// і скільки з них підходять для targetPlayers гравців
function updateGamesCount(gameList) {
    let fitsCount = 0;
    for (const game of gameList) {
        if (fitsPlayers(game, targetPlayers)) fitsCount++;
    }
    gamesCount.textContent = `Ігор у списку: ${gameList.length}. ` +
        `Підходять для ${targetPlayers} гравців: ${fitsCount}`;
}

renderGames(games);

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
