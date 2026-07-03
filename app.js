localStorage.clear();
const titleEl = document.getElementById('main-title');
        const grid = document.getElementById('sudoku-grid');
        const modeToggle = document.getElementById('mode-toggle');
        const modeText = document.getElementById('mode-text');
        const errorText = document.getElementById('error-text');
        const timerDisplay = document.getElementById('timer-display');
        const btnPause = document.getElementById('btn-pause');
        const pauseScreen = document.getElementById('pause-screen');
        const numPadArea = document.getElementById('num-pad-area');
        const btnReset = document.getElementById('btn-reset');
        const btnClear = document.getElementById('btn-clear');
        const btnUndo = document.getElementById('btn-undo');
        const saveArea = document.getElementById('save-area');
        const genArea = document.getElementById('gen-area');
        const clearScreen = document.getElementById('clear-screen');
        const finalTimeSpan = document.getElementById('final-time');
        const loadModal = document.getElementById('load-modal');
        const modalSaveList = document.getElementById('modal-save-list');
        const bestTimeList = document.getElementById('best-time-list');
        const btnMissToggle = document.getElementById('btn-miss-toggle');
        const missCounterEl = document.getElementById('miss-counter');
        const missCountSpan = document.getElementById('miss-count');
        const missMaxSpan = document.getElementById('miss-max');
        const bestTimeUpdateSpan = document.getElementById('best-time-update');
        const gameoverScreen = document.getElementById('gameover-screen');
        const gameoverTimeSpan = document.getElementById('gameover-time');
        const btnHint = document.getElementById('btn-hint');
        const hintCountSpan = document.getElementById('hint-count');
        const hintMaxSpan = document.getElementById('hint-max');
        const menuScreen = document.getElementById('menu-screen');
        const gameContainer = document.getElementById('game-container');
        const btnMenu = document.getElementById('btn-menu');
        const menuHighscores = document.getElementById('menu-highscores');
        const menuStats = document.getElementById('menu-stats');
        const menuMissMode = document.getElementById('menu-miss-mode');
        const settingsScreen = document.getElementById('settings-screen');
        
        let selectedCell = null;
        let isPlayMode = false;
        let isPaused = false;
        const cellsArray = [];

        // ===== ベストタイム記録・ミス制限モード =====
        const DIFFICULTY_LABELS = { easy: '初級', normal: '中級', hard: '上級', expert: '最高級' };
        const MISS_LIMIT = 3;
        const BEST_TIME_KEY = 'sudoku_best_times_v1';
        const MISS_MODE_KEY = 'sudoku_miss_mode_v1';
        const STATS_KEY = 'sudoku_stats_v1';

        let currentDifficulty = null; // 自動生成時のみセットされる（'easy'|'normal'|'hard'|'expert'）
        let missLimitMode = localStorage.getItem(MISS_MODE_KEY) === 'on';
        let missCount = 0;
        let currentPlayStartTime = 0; // クリア時間計算用

        // ===== テーマシステム =====
        const THEME_KEY = 'sudoku_theme_v1';
        const THEMES = {
            darkblue: {
                name: 'Dark Blue',
                colors: {
                    bg: '#1a1a2e',
                    panel: '#16213e',
                    text: '#ffffff',
                    textBright: '#ffff99',
                    textDim: '#cccccc',
                    dim: '#666666',
                    neon: '#00ff41',
                    cyan: '#00ffff',
                    amber: '#ffaa00',
                    red: '#ff0055',
                    cellBg: '#ffffff',
                    cellFixedBg: '#eeeeee',
                    cellFixedColor: '#000000',
                    cellUserColor: '#0055ff',
                    primary: '#3182ce',
                    accent: '#dd6b20',
                    success: '#38a169',
                    danger: '#e53e3e'
                }
            },
            foldercolor: {
                name: 'Folder Color',
                colors: {
                    bg: '#f5e6d3',
                    panel: '#ead5b8',
                    text: '#3d2817',
                    textBright: '#5a3a2a',
                    textDim: '#8b6f47',
                    dim: '#a89968',
                    neon: '#d4841f',
                    cyan: '#b8860b',
                    amber: '#cd8500',
                    red: '#c63a2d',
                    cellBg: '#fff9f0',
                    cellFixedBg: '#e8d5bc',
                    cellFixedColor: '#3d2817',
                    cellUserColor: '#b8860b',
                    primary: '#cd8500',
                    accent: '#d4841f',
                    success: '#b8860b',
                    danger: '#c63a2d'
                }
            },
            monochrome: {
                name: 'Monochrome',
                colors: {
                    bg: '#0a0a0a',
                    panel: '#0a0a0a',
                    text: '#ffffff',
                    textBright: '#ffffff',
                    textDim: '#888888',
                    dim: '#555555',
                    neon: '#ffffff',
                    cyan: '#888888',
                    amber: '#888888',
                    red: '#ffffff',
                    cellBg: '#d0d0d0',
                    cellFixedBg: '#b8b8b8',
                    cellFixedColor: '#000000',
                    cellUserColor: '#000000',
                    primary: '#888888',
                    accent: '#ffffff',
                    success: '#888888',
                    danger: '#ffffff'
                }
            },
            sakura: {
                name: 'Sakura Pink',
                colors: {
                    bg: '#fef5f7',
                    panel: '#fde8ed',
                    text: '#4a2d42',
                    textBright: '#6b4a62',
                    textDim: '#8b6a82',
                    dim: '#a88a9f',
                    neon: '#e565a6',
                    cyan: '#e67ba8',
                    amber: '#f4a0c8',
                    red: '#d85a7f',
                    cellBg: '#fffbfd',
                    cellFixedBg: '#f5e5ed',
                    cellFixedColor: '#4a2d42',
                    cellUserColor: '#e565a6',
                    primary: '#e565a6',
                    accent: '#f4a0c8',
                    success: '#d85a7f',
                    danger: '#c73368'
                }
            },
            matcha: {
                name: 'Matcha Green',
                colors: {
                    bg: '#f0f7f0',
                    panel: '#e3f0e3',
                    text: '#2d4a2d',
                    textBright: '#4a6a4a',
                    textDim: '#6b8a6b',
                    dim: '#8aaa8a',
                    neon: '#4caf50',
                    cyan: '#66bb6a',
                    amber: '#81c784',
                    red: '#d32f2f',
                    cellBg: '#fafbfa',
                    cellFixedBg: '#e8f3e8',
                    cellFixedColor: '#2d4a2d',
                    cellUserColor: '#4caf50',
                    primary: '#4caf50',
                    accent: '#66bb6a',
                    success: '#4caf50',
                    danger: '#d32f2f'
                }
            },
            lavender: {
                name: 'Lavender',
                colors: {
                    bg: '#f5f3f9',
                    panel: '#ede9f5',
                    text: '#3d2959',
                    textBright: '#5a4a7a',
                    textDim: '#7a6a9a',
                    dim: '#9a8aba',
                    neon: '#9b59b6',
                    cyan: '#b695d4',
                    amber: '#c9a8e4',
                    red: '#d4366d',
                    cellBg: '#fdfbfe',
                    cellFixedBg: '#ede9f5',
                    cellFixedColor: '#3d2959',
                    cellUserColor: '#9b59b6',
                    primary: '#9b59b6',
                    accent: '#b695d4',
                    success: '#7e57c2',
                    danger: '#d4366d'
                }
            },
            ocean: {
                name: 'Ocean Blue',
                colors: {
                    bg: '#ecf5fb',
                    panel: '#dce9f5',
                    text: '#1a3a52',
                    textBright: '#2a5a8a',
                    textDim: '#4a7aaa',
                    dim: '#6a9aca',
                    neon: '#0066cc',
                    cyan: '#0099ff',
                    amber: '#ff9900',
                    red: '#ff3333',
                    cellBg: '#f5fafd',
                    cellFixedBg: '#dce9f5',
                    cellFixedColor: '#1a3a52',
                    cellUserColor: '#0066cc',
                    primary: '#0066cc',
                    accent: '#0099ff',
                    success: '#00aa66',
                    danger: '#ff3333'
                }
            },
            sunset: {
                name: 'Sunset Orange',
                colors: {
                    bg: '#fff5f0',
                    panel: '#ffe8dc',
                    text: '#663300',
                    textBright: '#994d33',
                    textDim: '#cc7a4d',
                    dim: '#ff9966',
                    neon: '#ff6b35',
                    cyan: '#ff9344',
                    amber: '#ffa64d',
                    red: '#e53935',
                    cellBg: '#fffcf9',
                    cellFixedBg: '#ffe8dc',
                    cellFixedColor: '#663300',
                    cellUserColor: '#ff6b35',
                    primary: '#ff6b35',
                    accent: '#ffa64d',
                    success: '#ff9344',
                    danger: '#e53935'
                }
            }
        };

        function loadTheme() {
            const themeName = localStorage.getItem(THEME_KEY) || 'darkblue';
            const theme = THEMES[themeName];
            if (!theme) {
                localStorage.setItem(THEME_KEY, 'darkblue');
                return THEMES.darkblue;
            }
            return theme;
        }

        function applyTheme(themeName) {
            const theme = THEMES[themeName];
            if (!theme) return;
            
            const root = document.documentElement;
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
            });
            
            localStorage.setItem(THEME_KEY, themeName);
        }

        function renderThemeSelector() {
            const currentTheme = localStorage.getItem(THEME_KEY) || 'darkblue';
            
            // HTMLの設定画面のボタンを更新
            Object.keys(THEMES).forEach(key => {
                const btn = document.getElementById(`theme-${key}`);
                if (btn) {
                    btn.classList.toggle('active', key === currentTheme);
                }
            });
        }

        function setTheme(themeName) {
            applyTheme(themeName);
            renderThemeSelector();
        }

        function openSettings() {
            openSettingsMenu();
        }

        function openSettingsMenu() {
            if (menuScreen) menuScreen.style.display = 'none';
            if (settingsScreen) settingsScreen.style.display = 'flex';
            renderThemeSelector();
        }

        function closeSettingsMenu() {
            if (settingsScreen) settingsScreen.style.display = 'none';
        }

        function backToMenuFromSettings() {
            closeSettingsMenu();
            if (menuScreen) menuScreen.style.display = 'flex';
        }

        // ===== ゲーム統計機能 =====
        function loadStats() {
            try {
                return JSON.parse(localStorage.getItem(STATS_KEY)) || initializeStats();
            } catch (e) {
                return initializeStats();
            }
        }

        function initializeStats() {
            return {
                totalPlays: 0,
                totalCompletions: 0,
                totalPlayTimeSeconds: 0,
                difficultyStats: {
                    easy: { plays: 0, completions: 0, totalTimeSeconds: 0, totalHintUsed: 0, totalMissCount: 0 },
                    normal: { plays: 0, completions: 0, totalTimeSeconds: 0, totalHintUsed: 0, totalMissCount: 0 },
                    hard: { plays: 0, completions: 0, totalTimeSeconds: 0, totalHintUsed: 0, totalMissCount: 0 },
                    expert: { plays: 0, completions: 0, totalTimeSeconds: 0, totalHintUsed: 0, totalMissCount: 0 }
                }
            };
        }

        function saveStats(stats) {
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }

        function recordGamePlay(difficulty) {
            if (!difficulty) return;
            const stats = loadStats();
            stats.totalPlays++;
            stats.difficultyStats[difficulty].plays++;
            saveStats(stats);
        }

        function recordGameCompletion(difficulty, timeSeconds, hintsUsed, missCount) {
            if (!difficulty || hintUsedThisPuzzle) return; // ヒント使用時はカウント対象外
            const stats = loadStats();
            stats.totalCompletions++;
            stats.totalPlayTimeSeconds += timeSeconds;
            const dStats = stats.difficultyStats[difficulty];
            dStats.completions++;
            dStats.totalTimeSeconds += timeSeconds;
            dStats.totalHintUsed += hintsUsed;
            dStats.totalMissCount += missCount;
            saveStats(stats);
        }

        function getAverageTime(difficulty) {
            const stats = loadStats();
            const dStats = stats.difficultyStats[difficulty];
            if (dStats.completions === 0) return 0;
            return Math.round(dStats.totalTimeSeconds / dStats.completions);
        }

        function getHintUsageRate(difficulty) {
            const stats = loadStats();
            const dStats = stats.difficultyStats[difficulty];
            if (dStats.completions === 0) return 0;
            return Math.round((dStats.totalHintUsed / dStats.completions) * 100) / 100;
        }

        function renderMenuHighscores() {
            if (!menuHighscores) return;
            const bestTimes = loadBestTimes();
            menuHighscores.innerHTML = '';
            Object.keys(DIFFICULTY_LABELS).forEach(diff => {
                const key = diff;
                const val = bestTimes[key];
                const div = document.createElement('div');
                div.classList.add('menu-score-item');
                const label = document.createElement('span');
                label.classList.add('menu-score-label');
                label.innerText = DIFFICULTY_LABELS[diff];
                const value = document.createElement('span');
                value.classList.add('menu-score-value');
                value.innerText = (val !== undefined) ? formatTime(val) : '--:--';
                div.appendChild(label);
                div.appendChild(value);
                menuHighscores.appendChild(div);
            });
        }

        function renderMenuStats() {
            if (!menuStats) return;
            const stats = loadStats();
            menuStats.innerHTML = '';

            // 総合統計
            const clearRate = stats.totalPlays === 0 ? 0 : Math.round((stats.totalCompletions / stats.totalPlays) * 100);
            const totalHours = Math.floor(stats.totalPlayTimeSeconds / 3600);
            const totalMins = Math.floor((stats.totalPlayTimeSeconds % 3600) / 60);

            const rows = [
                { label: 'プレイ数', value: String(stats.totalPlays) },
                { label: 'クリア数', value: String(stats.totalCompletions) },
                { label: 'クリア率', value: `${clearRate}%` },
                { label: '総プレイ時間', value: `${totalHours}h ${totalMins}m` }
            ];

            rows.forEach(row => {
                const div = document.createElement('div');
                div.classList.add('menu-stat-row');
                const label = document.createElement('span');
                label.classList.add('menu-stat-label');
                label.innerText = row.label;
                const value = document.createElement('span');
                value.classList.add('menu-stat-value');
                value.innerText = row.value;
                div.appendChild(label);
                div.appendChild(value);
                menuStats.appendChild(div);
            });

            // 難易度別統計
            Object.keys(DIFFICULTY_LABELS).forEach(diff => {
                const dStats = stats.difficultyStats[diff];
                const dClearRate = dStats.plays === 0 ? 0 : Math.round((dStats.completions / dStats.plays) * 100);
                const avgTime = getAverageTime(diff);
                const hintRate = getHintUsageRate(diff);

                const statDiv = document.createElement('div');
                statDiv.style.borderTop = '1px solid var(--dim)';
                statDiv.style.marginTop = '8px';
                statDiv.style.paddingTop = '8px';

                const title = document.createElement('div');
                title.style.color = 'var(--amber)';
                title.style.fontSize = '0.65rem';
                title.style.marginBottom = '4px';
                title.innerText = DIFFICULTY_LABELS[diff];
                statDiv.appendChild(title);

                const dRows = [
                    { label: 'プレイ数', value: String(dStats.plays) },
                    { label: 'クリア率', value: `${dClearRate}%` },
                    { label: '平均時間', value: avgTime > 0 ? formatTime(avgTime) : '--:--' },
                    { label: 'ヒント平均', value: `${hintRate}回` },
                    { label: 'ミス平均', value: dStats.completions > 0 ? String((dStats.totalMissCount / dStats.completions).toFixed(1)) : '0' }
                ];

                dRows.forEach(row => {
                    const div = document.createElement('div');
                    div.classList.add('menu-stat-row');
                    div.style.paddingLeft = '8px';
                    const label = document.createElement('span');
                    label.classList.add('menu-stat-label');
                    label.style.fontSize = '0.6rem';
                    label.innerText = row.label;
                    const value = document.createElement('span');
                    value.classList.add('menu-stat-value');
                    value.style.fontSize = '0.6rem';
                    value.innerText = row.value;
                    div.appendChild(label);
                    div.appendChild(value);
                    statDiv.appendChild(div);
                });

                menuStats.appendChild(statDiv);
            });
        }

        function updateMenuUI() {
            renderMenuHighscores();
            renderMenuStats();
            if (menuMissMode) menuMissMode.checked = missLimitMode;
        }

        function startGameWithDifficulty(difficulty) {
            generateSudoku(difficulty);
            closeMenuAndStartGame();
        }

        function closeMenuAndStartGame() {
            if (menuScreen) menuScreen.style.display = 'none';
            if (gameContainer) gameContainer.style.display = 'flex';
        }

        function backToMenu() {
            if (isPlayMode) {
                if (!confirm('ゲーム中です。メニューに戻りますか？')) return;
                isPlayMode = false;
                stopTimer();
            }
            if (menuScreen) menuScreen.style.display = 'flex';
            if (gameContainer) gameContainer.style.display = 'none';
            updateMenuUI();
        }

        function updateMenuSettings() {
            if (!menuMissMode) return;
            missLimitMode = menuMissMode.checked;
            localStorage.setItem(MISS_MODE_KEY, missLimitMode ? 'on' : 'off');
        }

        function resetAllStats() {
            if (confirm('統計情報を本当にリセットしますか？')) {
                localStorage.setItem(STATS_KEY, JSON.stringify(initializeStats()));
                updateMenuUI();
                alert('統計情報がリセットされました。');
            }
        }

        function openSettingsMenu() {
            const settingsScreen = document.getElementById('settings-screen');
            if (settingsScreen) {
                settingsScreen.style.display = 'flex';
                renderThemeSelector();
            }
        }

        function closeSettingsMenu() {
            const settingsScreen = document.getElementById('settings-screen');
            if (settingsScreen) {
                settingsScreen.style.display = 'none';
            }
        }

        // ===== ヒント機能 =====
        const HINT_LIMIT = 3;
        let solvedBoard = null;      // 自動生成時の完成解（正解データ）。編集/読込問題ではnull
        let hintsUsed = 0;
        let hintUsedThisPuzzle = false; // trueの間はベストタイム更新を無効化

        function resetHints() {
            hintsUsed = 0;
            hintUsedThisPuzzle = false;
            updateHintUI();
        }

        function updateHintUI() {
            if (!btnHint) return;
            if (hintCountSpan) hintCountSpan.innerText = String(HINT_LIMIT - hintsUsed);
            if (hintMaxSpan) hintMaxSpan.innerText = String(HINT_LIMIT);
            const disabled = !solvedBoard || hintsUsed >= HINT_LIMIT || !isPlayMode || isPaused;
            btnHint.disabled = disabled;
        }

        function useHint() {
            if (isPaused) return;
            if (!isPlayMode) return;
            if (!solvedBoard) {
                errorText.innerText = "!! この問題ではヒントは使えません";
                return;
            }
            if (hintsUsed >= HINT_LIMIT) return;

            // ヒント対象マス: 選択中のマスがあり、未確定・未入力ならそこを使う。
            // なければ、空いている最初のマスを自動選択する。
            let targetCell = null;
            if (selectedCell && !selectedCell.classList.contains('fixed') && getCellValue(selectedCell) === "") {
                targetCell = selectedCell;
            } else {
                targetCell = cellsArray.find(cell => !cell.classList.contains('fixed') && getCellValue(cell) === "");
            }

            if (!targetCell) {
                errorText.innerText = "!! ヒントを入れられるマスがありません";
                return;
            }

            const idx = parseInt(targetCell.dataset.index);
            const r = Math.floor(idx / 9), c = idx % 9;
            const answer = solvedBoard[r][c];

            pushUndo(targetCell);
            targetCell.memoValues = Array(10).fill(false);
            renderMemo(targetCell);
            setCellValue(targetCell, answer);
            targetCell.classList.add('user-input', 'hint-input');

            hintsUsed++;
            hintUsedThisPuzzle = true;
            updateHintUI();
            updateCounts();

            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = targetCell;
            targetCell.classList.add('selected');
            getHighlightTargetAndTrigger(targetCell);

            // ヒントもミス扱いとしてカウントする
            incrementMissCount();

            // ヒントで最後のマスが埋まりクリアになるケースにも対応
            if (isPlayMode && checkGameClear()) {
                finishGameClear();
            }
        }

        function loadBestTimes() {
            try {
                return JSON.parse(localStorage.getItem(BEST_TIME_KEY)) || {};
            } catch (e) {
                return {};
            }
        }

        function saveBestTimes(data) {
            localStorage.setItem(BEST_TIME_KEY, JSON.stringify(data));
        }

        // モードキー: 通常は難易度そのまま、ミス制限モードは "_miss" を付けて別記録にする
        function bestTimeKey(difficulty, missMode) {
            return missMode ? `${difficulty}_miss` : difficulty;
        }

        function formatTime(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // クリア時に呼ぶ。ベスト更新なら true を返す
        function tryUpdateBestTime(difficulty, missMode, totalSeconds) {
            if (!difficulty) return false;
            const data = loadBestTimes();
            const key = bestTimeKey(difficulty, missMode);
            const prev = data[key];
            if (prev === undefined || totalSeconds < prev) {
                data[key] = totalSeconds;
                saveBestTimes(data);
                renderBestTimeList();
                return true;
            }
            return false;
        }

        function renderBestTimeList() {
            if (!bestTimeList) return;
            const data = loadBestTimes();
            const suffix = missLimitMode ? '_miss' : '';
            bestTimeList.innerHTML = '';
            Object.keys(DIFFICULTY_LABELS).forEach(diff => {
                const key = diff + suffix;
                const val = data[key];
                const item = document.createElement('div');
                item.classList.add('best-time-item');
                const label = document.createElement('span');
                label.classList.add('label');
                label.innerText = DIFFICULTY_LABELS[diff];
                const value = document.createElement('span');
                value.classList.add('value');
                value.innerText = (val !== undefined) ? formatTime(val) : '--:--';
                item.appendChild(label);
                item.appendChild(value);
                bestTimeList.appendChild(item);
            });
        }

        function updateMissToggleUI() {
            if (!btnMissToggle) return;
            btnMissToggle.innerText = `ミス制限モード: ${missLimitMode ? 'ON' : 'OFF'} (3ミスでOVER)`;
            btnMissToggle.classList.toggle('on', missLimitMode);
            renderBestTimeList();
        }

        function toggleMissLimitMode() {
            if (isPlayMode) return; // プレイ中は切り替え不可
            missLimitMode = !missLimitMode;
            localStorage.setItem(MISS_MODE_KEY, missLimitMode ? 'on' : 'off');
            updateMissToggleUI();
        }

        function resetMissCount() {
            missCount = 0;
            if (missCountSpan) missCountSpan.innerText = '0';
            if (missMaxSpan) missMaxSpan.innerText = String(MISS_LIMIT);
            if (missCounterEl) missCounterEl.style.display = missLimitMode ? 'block' : 'none';
        }

        function incrementMissCount() {
            if (!missLimitMode || !isPlayMode) return;
            missCount++;
            if (missCountSpan) missCountSpan.innerText = String(missCount);
            if (missCount >= MISS_LIMIT) {
                triggerGameOver();
            }
        }

        function triggerGameOver() {
            stopTimer();
            isPlayMode = false;
            isPaused = false;
            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = null;
            clearAllHighlights();

            gameoverTimeSpan.innerText = timerDisplay.innerText;
            toggleUIVisibility(true);
            modeToggle.innerText = "問題を確定してプレイ開始";
            modeToggle.style.display = "inline-block";
            btnPause.style.display = "none";
            modeText.innerText = "MODE: 問題を入力中";
            missCounterEl.style.display = 'none';

            setTimeout(() => {
                gameoverScreen.style.display = 'flex';
            }, 300);
        }

        function retryAfterGameOver() {
            gameoverScreen.style.display = 'none';
            if (!currentDifficulty) return;
            generateSudoku(currentDifficulty);

            // 新しい問題を確定し、そのままプレイモードへ
            isPlayMode = true;
            modeToggle.innerText = "ギブアップ";
            modeToggle.style.background = "var(--panel)";
            toggleUIVisibility(false);
            btnPause.style.display = "inline-block";
            btnHint.style.display = "inline-block";
            resetMissCount();
            updateHintUI();
            startTimer();
        }

        // アンドゥ用の入力履歴スタック。1手ごとに変更前の状態を積んでおき、
        // アンドゥ時に該当マスへ丸ごと書き戻すだけのシンプルな実装。
        const undoStack = [];
        const UNDO_STACK_LIMIT = 200;

        function updateUndoButtonState() {
            btnUndo.disabled = undoStack.length === 0;
        }

        // 変更を加える直前に、そのマスの「今の状態」を履歴に積む
        function pushUndo(cell) {
            undoStack.push({
                index: parseInt(cell.dataset.index),
                value: getCellValue(cell),
                wasFixed: cell.classList.contains('fixed'),
                wasUserInput: cell.classList.contains('user-input'),
                memoValues: cell.memoValues.slice()
            });
            if (undoStack.length > UNDO_STACK_LIMIT) undoStack.shift();
            updateUndoButtonState();
        }

        function clearUndoStack() {
            undoStack.length = 0;
            updateUndoButtonState();
        }

        function undo() {
            if (isPaused) return;
            if (undoStack.length === 0) return;

            const last = undoStack.pop();
            const cell = cellsArray[last.index];

            setCellValue(cell, last.value);
            cell.classList.remove('fixed', 'user-input');
            if (last.wasFixed) cell.classList.add('fixed');
            if (last.wasUserInput) cell.classList.add('user-input');
            cell.memoValues = last.memoValues.slice();
            renderMemo(cell);

            errorText.innerText = "";
            updateCounts();
            updateUndoButtonState();

            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = cell;
            cell.classList.add('selected');
            getHighlightTargetAndTrigger(cell);
        }

        btnUndo.addEventListener('click', undo);

        document.addEventListener('keydown', (e) => {
            const key = e.key ? e.key.toLowerCase() : '';
            if ((e.ctrlKey || e.metaKey) && key === 'z') {
                e.preventDefault();
                undo();
            }
        });

        let startTime = 0;
        let elapsedTime = 0;
        let timerInterval = null;

        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.dataset.row = Math.floor(i / 9);
            cell.dataset.col = i % 9;
            cell.memoValues = Array(10).fill(false);

            cell.addEventListener('click', () => {
                if (isPaused) return;
                if (selectedCell) selectedCell.classList.remove('selected');
                selectedCell = cell;
                cell.classList.add('selected');
                getHighlightTargetAndTrigger(cell);
            });

            grid.appendChild(cell);
            cellsArray.push(cell);
        }

        // メモの数字はマスの子要素として描画されるため、cell.innerTextをそのまま「本入力値」として
        // 扱うと、メモが表示されているだけのマスを「入力済み」と誤判定してしまう。
        // そこで本入力値は専用の .cell-value 要素で管理し、これらのヘルパー経由でのみ読み書きする。
        function getCellValue(cell) {
            const valSpan = cell.querySelector('.cell-value');
            return valSpan ? valSpan.innerText : "";
        }

        function setCellValue(cell, val) {
            let valSpan = cell.querySelector('.cell-value');
            if (val === "" || val === null || val === undefined) {
                if (valSpan) valSpan.remove();
            } else {
                if (!valSpan) {
                    valSpan = document.createElement('span');
                    valSpan.classList.add('cell-value');
                    cell.appendChild(valSpan);
                }
                valSpan.innerText = val;
            }
        }

        function checkValid(board, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (board[row][x] === num || board[x][col] === num) return false;
            }
            let startRow = row - row % 3, startCol = col - col % 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i + startRow][j + startCol] === num) return false;
                }
            }
            return true;
        }

        function solveSudokuRandomly(board) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                        for (let num of numbers) {
                            if (checkValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (solveSudokuRandomly(board)) return true;
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        // 解の個数を数える(2個見つかった時点で打ち切り = 一意性チェック用)
        function countSolutions(board, limit = 2) {
            let count = 0;
            function backtrack() {
                if (count >= limit) return;
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (board[row][col] === 0) {
                            for (let num = 1; num <= 9; num++) {
                                if (checkValid(board, row, col, num)) {
                                    board[row][col] = num;
                                    backtrack();
                                    board[row][col] = 0;
                                    if (count >= limit) return;
                                }
                            }
                            return;
                        }
                    }
                }
                count++;
            }
            backtrack();
            return count;
        }

        function generateSudoku(difficulty) {
            if (isPlayMode) return;
            currentDifficulty = difficulty;

            cellsArray.forEach(cell => {
                setCellValue(cell, "");
                cell.classList.remove('fixed', 'user-input');
                cell.memoValues = Array(10).fill(false);
                renderMemo(cell);
            });

            // 完成形の解を1つ作る
            let solved = Array.from({ length: 9 }, () => Array(9).fill(0));
            solveSudokuRandomly(solved);

            let minHints = 40;
            if (difficulty === 'normal') minHints = 32;
            if (difficulty === 'hard') minHints = 25;
            if (difficulty === 'expert') minHints = 20;

            // 解の一意性を保ったままヒント数を目標値まで間引いていく
            let puzzle = solved.map(r => r.slice());
            let indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
            let hints = 81;

            for (const idx of indices) {
                if (hints <= minHints) break;
                const r = Math.floor(idx / 9), c = idx % 9;
                if (puzzle[r][c] === 0) continue;

                const backup = puzzle[r][c];
                puzzle[r][c] = 0;

                const testBoard = puzzle.map(row => row.slice());
                if (countSolutions(testBoard, 2) === 1) {
                    hints--; // 一意解を保てるなら、このマスは空けたままにする
                } else {
                    puzzle[r][c] = backup; // 複数解になるなら元に戻す
                }
            }

            cellsArray.forEach((cell, idx) => {
                const r = Math.floor(idx / 9), c = idx % 9;
                if (puzzle[r][c] !== 0) {
                    setCellValue(cell, puzzle[r][c]);
                    cell.classList.add('fixed');
                }
            });

            // ヒント用に完成解を保存（generateSudokuで生成した問題のみ対象）
            solvedBoard = solved;

            errorText.innerText = "";
            clearAllHighlights();
            clearUndoStack();
            resetTimer();
            updateCounts();
            resetMissCount();
            resetHints();
            renderBestTimeList();
        }

        function savePuzzleCustom() {
            const saveName = prompt("この問題につける名前を入力してください（何個でも保存できます）：");
            if (saveName === null) return; 
            const trimmedName = saveName.trim();
            if (trimmedName === "") {
                alert("名前が空欄のため保存できませんでした。");
                return;
            }

            const puzzleData = cellsArray.map(cell => {
                return {
                    isFixed: cell.classList.contains('fixed'),
                    text: getCellValue(cell),
                    memos: cell.memoValues
                };
            });

            try {
                let customSaves = JSON.parse(localStorage.getItem('sudoku_studio_custom_saves') || '{}');
                customSaves[trimmedName] = puzzleData;
                localStorage.setItem('sudoku_studio_custom_saves', JSON.stringify(customSaves));
                alert(`[${trimmedName}] 保存しました`);
            } catch (e) {
                alert("保存に失敗しました");
            }
        }

        function openLoadModal() {
            if (isPlayMode) return;
            modalSaveList.innerHTML = "";
            let customSaves = JSON.parse(localStorage.getItem('sudoku_studio_custom_saves') || '{}');
            const saveNames = Object.keys(customSaves);

            if (saveNames.length === 0) {
                modalSaveList.innerHTML = "<div style='padding:15px; text-align:center; color:#a0aec0; font-size:0.85rem;'>保存されたデータがありません</div>";
            } else {
                saveNames.forEach(name => {
                    const item = document.createElement('div');
                    item.classList.add('save-item');

                    const nameSpan = document.createElement('span');
                    nameSpan.classList.add('save-name');
                    nameSpan.innerText = name;

                    const btnGroup = document.createElement('div');
                    btnGroup.classList.add('save-item-btns');

                    const loadBtn = document.createElement('button');
                    loadBtn.classList.add('btn-item-load');
                    loadBtn.innerText = "読込";
                    loadBtn.onclick = () => loadPuzzleCustom(name);

                    const delBtn = document.createElement('button');
                    delBtn.classList.add('btn-item-del');
                    delBtn.innerText = "削除";
                    delBtn.onclick = () => deletePuzzleCustom(name);

                    btnGroup.appendChild(loadBtn);
                    btnGroup.appendChild(delBtn);
                    item.appendChild(nameSpan);
                    item.appendChild(btnGroup);
                    modalSaveList.appendChild(item);
                });
            }
            loadModal.style.display = "flex";
        }

        function closeLoadModal() { loadModal.style.display = "none"; }

        function loadPuzzleCustom(name) {
            let customSaves = JSON.parse(localStorage.getItem('sudoku_studio_custom_saves') || '{}');
            const puzzleData = customSaves[name];
            if (!puzzleData) return;

            currentDifficulty = null; // お気に入り読込はベストタイム記録対象外
            solvedBoard = null;       // ヒント機能は使えない

            cellsArray.forEach((cell, index) => {
                const data = puzzleData[index];
                setCellValue(cell, data.text || "");
                cell.memoValues = data.memos || Array(10).fill(false);
                cell.classList.remove('fixed', 'user-input');
                if (data.isFixed) cell.classList.add('fixed');
                renderMemo(cell);
            });

            errorText.innerText = "";
            clearAllHighlights();
            clearUndoStack();
            isPlayMode = false;
            isPaused = false;
            pauseScreen.style.display = "none";
            numPadArea.style.opacity = "1";
            modeToggle.innerText = "問題を確定してプレイ開始";
            modeToggle.style.background = "var(--panel)";
            modeToggle.style.display = "inline-block";
            btnPause.style.display = "none";
            toggleUIVisibility(true);
            modeText.innerText = "MODE: 問題を入力中";
            resetTimer();
            updateCounts();
            missCounterEl.style.display = 'none';
            closeLoadModal();
            alert(`[${name}] を読み込みました`);
        }

        function deletePuzzleCustom(name) {
            if (confirm(`【${name}】のデータを完全に削除しますか？`)) {
                let customSaves = JSON.parse(localStorage.getItem('sudoku_studio_custom_saves') || '{}');
                delete customSaves[name];
                localStorage.setItem('sudoku_studio_custom_saves', JSON.stringify(customSaves));
                openLoadModal(); 
            }
        }

        function highlightSameNumbers(targetNum) {
            cellsArray.forEach(cell => {
                cell.classList.remove('same-number');
                const memoContainer = cell.querySelector('.memo-grid');
                if(memoContainer) {
                    memoContainer.querySelectorAll('.memo-digit').forEach(d => d.classList.remove('highlight-memo'));
                }
            });

            if (!targetNum || targetNum === "") return;

            cellsArray.forEach(cell => {
                if (getCellValue(cell) === targetNum) {
                    cell.classList.add('same-number');
                }
                if (cell.memoValues && cell.memoValues[targetNum] === true && getCellValue(cell) === "") {
                    const memoDigitEl = cell.querySelector(`#memo-${cell.dataset.index}-${targetNum}`);
                    if(memoDigitEl) {
                        memoDigitEl.classList.add('highlight-memo');
                    }
                }
            });
        }

        function getHighlightTargetAndTrigger(cell) {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            cellsArray.forEach(c => {
                c.classList.remove('highlight-cross');
                if (c.dataset.row === row || c.dataset.col === col) {
                    c.classList.add('highlight-cross');
                }
            });

            if (getCellValue(cell) !== "") {
                highlightSameNumbers(getCellValue(cell));
            } else {
                let firstMemo = "";
                for(let n=1; n<=9; n++) {
                    if(cell.memoValues[n]) { firstMemo = String(n); break; }
                }
                highlightSameNumbers(firstMemo);
            }
        }

        function renderMemo(cell) {
            if (getCellValue(cell) !== "") {
                const existing = cell.querySelector('.memo-grid');
                if(existing) existing.remove();
                return;
            }

            let memoGrid = cell.querySelector('.memo-grid');
            if (!memoGrid) {
                memoGrid = document.createElement('div');
                memoGrid.classList.add('memo-grid');
                cell.appendChild(memoGrid);
            }

            memoGrid.innerHTML = "";
            for (let n = 1; n <= 9; n++) {
                const digitDiv = document.createElement('div');
                digitDiv.classList.add('memo-digit');
                digitDiv.id = `memo-${cell.dataset.index}-${n}`;
                digitDiv.innerText = cell.memoValues[n] ? n : "";
                memoGrid.appendChild(digitDiv);
            }
        }

        // 行・列・ブロックのインデックスを事前計算しておき、毎回81マス全走査しないようにする
        const rowIndices = Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => r * 9 + c));
        const colIndices = Array.from({ length: 9 }, (_, c) => Array.from({ length: 9 }, (_, r) => r * 9 + c));
        const boxIndices = Array.from({ length: 9 }, (_, b) => {
            const boxRow = Math.floor(b / 3) * 3;
            const boxCol = (b % 3) * 3;
            const arr = [];
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) arr.push((boxRow + i) * 9 + (boxCol + j));
            return arr;
        });

        function isValidMove(targetCell, num) {
            const row = parseInt(targetCell.dataset.row);
            const col = parseInt(targetCell.dataset.col);
            const index = parseInt(targetCell.dataset.index);
            const boxIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
            const numStr = String(num);

            const inGroup = (indices) => indices.some(i => i !== index && getCellValue(cellsArray[i]) === numStr);

            return !inGroup(rowIndices[row]) && !inGroup(colIndices[col]) && !inGroup(boxIndices[boxIdx]);
        }

        // 紙吹雪を発生させる関数
        function launchConfetti() {
            const colors = ['#f6e05e', '#ed64a6', '#4299e1', '#48bb78', '#9f7aea', '#ffffff'];
            
            // 既存の紙吹雪があれば一旦消す
            clearScreen.querySelectorAll('.confetti').forEach(e => e.remove());
            
            for(let i = 0; i < 80; i++) {
                let conf = document.createElement('div');
                conf.classList.add('confetti');
                conf.style.left = Math.random() * 100 + 'vw';
                conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // ランダムな落下スピードと遅延
                const duration = Math.random() * 2.5 + 1.5;
                const delay = Math.random() * 1.5;
                
                conf.style.animation = `fall ${duration}s linear ${delay}s forwards`;
                clearScreen.appendChild(conf);
            }
        }

        function finishGameClear() {
            stopTimer();
            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = null;
            clearAllHighlights();

            const timeText = timerDisplay.innerText;
            finalTimeSpan.innerText = timeText;

            // ベストタイム判定（自動生成問題かつヒント未使用の場合のみ対象）
            const totalSeconds = Math.floor(elapsedTime / 1000);
            const isNewBest = !hintUsedThisPuzzle && tryUpdateBestTime(currentDifficulty, missLimitMode, totalSeconds);
            bestTimeUpdateSpan.style.display = isNewBest ? 'block' : 'none';

            // 統計情報を記録
            recordGameCompletion(currentDifficulty, totalSeconds, hintsUsed, missCount);

            isPlayMode = false;
            missCounterEl.style.display = 'none';
            updateHintUI();
            toggleUIVisibility(true);
            btnPause.style.display = "none";

            // クリア画面と紙吹雪を起動
            setTimeout(() => {
                clearScreen.style.display = 'flex';
                launchConfetti();
            }, 300);
        }

        function pressMainNumber(num) {
            if (isPaused) return;
            if (!selectedCell || (isPlayMode && selectedCell.classList.contains('fixed'))) return;
            errorText.innerText = "";

            if (num === 0) {
                const isAlreadyEmpty = getCellValue(selectedCell) === "" && !selectedCell.memoValues.some(v => v);
                if (isAlreadyEmpty) return;

                pushUndo(selectedCell);
                setCellValue(selectedCell, "");
                selectedCell.classList.remove('fixed', 'user-input', 'hint-input');
                selectedCell.memoValues = Array(10).fill(false);
                renderMemo(selectedCell);
                updateCounts();
                getHighlightTargetAndTrigger(selectedCell);
                return;
            }

            if (!isValidMove(selectedCell, num)) {
                errorText.innerText = "!! 数字が重複しています";
                selectedCell.classList.add('invalid-flash');
                setTimeout(() => { selectedCell.classList.remove('invalid-flash'); }, 400);
                incrementMissCount();
                return;
            }

            // ===== リアルタイム正解判定 =====
            if (solvedBoard) {
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                const correctAnswer = solvedBoard[row][col];
                
                if (num !== correctAnswer) {
                    // 間違い：エラーメッセージを表示して入力を受け付けない
                    errorText.innerText = `✗ 正解ではありません（正解: ${correctAnswer}）`;
                    selectedCell.classList.add('invalid-flash');
                    setTimeout(() => { selectedCell.classList.remove('invalid-flash'); }, 400);
                    incrementMissCount();
                    return; // 入力しない
                }
                // 正解の場合はそのまま続行
            }

            pushUndo(selectedCell);
            selectedCell.memoValues = Array(10).fill(false);
            renderMemo(selectedCell);

            setCellValue(selectedCell, num);
            if (!isPlayMode) {
                selectedCell.classList.add('fixed');
            } else {
                selectedCell.classList.remove('hint-input');
                selectedCell.classList.add('user-input');
                
                if (checkGameClear()) {
                    finishGameClear();
                }
            }
            updateCounts();
            if (selectedCell) getHighlightTargetAndTrigger(selectedCell); 
        }

        let lastMemoPress = { index: null, num: null, time: 0 };

        function pressMemoNumber(num) {
            if (isPaused) return;
            if (!selectedCell || (isPlayMode && selectedCell.classList.contains('fixed'))) return;
            if (getCellValue(selectedCell) !== "") return; 
            
            if (!isPlayMode) {
                alert("メモ機能は「プレイ開始」後（ゲーム中）にのみ使用できます！");
                return;
            }

            // モバイル端末でtouchendとclickが連続発火し、トグルが相殺されてしまう現象を防ぐガード
            const cellIndex = selectedCell.dataset.index;
            const now = Date.now();
            if (lastMemoPress.index === cellIndex && lastMemoPress.num === num && (now - lastMemoPress.time) < 250) {
                return;
            }
            lastMemoPress = { index: cellIndex, num, time: now };

            errorText.innerText = "";
            pushUndo(selectedCell);
            selectedCell.memoValues[num] = !selectedCell.memoValues[num];
            renderMemo(selectedCell);
            getHighlightTargetAndTrigger(selectedCell);
        }

        function clearMemo() {
            if (isPaused) return;
            if (!selectedCell || (isPlayMode && selectedCell.classList.contains('fixed'))) return;
            if (getCellValue(selectedCell) !== "") return;
            if (!selectedCell.memoValues.some(v => v)) return;

            pushUndo(selectedCell);
            selectedCell.memoValues = Array(10).fill(false);
            renderMemo(selectedCell);
            getHighlightTargetAndTrigger(selectedCell);
        }

        function updateCounts() {
            const counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};
            cellsArray.forEach(cell => {
                const val = getCellValue(cell);
                if (val >= 1 && val <= 9) counts[val]++;
            });

            for (let num = 1; num <= 9; num++) {
                const countEl = document.getElementById(`count-${num}`);
                const btnEl = document.getElementById(`btn-num-${num}`);
                if (counts[num] === 9) {
                    if(countEl) countEl.innerText = `9/9`;
                    btnEl.classList.add('completed');
                } else {
                    if(countEl) countEl.innerText = `${counts[num]}/9`;
                    btnEl.classList.remove('completed');
                }
            }
        }

        function checkGameClear() {
            for (let i = 0; i < 81; i++) {
                if (getCellValue(cellsArray[i]) === "") return false;
            }
            return true;
        }

        function startTimer() {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                const totalSeconds = Math.floor(elapsedTime / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
        }

        function stopTimer() { clearInterval(timerInterval); }
        function resetTimer() { clearInterval(timerInterval); elapsedTime = 0; timerDisplay.innerText = "00:00"; }
        function closeClearScreen() { clearScreen.style.display = 'none'; }

        function pauseGame() {
            if (!isPlayMode || isPaused) return;
            isPaused = true;
            stopTimer();
            pauseScreen.style.display = "flex";
            numPadArea.style.opacity = "0.15";
            modeToggle.style.display = "none";
            btnUndo.disabled = true;
        }

        function resumeGame() {
            if (!isPlayMode || !isPaused) return;
            isPaused = false;
            startTimer();
            pauseScreen.style.display = "none";
            numPadArea.style.opacity = "1";
            modeToggle.style.display = "inline-block";
            updateUndoButtonState();
        }

        function clearAllHighlights() {
            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = null;
            cellsArray.forEach(cell => {
                cell.classList.remove('same-number', 'highlight-cross');
                const mg = cell.querySelector('.memo-grid');
                if(mg) mg.querySelectorAll('.memo-digit').forEach(d => d.classList.remove('highlight-memo'));
            });
        }

        function toggleUIVisibility(showAll) {
            if (showAll) {
                titleEl.style.display = "block";
                btnReset.style.display = "inline-block";
                btnClear.style.display = "inline-block";
                saveArea.style.display = "block";
                genArea.style.display = "block";
                modeText.style.display = "block";
            } else {
                titleEl.style.display = "none";
                btnReset.style.display = "none";
                btnClear.style.display = "none";
                saveArea.style.display = "none";
                genArea.style.display = "none";
                modeText.style.display = "none";
            }
        }

        modeToggle.addEventListener('click', () => {
            if (isPaused) return;

            if (isPlayMode) {
                if (!confirm("ギブアップして問題編集モードに戻りますか？")) return;
            }

            errorText.innerText = "";
            clearAllHighlights();
            clearUndoStack();

            if (!isPlayMode) {
                isPlayMode = true;
                modeToggle.innerText = "ギブアップ";
                modeToggle.style.background = "var(--panel)";
                recordGamePlay(currentDifficulty);
                startTimer();
                toggleUIVisibility(false);
                btnPause.style.display = "inline-block";
                btnHint.style.display = solvedBoard ? "inline-block" : "none";
                resetMissCount();
                updateHintUI();
            } else {
                isPlayMode = false;
                modeToggle.innerText = "問題を確定してプレイ開始";
                modeToggle.style.background = "var(--panel)";
                modeText.innerText = "MODE: 問題を入力中";
                stopTimer();
                toggleUIVisibility(true);
                btnPause.style.display = "none";
                btnHint.style.display = "none";
                missCounterEl.style.display = 'none';
                updateHintUI();
            }
        });

        btnReset.addEventListener('click', () => {
            if (confirm("現在の問題を最初から解き直しますか？")) {
                cellsArray.forEach(cell => {
                    if (!cell.classList.contains('fixed')) {
                        setCellValue(cell, "");
                        cell.classList.remove('user-input');
                        cell.memoValues = Array(10).fill(false);
                        renderMemo(cell);
                    }
                });
                errorText.innerText = "";
                clearAllHighlights();
                clearUndoStack();
                if (isPlayMode) { resetTimer(); startTimer(); resetMissCount(); } else { resetTimer(); }
                updateCounts();
            }
        });

        btnClear.addEventListener('click', () => {
            if (confirm("盤面を完全にクリアして、最初から新しい問題を作り直しますか？")) {
                cellsArray.forEach(cell => {
                    setCellValue(cell, "");
                    cell.classList.remove('fixed', 'user-input');
                    cell.memoValues = Array(10).fill(false);
                    renderMemo(cell);
                });
                errorText.innerText = "";
                clearAllHighlights();
                clearUndoStack();
                isPlayMode = false;
                isPaused = false;
                pauseScreen.style.display = "none";
                numPadArea.style.opacity = "1";
                modeToggle.innerText = "問題を確定してプレイ開始";
                modeToggle.style.background = "var(--panel)";
                modeToggle.style.display = "inline-block";
                btnPause.style.display = "none";
                toggleUIVisibility(true);
                modeText.innerText = "MODE: 問題を入力中";
                resetTimer();
                updateCounts();
                currentDifficulty = null;
                solvedBoard = null;
                missCounterEl.style.display = 'none';
            }
        });

        updateCounts();
        updateUndoButtonState();
        updateMissToggleUI();
        updateMenuUI();
        
        // テーマの初期化
        const currentTheme = loadTheme();
        applyTheme(localStorage.getItem(THEME_KEY) || 'darkblue');
        
        if (menuScreen) menuScreen.style.display = 'flex';
        if (gameContainer) gameContainer.style.display = 'none';
