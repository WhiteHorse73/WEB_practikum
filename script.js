// Практичні роботи №6–10 — Основи JavaScript, маніпуляція DOM, обробка подій і форми,
// клієнт для API, клієнтський фреймворк
// Варіант 4: Каталог настільних ігор
//
// Практикум 10: обрано Vue 3, бо його глобальна збірка з CDN працює без Babel і JSX,
// шаблони пишуться прямо в наявному index.html, а зміни стану відстежуються автоматично
// без ручного виклику функції рендеру.

// Ендпоінт практикуму 9: JSONPlaceholder, задачі користувача 1
// (мок: title - назва гри, completed - «вже зіграно»)
const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

console.log('script.js підключено');

// Підписи жанрів (ключі - значення option у формах і поле genre у грі)
const genreLabels = {
    coop: 'Кооперативні',
    rpg: 'Рольові (RPG)',
    strategy: 'Стратегії',
    party: 'Вечіркові'
};

// Кількість гравців для виводу в консоль (практикум 6)
const playersCount = 5;

// ---------- Чисті допоміжні функції (практикуми 6-9) ----------
// Не читають і не змінюють стан: результат залежить лише від аргументів

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

// Стрілкова функція: назви в JSONPlaceholder - з малої літери, на картці - з великої
const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

// Стрілкова функція: зіставляє задачу JSONPlaceholder з об'єктом гри
// (title - назва гри, completed - «вже зіграно»)
const todoToGame = todo => ({
    id: todo.id,
    title: capitalize(todo.title),
    played: todo.completed
});

// Порожні поля форми додавання (genre за замовчуванням - перший пункт select)
const emptyNewGame = () => ({ title: '', minPlayers: '', maxPlayers: '', genre: 'coop' });

// Функцію renderGames з практикумів 7-9 (createElement, append, innerHTML = '') видалено:
// картки тепер описує компонент GameCard, а Vue сам оновлює DOM, коли змінюється стан.
// Так само прибрано querySelector для списку, фільтрів, форми й секції API.

// ---------- Практикум 10: компоненти Vue ----------

// Компонент картки гри. Отримує все через props і не звертається до стану застосунку.
// Клік по жанру надсилає батьківському компоненту подію filter(genre)
const GameCard = {
    props: {
        title: { type: String, required: true },
        minPlayers: { type: Number, required: true },
        maxPlayers: { type: Number, required: true },
        genre: { type: String, required: true },
        genreLabel: { type: String, required: true },
        image: { type: String, default: '' },
        description: { type: String, default: '' },
        fits: { type: Boolean, default: false },
        genreActive: { type: Boolean, default: false }
    },
    emits: ['filter'],
    computed: {
        // Похідні значення перераховуються самі, коли змінюються props
        playersText() {
            return formatPlayers({ minPlayers: this.minPlayers, maxPlayers: this.maxPlayers });
        },
        genreHint() {
            return this.genreActive
                ? 'Показати ігри всіх жанрів'
                : `Показати лише жанр «${this.genreLabel}»`;
        }
    },
    template: `
        <article class="game-card" :class="{ fits }"
                 :data-players="minPlayers + '-' + maxPlayers" :data-genre="genre">
            <img v-if="image" class="card-img" :src="image" :alt="'Обкладинка настільної гри ' + title">
            <div v-else class="card-img card-img-placeholder" :class="{ 'long-title': title.length > 30 }"
                 aria-hidden="true">{{ title }}</div>
            <div class="card-content">
                <div class="card-badges">
                    <p class="player-badge">{{ playersText }}</p>
                    <button type="button" class="genre-badge" :aria-pressed="String(genreActive)"
                            :title="genreHint" @click="$emit('filter', genre)">{{ genreLabel }}</button>
                </div>
                <h3>{{ title }}</h3>
                <p v-if="description">{{ description }}</p>
            </div>
        </article>`
};

// Компонент картки гри з API (практикум 9): назва і позначка «зіграно»
const PlayedGameCard = {
    props: {
        title: { type: String, required: true },
        played: { type: Boolean, required: true }
    },
    template: `
        <article class="game-card" :class="{ played }" :data-played="String(played)">
            <div class="card-img card-img-placeholder" :class="{ 'long-title': title.length > 30 }"
                 aria-hidden="true">{{ title }}</div>
            <div class="card-content">
                <div class="card-badges">
                    <p class="played-badge">{{ played ? '✓ Зіграно' : 'Ще не зіграно' }}</p>
                </div>
                <h3>{{ title }}</h3>
            </div>
        </article>`
};

// Кореневий компонент: увесь реактивний стан сторінки, обробники подій і запит до API
const app = Vue.createApp({
    components: { GameCard, PlayedGameCard },

    data() {
        return {
            // Дані варіанта - масив ігор каталогу (практикум 6) у реактивному стані
            games: [
                {
                    id: 1, title: 'Cyberpunk 2077', minPlayers: 1, maxPlayers: 4, genre: 'rpg',
                    image: 'assets/img/cyberpunk.jpg',
                    description: 'Настільна адаптація з фокусом на спеціалізовані білди, зброю та тактичні бої у Найт-Сіті.'
                },
                {
                    id: 2, title: 'Stardew Valley', minPlayers: 1, maxPlayers: 4, genre: 'coop',
                    image: 'assets/img/stardew.jpg',
                    description: 'Кооперативна гра про спільний розвиток ферми, риболовлю та дослідження шахт.'
                },
                {
                    id: 3, title: 'Catan', minPlayers: 3, maxPlayers: 4, genre: 'strategy',
                    image: 'assets/img/catan.jpg',
                    description: 'Класична стратегія, де гравці збирають ресурси для розбудови власних поселень на острові.'
                },
                {
                    id: 4, title: 'Gloomhaven', minPlayers: 1, maxPlayers: 4, genre: 'rpg',
                    image: 'assets/img/gloomhaven.jpg',
                    description: 'Масштабна тактична рольова гра з глибокими підземеллями у похмурому фентезійному світі.'
                },
                {
                    id: 5, title: 'Codenames', minPlayers: 2, maxPlayers: 8, genre: 'party',
                    description: 'Командна гра на асоціації: капітан одним словом підказує, які агенти належать його команді.'
                },
                {
                    id: 6, title: 'Terraforming Mars', minPlayers: 1, maxPlayers: 5, genre: 'strategy',
                    description: 'Корпорації змагаються, перетворюючи Марс на планету, придатну для життя.'
                },
                {
                    id: 7, title: 'Dixit', minPlayers: 3, maxPlayers: 6, genre: 'party',
                    description: 'Гра на уяву: гравці загадують сюрреалістичні картинки та відгадують чужі асоціації.'
                },
                {
                    id: 8, title: '7 Wonders Duel', minPlayers: 2, maxPlayers: 2, genre: 'strategy',
                    description: 'Дуель двох цивілізацій: розвиток науки, армії та будівництво семи чудес світу.'
                },
                {
                    id: 9, title: 'Avalon', minPlayers: 5, maxPlayers: 10, genre: 'party',
                    description: 'Гра на соціальну дедукцію: лицарі Артура шукають зрадників серед своїх.'
                }
            ],
            nextId: 10,
            genreLabels,

            // Фільтри (значення select - рядки, '' - фільтр не задано)
            playersFilter: '',
            genreFilter: '',

            // Форма додавання гри (практикум 8)
            newGame: emptyNewGame(),
            formError: '',
            formStatus: '',

            // Ігри з API (практикум 9)
            apiGames: [],
            apiLoading: false,
            apiStatus: '',
            apiError: ''
        };
    },

    computed: {
        // Кількість гравців з фільтра числом або null
        targetPlayers() {
            return this.playersFilter === '' ? null : Number(this.playersFilter);
        },
        // Похідний масив: лише ігри, що проходять обидва фільтри
        filteredGames() {
            return this.games.filter(game => this.matchesFilters(game));
        },
        // Текст підсумку над списком (логіка updateGamesCount з практикуму 8)
        gamesCountText() {
            const shown = this.filteredGames.length;
            let text = `Ігор у списку: ${shown}`;
            if (shown < this.games.length) {
                text += ` із ${this.games.length}`;
            }
            if (this.genreFilter !== '') {
                text += `, жанр «${genreLabels[this.genreFilter]}»`;
            }
            if (this.targetPlayers !== null) {
                text += ` (для ${this.targetPlayers} ${this.targetPlayers === 1 ? 'гравця' : 'гравців'})`;
            }
            if (shown === 0) {
                text += '. Спробуйте змінити фільтри';
            }
            return text;
        },
        apiPlayedCount() {
            return this.apiGames.filter(game => game.played).length;
        }
    },

    methods: {
        // Чисті функції, доступні в шаблоні
        fitsPlayers,
        playersWord,

        matchesFilters(game) {
            return (this.targetPlayers === null || fitsPlayers(game, this.targetPlayers)) &&
                (this.genreFilter === '' || game.genre === this.genreFilter);
        },

        // Обробник події filter від GameCard: показує лише ігри цього жанру,
        // повторний клік по тому самому жанру знімає фільтр. Select жанру
        // пов'язаний із genreFilter через v-model, тож оновлюється сам
        filterByGenre(genre) {
            this.genreFilter = this.genreFilter === genre ? '' : genre;
        },

        // Перевірка варіанта практикуму 8: мінімум гравців не може перевищувати максимум
        getRangeError() {
            const min = Number(this.newGame.minPlayers);
            const max = Number(this.newGame.maxPlayers);
            return min > max
                ? `Мінімум гравців (${min}) не може бути більшим за максимум (${max})`
                : '';
        },

        // Подія input на формі: прибирає повідомлення про успіх і знімає помилку,
        // щойно користувач виправив діапазон
        onFormInput() {
            this.formStatus = '';
            if (this.formError !== '') {
                this.formError = this.getRangeError();
            }
        },

        // Подія submit форми (@submit.prevent скасовує перезавантаження сторінки).
        // Браузер викликає її лише після вбудованої перевірки required, pattern, min, max
        addGame() {
            const rangeError = this.getRangeError();
            if (rangeError !== '') {
                this.formError = rangeError;
                console.warn(`Помилка валідації: ${rangeError}`);
                this.$refs.minInput.focus();
                return;
            }

            const game = {
                id: this.nextId++,
                title: this.newGame.title,
                minPlayers: Number(this.newGame.minPlayers),
                maxPlayers: Number(this.newGame.maxPlayers),
                genre: this.newGame.genre,
                description: ''
            };
            // Vue відстежує push у реактивний масив і сам додає картку в список
            this.games.push(game);
            console.log(`Додано гру: ${game.title} (${formatPlayers(game)}). Усього ігор: ${this.games.length}`);

            let status = `Гру «${game.title}» додано до каталогу.`;
            if (!this.matchesFilters(game)) {
                this.playersFilter = '';
                this.genreFilter = '';
                status += ' Фільтри скинуто, щоб її було видно.';
            }
            this.newGame = emptyNewGame();
            this.formError = '';
            this.formStatus = status;

            // Після оновлення DOM повідомлення притискається до низу вікна:
            // видно і його, і щойно додану картку над ним
            this.$nextTick(() => this.$refs.formStatus.scrollIntoView({ block: 'end' }));
        },

        // Завантажує список ігор з JSONPlaceholder (https://jsonplaceholder.typicode.com/,
        // ендпоінт /todos?userId=1) через Fetch API (практикум 9). Результат записується
        // в стан apiGames, а картки малює компонент PlayedGameCard.
        // Перевірка 404 з консолі: vm.loadData('https://jsonplaceholder.typicode.com/todoz')
        async loadData(url = API_URL) {
            this.apiLoading = true;
            this.apiStatus = 'Завантаження…';
            this.apiError = '';
            try {
                const response = await fetch(url);
                // fetch не вважає 404/500 помилкою, тому статус перевіряємо вручну
                if (!response.ok) {
                    throw new Error(`Сервер відповів кодом ${response.status} (${url})`);
                }
                const data = await response.json();
                console.log('Відповідь API:', data);
                if (!Array.isArray(data)) {
                    throw new Error('Очікувався масив задач, отримано інший формат JSON');
                }

                this.apiGames = data.map(todoToGame);
                this.apiStatus = this.apiGames.length === 0
                    ? 'Сервер повернув порожній список.'
                    : `Оновлено о ${new Date().toLocaleTimeString('uk-UA')}.`;
            } catch (error) {
                // Попередні дані прибираємо, щоб не видавати їх за актуальні
                this.apiGames = [];
                this.apiStatus = '';
                this.apiError = error instanceof TypeError
                    ? 'Не вдалося завантажити список ігор: немає з\'єднання з сервером. ' +
                      'Перевірте підключення до інтернету й натисніть «Оновити».'
                    : 'Сервер не віддав список ігор. Спробуйте оновити пізніше.';
                console.error('Помилка завантаження ігор з API:', error);
            } finally {
                this.apiLoading = false;
            }
        }
    },

    // Перше завантаження даних з API, щойно застосунок змонтовано
    mounted() {
        this.loadData();
    }
});

// Монтуємо застосунок у main#app; vm - кореневий компонент (доступний і з консолі)
const vm = app.mount('#app');

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

// Масив ігор тепер живе в стані застосунку: читаємо його через vm.games
const games = vm.games;

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
