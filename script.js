// Практична робота №6 — Основи JavaScript
// Варіант 4: Каталог настільних ігор

console.log('script.js підключено');

// Дані варіанта: масив ігор каталогу з діапазоном кількості гравців
const games = [
    { title: 'Cyberpunk 2077', minPlayers: 1, maxPlayers: 4 },
    { title: 'Stardew Valley', minPlayers: 1, maxPlayers: 4 },
    { title: 'Catan', minPlayers: 3, maxPlayers: 4 },
    { title: 'Gloomhaven', minPlayers: 1, maxPlayers: 4 },
    { title: 'Codenames', minPlayers: 2, maxPlayers: 8 },
    { title: 'Terraforming Mars', minPlayers: 1, maxPlayers: 5 },
    { title: 'Dixit', minPlayers: 3, maxPlayers: 6 }
];

// Кількість гравців, для якої шукаємо ігри
const playersCount = 5;

// Стрілкова функція: перевіряє, чи гра підходить для n гравців
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

// Стрілкова функція: повертає діапазон гравців рядком, напр. «від 1 до 4 гравців»
const formatPlayers = game => `від ${game.minPlayers} до ${game.maxPlayers} гравців`;

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
