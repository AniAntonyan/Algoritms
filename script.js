document.addEventListener('DOMContentLoaded', () => {
    const languageSwitch = document.getElementById('languageSwitch');
    languageSwitch.addEventListener('click', changeLanguage);

    const quizButtons = document.querySelectorAll('.quiz-form button');
    quizButtons.forEach(button => button.addEventListener('click', handleQuiz));

    // Initialize interactive blocks
    initDragDropGame();
    initSearchVisualizer();
    initCodePlayground();
    updateHeaderAuthUI();
});

function changeLanguage() {
    const html = document.documentElement;
    const currentLang = html.lang === 'hy' ? 'hy' : 'en';
    const nextLang = currentLang === 'hy' ? 'en' : 'hy';
    html.lang = nextLang;

    const elements = document.querySelectorAll('[data-hy]');
    elements.forEach(el => {
        const text = nextLang === 'hy' ? el.dataset.hy : el.dataset.en;
        if (text !== undefined) {
            el.innerText = text;
        }
    });

    const langButton = document.getElementById('languageSwitch');
    langButton.innerText = nextLang === 'hy' ? langButton.dataset.en : langButton.dataset.hy;
}

function handleQuiz(event) {
    const form = event.target.closest('.quiz-form');
    if (!form) return;

    const resultElement = form.querySelector('.quiz-result');
    const questions = Array.from(form.querySelectorAll('.question'));
    let score = 0;
    const maxScore = questions.length;

    questions.forEach(question => {
        const input = question.querySelector('input[type="radio"]:checked');
        if (!input) return;
        const expected = question.dataset.answer;
        if (input.value === expected) {
            score += 1;
        }
    });

    const isArmenian = document.documentElement.lang === 'hy';
    const successText = isArmenian ? `Ճիշտ պատասխաններ՝ ${score} / ${maxScore}` : `Correct answers: ${score} / ${maxScore}`;
    const tryMoreText = isArmenian ? 'Պատասխանը դիտարկիր և կրկին փորձիր:' : 'Review the answers and try again.';
    const message = score === maxScore ? (isArmenian ? 'Հիանալի աշխատանք!' : 'Great job!') : tryMoreText;

    resultElement.innerText = `${successText} ${message}`;
}

// Add expected answers for quiz questions
document.querySelectorAll('.question').forEach((item, index) => {
    if (!item.dataset.answer) {
        if (item.querySelector('input[name="lesson1"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson1b"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson2"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson2b"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson3"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson3b"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson4"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson4b"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson5"]')) item.dataset.answer = 'a';
        if (item.querySelector('input[name="lesson5b"]')) item.dataset.answer = 'a';
    }
});

// Auth Modal Logic
const authModal = document.getElementById('authModal');
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('show');
    });
}

if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', () => {
        authModal.classList.remove('show');
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('show');
    }
});

if (loginTabBtn && registerTabBtn) {
    loginTabBtn.addEventListener('click', () => {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTabBtn.addEventListener('click', () => {
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

// --- Authentication Submit Logic ---
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        // Save to local storage (mock backend)
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_password', password);

        // Close modal and update UI
        authModal.classList.remove('show');
        registerForm.reset();
        updateHeaderAuthUI();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const savedEmail = localStorage.getItem('user_email');
        const savedPassword = localStorage.getItem('user_password');

        if (email === savedEmail && password === savedPassword) {
            // Success
            authModal.classList.remove('show');
            loginForm.reset();
            updateHeaderAuthUI();
        } else {
            const isArmenian = document.documentElement.lang === 'hy';
            alert(isArmenian ? 'Սխալ էլ. փոստ կամ գաղտնաբառ:' : 'Invalid email or password.');
        }
    });
}

function updateHeaderAuthUI() {
    const userName = localStorage.getItem('user_name');
    const authBtn = document.getElementById('openAuthModalBtn');
    let userInfo = document.getElementById('userInfoContainer');
    
    if (userName) {
        if (authBtn) authBtn.style.display = 'none';
        
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.id = 'userInfoContainer';
            userInfo.style.cssText = 'display: flex; align-items: center; gap: 15px;';
            
            const nameSpan = document.createElement('span');
            nameSpan.id = 'userNameDisplay';
            nameSpan.style.cssText = 'font-weight: 600; color: var(--secondary); background: var(--primary-light); padding: 8px 16px; border-radius: 20px;';
            
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.style.cssText = 'background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-weight: 600; transition: color 0.3s;';
            logoutBtn.dataset.en = 'Logout';
            logoutBtn.dataset.hy = 'Ելք';
            const isArmenian = document.documentElement.lang === 'hy';
            logoutBtn.innerText = isArmenian ? 'Ելք' : 'Logout';
            
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('user_name');
                updateHeaderAuthUI();
            });
            
            userInfo.appendChild(nameSpan);
            userInfo.appendChild(logoutBtn);
            
            if (authBtn && authBtn.parentNode) {
                authBtn.parentNode.insertBefore(userInfo, authBtn);
            }
        }
        
        userInfo.style.display = 'flex';
        const nameSpan = document.getElementById('userNameDisplay');
        if (nameSpan) {
            const isArmenian = document.documentElement.lang === 'hy';
            nameSpan.dataset.en = `Hello, ${userName}`;
            nameSpan.dataset.hy = `Բարև, ${userName}`;
            nameSpan.innerText = isArmenian ? `Բարև, ${userName}` : `Hello, ${userName}`;
        }
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// --- Drag & Drop Game Implementation ---
const gameTasks = {
    sandwich: {
        steps: [
            { id: '1', en: 'Slice the bread', hy: 'Կտրատել հացը' },
            { id: '2', en: 'Spread butter or sauce on the slice', hy: 'Քսել կարագ կամ սոուս հացի կտորին' },
            { id: '3', en: 'Put cheese and meat/vegetables', hy: 'Դնել պանիր և միս/բանջարեղեն' },
            { id: '4', en: 'Close with another slice of bread', hy: 'Ծածկել հացի մյուս կտորով' }
        ]
    },
    school: {
        steps: [
            { id: '1', en: 'Wake up and get out of bed', hy: 'Արթնանալ և վեր կենալ անկողնուց' },
            { id: '2', en: 'Brush your teeth and wash your face', hy: 'Լվանալ ատամները և երեսը' },
            { id: '3', en: 'Get dressed in your school uniform', hy: 'Հագնել դպրոցական համազգեստը' },
            { id: '4', en: 'Pack your school bag with books', hy: 'Դասավորել դասագրքերը պայուսակի մեջ' }
        ]
    }
};

let currentTaskKey = 'sandwich';
let selectedStepItem = null; // for click-to-swap on mobile

function initDragDropGame() {
    const tabs = document.querySelectorAll('.game-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTaskKey = tab.dataset.task;
            loadGameTask(currentTaskKey);
        });
    });

    const checkBtn = document.getElementById('check-game-btn');
    if (checkBtn) checkBtn.addEventListener('click', checkGameOrder);

    const resetBtn = document.getElementById('reset-game-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => loadGameTask(currentTaskKey));

    loadGameTask(currentTaskKey);
}

function loadGameTask(taskKey) {
    const container = document.getElementById('steps-container');
    const feedback = document.getElementById('game-feedback');
    if (!container) return;

    feedback.innerText = '';
    feedback.className = 'game-result';
    selectedStepItem = null;

    const task = gameTasks[taskKey];
    // Clone and shuffle steps
    let stepsCopy = [...task.steps];
    
    // Ensure it's actually shuffled (not in correct order initially)
    do {
        stepsCopy = shuffleArray(stepsCopy);
    } while (isAlreadyCorrect(stepsCopy));

    container.innerHTML = '';
    const currentLang = document.documentElement.lang || 'hy';

    stepsCopy.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'step-item';
        item.draggable = true;
        item.dataset.id = step.id;

        // Number badge
        const numBadge = document.createElement('span');
        numBadge.className = 'step-number';
        numBadge.innerText = idx + 1;

        // Content
        const contentSpan = document.createElement('span');
        contentSpan.className = 'step-content';
        contentSpan.dataset.en = step.en;
        contentSpan.dataset.hy = step.hy;
        contentSpan.innerText = currentLang === 'en' ? step.en : step.hy;

        // Drag icon/handle
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.innerHTML = '&#9776;'; // Hamburger icon

        item.appendChild(numBadge);
        item.appendChild(contentSpan);
        item.appendChild(handle);

        // Add drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);

        // Click to swap fallback (Mobile friendly)
        item.addEventListener('click', handleStepClick);

        container.appendChild(item);
    });

    // Add dragover to container
    container.addEventListener('dragover', handleDragOver);
}

function shuffleArray(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function isAlreadyCorrect(shuffledSteps) {
    for (let i = 0; i < shuffledSteps.length; i++) {
        if (shuffledSteps[i].id !== (i + 1).toString()) {
            return false;
        }
    }
    return true;
}

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    this.classList.add('dragging');
}

function handleDragEnd() {
    this.classList.remove('dragging');
    reindexSteps();
}

function handleDragOver(e) {
    e.preventDefault();
    const container = document.getElementById('steps-container');
    const draggingItem = container.querySelector('.step-item.dragging');
    if (!draggingItem) return;

    const siblings = [...container.querySelectorAll('.step-item:not(.dragging)')];
    
    let nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY <= box.top + box.height / 2;
    });
    
    container.insertBefore(draggingItem, nextSibling);
}

function handleStepClick() {
    if (selectedStepItem === null) {
        selectedStepItem = this;
        this.style.borderColor = 'var(--accent)';
        this.style.background = 'var(--primary-light)';
    } else if (selectedStepItem === this) {
        // Deselect
        this.style.borderColor = '';
        this.style.background = '';
        selectedStepItem = null;
    } else {
        // Swap their DOM positions
        const container = document.getElementById('steps-container');
        const children = Array.from(container.children);
        const indexA = children.indexOf(selectedStepItem);
        const indexB = children.indexOf(this);

        // Swap nodes
        const tempNode = document.createElement('div');
        container.insertBefore(tempNode, this);
        container.insertBefore(this, selectedStepItem);
        container.insertBefore(selectedStepItem, tempNode);
        container.removeChild(tempNode);

        // Reset styles
        selectedStepItem.style.borderColor = '';
        selectedStepItem.style.background = '';
        this.style.borderColor = '';
        this.style.background = '';
        selectedStepItem = null;

        reindexSteps();
    }
}

function reindexSteps() {
    const container = document.getElementById('steps-container');
    if (!container) return;
    const items = container.querySelectorAll('.step-item');
    items.forEach((item, idx) => {
        const numBadge = item.querySelector('.step-number');
        if (numBadge) numBadge.innerText = idx + 1;
    });
}

function checkGameOrder() {
    const container = document.getElementById('steps-container');
    const feedback = document.getElementById('game-feedback');
    if (!container || !feedback) return;

    const items = container.querySelectorAll('.step-item');
    let correct = true;

    items.forEach((item, idx) => {
        const stepId = item.dataset.id;
        const expectedId = (idx + 1).toString();
        if (stepId !== expectedId) {
            correct = false;
        }
    });

    const isArmenian = document.documentElement.lang === 'hy';
    if (correct) {
        feedback.className = 'game-result success';
        feedback.dataset.en = 'Correct! Well done!';
        feedback.dataset.hy = 'Ճիշտ է: Հիանալի՜ է:';
        feedback.innerText = isArmenian ? 'Ճիշտ է: Հիանալի՜ է:' : 'Correct! Well done!';
    } else {
        feedback.className = 'game-result error';
        feedback.dataset.en = 'Incorrect order. Try again!';
        feedback.dataset.hy = 'Սխալ հերթականություն: Կրկին փորձի՛ր:';
        feedback.innerText = isArmenian ? 'Սխալ հերթականություն: Կրկին փորձի՛ր:' : 'Incorrect order. Try again!';
    }
}

// --- Search Algorithm Simulation Implementation ---
const searchArray = [3, 8, 15, 24, 33, 42, 57, 68, 79, 90];
let simulationActive = false;
let simulationTimeoutId = null;

function initSearchVisualizer() {
    const arrayContainer = document.getElementById('array-visualizer');
    if (!arrayContainer) return;

    renderVisualizerArray();

    const startBtn = document.getElementById('start-search-btn');
    if (startBtn) startBtn.addEventListener('click', startSearchSimulation);

    const resetBtn = document.getElementById('reset-search-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetSearchSimulation);
}

function renderVisualizerArray() {
    const container = document.getElementById('array-visualizer');
    if (!container) return;

    container.innerHTML = '';
    searchArray.forEach((val, idx) => {
        const box = document.createElement('div');
        box.className = 'array-box';
        box.innerText = val;

        const idxSpan = document.createElement('span');
        idxSpan.className = 'box-index';
        idxSpan.innerText = idx;

        box.appendChild(idxSpan);
        container.appendChild(box);
    });

    clearPointerBadges();
}

function clearPointerBadges() {
    const badgesContainer = document.getElementById('pointer-badges-container');
    if (!badgesContainer) return;
    badgesContainer.innerHTML = '';
    for (let i = 0; i < searchArray.length; i++) {
        const slot = document.createElement('div');
        slot.style.width = '60px';
        slot.style.display = 'flex';
        slot.style.justifyContent = 'center';
        slot.style.gap = '2px';
        badgesContainer.appendChild(slot);
    }
}

function renderBinaryPointers(low, mid, high) {
    clearPointerBadges();
    const badgesContainer = document.getElementById('pointer-badges-container');
    if (!badgesContainer) return;
    const slots = badgesContainer.children;

    if (low >= 0 && low < slots.length) {
        const badge = document.createElement('span');
        badge.className = 'pointer-badge low';
        badge.innerText = 'L';
        badge.title = 'Low';
        slots[low].appendChild(badge);
    }
    if (mid >= 0 && mid < slots.length) {
        const badge = document.createElement('span');
        badge.className = 'pointer-badge mid';
        badge.innerText = 'M';
        badge.title = 'Mid';
        slots[mid].appendChild(badge);
    }
    if (high >= 0 && high < slots.length) {
        const badge = document.createElement('span');
        badge.className = 'pointer-badge high';
        badge.innerText = 'H';
        badge.title = 'High';
        slots[high].appendChild(badge);
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        simulationTimeoutId = setTimeout(resolve, ms);
    });
}

function updateSearchStatus(en, hy) {
    const statusEl = document.getElementById('search-status');
    if (!statusEl) return;
    statusEl.dataset.en = en;
    statusEl.dataset.hy = hy;
    const currentLang = document.documentElement.lang === 'en' ? 'en' : 'hy';
    statusEl.innerText = currentLang === 'en' ? en : hy;
}

async function startSearchSimulation() {
    if (simulationActive) return;
    simulationActive = true;

    // Reset visual state before starting
    resetSearchStateOnly();

    const algorithm = document.getElementById('search-algorithm').value;
    const targetInput = document.getElementById('search-target');
    const target = parseInt(targetInput.value);

    if (isNaN(target)) {
        updateSearchStatus('Please enter a valid number.', 'Խնդրում ենք մուտքագրել վավեր թիվ:');
        simulationActive = false;
        return;
    }

    const container = document.getElementById('array-visualizer');
    const boxes = container.children;
    const speedInput = document.getElementById('search-speed');

    if (algorithm === 'linear') {
        updateSearchStatus(`Starting Linear Search for ${target}...`, `Սկսում ենք գծային որոնում ${target}-ի համար...`);
        await sleep(500);

        for (let i = 0; i < searchArray.length; i++) {
            if (!simulationActive) return;

            // Highlight current checking element
            boxes[i].classList.add('checking');
            updateSearchStatus(
                `Checking index ${i}: Is ${searchArray[i]} equal to ${target}?`,
                `Ստուգում ենք ինդեքս ${i}-ը. արդյո՞ք ${searchArray[i]}-ը հավասար է ${target}-ին:`
            );

            const delay = 2100 - parseInt(speedInput.value);
            await sleep(delay);

            if (searchArray[i] === target) {
                boxes[i].classList.remove('checking');
                boxes[i].classList.add('found');
                updateSearchStatus(
                    `Found! Element ${target} is at index ${i}.`,
                    `Գտնվե՛ց: ${target} տարրը գտնվում է ${i} ինդեքսում:`
                );
                simulationActive = false;
                return;
            } else {
                boxes[i].classList.remove('checking');
                boxes[i].classList.add('ignored');
            }
        }

        updateSearchStatus(
            `Finished search: Element ${target} not found in array.`,
            `Որոնումն ավարտվեց. ${target} տարրը չգտնվեց զանգվածում:`
        );

    } else {
        updateSearchStatus(`Starting Binary Search for ${target} (requires sorted array)...`, `Սկսում ենք երկուական որոնում ${target}-ի համար (պահանջում է տեսակավորված զանգված)...`);
        await sleep(500);

        let low = 0;
        let high = searchArray.length - 1;

        while (low <= high) {
            if (!simulationActive) return;

            const mid = Math.floor((low + high) / 2);
            renderBinaryPointers(low, mid, high);

            // Grey out elements outside current low/high range
            for (let i = 0; i < searchArray.length; i++) {
                if (i < low || i > high) {
                    boxes[i].classList.add('ignored');
                } else {
                    boxes[i].classList.remove('ignored');
                }
            }

            boxes[mid].classList.add('checking');
            updateSearchStatus(
                `Checking middle element at index ${mid} (${searchArray[mid]}): low=${low}, high=${high}`,
                `Ստուգում ենք մեջտեղի տարրը ինդեքս ${mid}-ում (${searchArray[mid]}). low=${low}, high=${high}`
            );

            const delay = 2100 - parseInt(speedInput.value);
            await sleep(delay);

            if (searchArray[mid] === target) {
                boxes[mid].classList.remove('checking');
                boxes[mid].classList.add('found');
                updateSearchStatus(
                    `Found! Element ${target} is at index ${mid}.`,
                    `Գտնվե՛ց: ${target} տարրը գտնվում է ${mid} ինդեքսում:`
                );
                simulationActive = false;
                return;
            }

            boxes[mid].classList.remove('checking');

            if (searchArray[mid] < target) {
                updateSearchStatus(
                    `Since middle value ${searchArray[mid]} < ${target}, we discard the left half. Moving low pointer to mid + 1 (${mid + 1}).`,
                    `Քանի որ մեջտեղի արժեքը (${searchArray[mid]} < ${target}), անտեսում ենք ձախ կեսը: Տեղափոխում ենք low-ը mid + 1 (${mid + 1}):`
                );
                low = mid + 1;
            } else {
                updateSearchStatus(
                    `Since middle value ${searchArray[mid]} > ${target}, we discard the right half. Moving high pointer to mid - 1 (${mid - 1}).`,
                    `Քանի որ մեջտեղի արժեքը (${searchArray[mid]} > ${target}), անտեսում ենք աջ կեսը: Տեղափոխում ենք high-ը mid - 1 (${mid - 1}):`
                );
                high = mid - 1;
            }

            await sleep(delay);
        }

        // Grey out everything if not found
        for (let i = 0; i < searchArray.length; i++) {
            boxes[i].classList.add('ignored');
        }
        clearPointerBadges();
        updateSearchStatus(
            `Finished search: Element ${target} not found in array.`,
            `Որոնումն ավարտվեց. ${target} տարրը չգտնվեց զանգվածում:`
        );
    }

    simulationActive = false;
}

function resetSearchStateOnly() {
    clearTimeout(simulationTimeoutId);
    const container = document.getElementById('array-visualizer');
    if (!container) return;
    const boxes = container.children;
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].className = 'array-box';
    }
    clearPointerBadges();
}

function resetSearchSimulation() {
    simulationActive = false;
    resetSearchStateOnly();
    updateSearchStatus(
        "Enter a number and click 'Start' to begin simulation.",
        "Մուտքագրեք թիվ և սեղմեք «Սկսել»՝ սիմուլյացիան սկսելու համար:"
    );
}

// --- Code Playground Implementation ---
let codeEditorInstance = null;
let pyodideInstance = null;
let isPyodideLoading = false;

async function loadPyodideEngine() {
    if (pyodideInstance || isPyodideLoading) return;
    try {
        isPyodideLoading = true;
        const outputDiv = document.getElementById('code-output');
        const isArmenian = document.documentElement.lang === 'hy';
        outputDiv.innerText = isArmenian ? "Բեռնվում է Python միջավայրը (Pyodide)... Խնդրում ենք սպասել:\n" : "Loading Python engine (Pyodide)... Please wait.\n";
        
        pyodideInstance = await loadPyodide();
        
        outputDiv.innerText += isArmenian ? "Python միջավայրը հաջողությամբ բեռնվեց:\n" : "Python engine loaded successfully!\n";
        
        // Small delay to clear the loading message automatically if it was just loading
        setTimeout(() => {
            if(outputDiv.innerText.includes("Python")) {
                outputDiv.innerText = '';
            }
        }, 1500);
    } catch(err) {
        document.getElementById('code-output').innerText = "Failed to load Python engine.\n";
    } finally {
        isPyodideLoading = false;
    }
}

function initCodePlayground() {
    const editorTextArea = document.getElementById('code-editor');
    if (!editorTextArea) return;

    if (typeof CodeMirror !== 'undefined') {
        codeEditorInstance = CodeMirror.fromTextArea(editorTextArea, {
            mode: "javascript",
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4
        });
        codeEditorInstance.setSize("100%", "200px");
    }

    const langSelect = document.getElementById('code-language-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            if (lang === 'python') {
                codeEditorInstance.setOption("mode", "python");
                codeEditorInstance.setValue("# Գրեք ձեր կոդը այստեղ\n# Օրինակ՝\nx = 5\ny = 10\nprint('Արդյունք:', x + y)");
                loadPyodideEngine(); // Preload Pyodide
            } else {
                codeEditorInstance.setOption("mode", "javascript");
                codeEditorInstance.setValue("// Գրեք ձեր կոդը այստեղ\n// Օրինակ՝\nlet x = 5;\nlet y = 10;\nconsole.log('Արդյունք:', x + y);");
            }
        });
    }

    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) {
        runBtn.addEventListener('click', runPlaygroundCode);
    }

    const clearBtn = document.getElementById('clear-code-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const outputDiv = document.getElementById('code-output');
            if (outputDiv) outputDiv.innerText = '';
        });
    }
}

async function runPlaygroundCode() {
    if (!codeEditorInstance) return;
    
    const code = codeEditorInstance.getValue();
    const outputDiv = document.getElementById('code-output');
    outputDiv.innerText = ''; // Clear previous output
    
    const langSelect = document.getElementById('code-language-select');
    const lang = langSelect ? langSelect.value : 'javascript';

    if (lang === 'python') {
        if (!pyodideInstance) {
            await loadPyodideEngine();
            if (!pyodideInstance) return;
        }
        
        outputDiv.innerText = '';
        pyodideInstance.setStdout({ batched: (msg) => { outputDiv.innerText += msg + '\n'; } });
        try {
            await pyodideInstance.runPythonAsync(code);
        } catch(err) {
            outputDiv.innerText += "Error: " + err.message + '\n';
        }
    } else {
        // Capture console.log
        const originalLog = console.log;
        console.log = function(...args) {
            // Format object to string if necessary
            const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
            outputDiv.innerText += msg + '\n';
            originalLog.apply(console, args);
        };

        try {
            // Execute the code securely in the browser context
            const runFn = new Function(code);
            runFn();
        } catch (err) {
            outputDiv.innerText += "Error: " + err.message + '\n';
        }

        // Restore original console.log
        console.log = originalLog;
    }
}