/* =========================================================
   BUDGETBASICS MAIN APPLICATION
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {

    users: "budgetbasics_users_v1",

    session: "budgetbasics_session_v1",

    theme: "budgetbasics_theme_v1"

};


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);


const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


function getUsers() {

    try {

        const users =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.users
                ) || "[]"
            );

        return Array.isArray(users) ?
            users : [];

    } catch {

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        STORAGE.users,
        JSON.stringify(users)
    );

}


function getSessionUser() {

    const sessionId =
        localStorage.getItem(
            STORAGE.session
        );


    if (!sessionId) {

        return null;

    }


    const users =
        getUsers();


    return (
        users.find(
            user => user.id === sessionId
        ) || null
    );

}


function updateCurrentUser(updatedUser) {

    const users =
        getUsers();


    const index =
        users.findIndex(
            user =>
            user.id === updatedUser.id
        );


    if (index === -1) {

        return;

    }


    users[index] =
        updatedUser;


    saveUsers(users);

}


function getCurrentUser() {

    return getSessionUser();

}


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser =
    getCurrentUser();


if (!currentUser) {

    window.location.href =
        "index.html";

}


/* =========================================================
   CURRENT MONTH
========================================================= */

let currentMonthKey =
    getInitialMonth();


function getInitialMonth() {

    const now =
        new Date();


    const currentKey =
        getMonthKey(now);


    if (
        currentUser &&
        currentUser.activeMonth
    ) {

        return currentUser.activeMonth;

    }


    return currentKey;

}


function getMonthKey(date) {

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0")
    );

}


function getMonthName(monthKey) {

    const [
        year,
        month
    ] =
    monthKey.split("-").map(Number);


    return new Intl.DateTimeFormat(
        "en-US", {
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(year, month - 1, 1)
    );

}


function createEmptyMonth() {

    return {

        income: 0,

        expenses: [],

        goals: [],

        createdAt: new Date().toISOString()

    };

}


function getCurrentMonthData() {

    if (!currentUser.monthlyData) {

        currentUser.monthlyData = {};

    }


    if (!currentUser.monthlyData[currentMonthKey]) {

        currentUser.monthlyData[currentMonthKey] =
            createEmptyMonth();

        updateCurrentUser(
            currentUser
        );

    }


    return currentUser.monthlyData[
        currentMonthKey
    ];

}


function saveCurrentMonthData(data) {

    if (!currentUser.monthlyData) {

        currentUser.monthlyData = {};

    }


    currentUser.monthlyData[currentMonthKey] =
        data;


    currentUser.activeMonth =
        currentMonthKey;


    updateCurrentUser(
        currentUser
    );

}


/* =========================================================
   THEME
========================================================= */

const themeToggle =
    $("#themeToggle");

const themeIcon =
    $("#themeIcon");


function initializeTheme() {

    const saved =
        localStorage.getItem(
            STORAGE.theme
        );


    if (saved === "dark") {

        document.body.dataset.theme =
            "dark";

        themeIcon.textContent =
            "☾";

    } else {

        document.body.dataset.theme =
            "light";

        themeIcon.textContent =
            "☼";

    }


    themeToggle.addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    const current =
        document.body.dataset.theme;


    const next =
        current === "dark" ?
        "light" :
        "dark";


    document.body.dataset.theme =
        next;


    localStorage.setItem(
        STORAGE.theme,
        next
    );


    themeIcon.textContent =
        next === "dark" ?
        "☾" :
        "☼";


    showToast(
        next === "dark" ?
        "Dark mode enabled" :
        "Light mode enabled"
    );

}


/* =========================================================
   INITIALIZE APP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        initializeUser();

        initializeNavigation();

        initializeQuickActions();

        initializeIncome();

        initializeExpenses();

        initializeGoals();

        initializeLearning();

        initializeChallenge();

        initializeSearch();

        initializeBudgetBee();

        initializeProfileMenu();

        initializeMonths();

        initializeReview();

        initializeReflection();

        updateAllUI();

        checkOnboarding();

    }
);


/* =========================================================
   USER INITIALIZATION
========================================================= */

function initializeUser() {

    if (!currentUser) {

        return;

    }


    const firstName =
        currentUser.name ?
        currentUser.name.trim().split(" ")[0] || "there" :
        "there";


    $("#heroUserName").textContent =
        firstName;


    $("#sidebarUserName").textContent =
        currentUser.name;


    $("#sidebarAvatar").textContent =
        getInitials(currentUser.name);


    $("#headerAvatar").textContent =
        getInitials(currentUser.name);


    $("#profileMenuAvatar").textContent =
        getInitials(currentUser.name);


    $("#profileMenuName").textContent =
        currentUser.name;


    $("#profileMenuEmail").textContent =
        currentUser.email;


    updateDateUI();

}


function getInitials(name) {

    if (!name) {

        return "U";

    }


    const parts =
        name.trim().split(/\s+/);


    if (parts.length === 1) {

        return parts[0][0].toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   DATE
========================================================= */

function updateDateUI() {

    const now =
        new Date();


    const dateText =
        new Intl.DateTimeFormat(
            "en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        ).format(now);


    const heroDay =
        now.getDate();


    const heroMonth =
        new Intl.DateTimeFormat(
            "en-US", {
                month: "long"
            }
        ).format(now);


    $("#currentDate").textContent =
        dateText;


    $("#heroDate").textContent =
        heroDay;


    $("#heroMonth").textContent =
        heroMonth;

}


setInterval(
    updateDateUI,
    60000
);


/* =========================================================
   NAVIGATION
========================================================= */

const sectionTitles = {

    home: "My money",

    plan: "Plan my month",

    spending: "Spending",

    goals: "Savings goals",

    learn: "Learning Center",

    challenge: "Money Mission",

    insights: "Insights",

    review: "Monthly Review"

};


function initializeNavigation() {

    $$(".app-nav-link").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    openSection(
                        section
                    );

                    closeSidebar();

                }
            );

        }
    );


    $$("[data-section-target]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openSection(
                        button.dataset.sectionTarget
                    );

                }
            );

        }
    );


    $("#mobileMenuButton")
        .addEventListener(
            "click",
            openSidebar
        );


    $("#sidebarClose")
        .addEventListener(
            "click",
            closeSidebar
        );


    $("#sidebarOverlay")
        .addEventListener(
            "click",
            closeSidebar
        );

}


function openSection(section) {

    const target =
        $(`#section-${section}`);


    if (!target) {

        return;

    }


    $$(".app-section").forEach(
        sectionElement => {

            sectionElement.classList.remove(
                "active"
            );

        }
    );


    target.classList.add(
        "active"
    );


    $$(".app-nav-link").forEach(
        link => {

            link.classList.toggle(
                "active",
                link.dataset.section === section
            );

        }
    );


    $("#currentPageTitle").textContent =
        sectionTitles[section] ||
        "BudgetBasics";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    updateAllUI();

}


function openSidebar() {

    $("#sidebar")
        .classList.add("open");

    $("#sidebarOverlay")
        .classList.add("open");

}


function closeSidebar() {

    $("#sidebar")
        .classList.remove("open");

    $("#sidebarOverlay")
        .classList.remove("open");

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function initializeQuickActions() {

    $$("[data-action]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    handleQuickAction(
                        button.dataset.action
                    );

                }
            );

        }
    );

}


function handleQuickAction(action) {

    if (action === "income") {

        openModal("incomeModal");

        return;

    }


    if (action === "expense") {

        prepareExpenseDate();

        openModal("expenseModal");

        return;

    }


    if (action === "goal") {

        openModal("goalModal");

        return;

    }


    if (action === "learn") {

        openSection("learn");

        return;

    }

}


/* =========================================================
   INCOME
========================================================= */

function initializeIncome() {

    $("#incomeForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const amount =
                    Number(
                        $("#modalIncomeAmount").value
                    );


                saveIncome(
                    amount
                );

                closeModal(
                    "incomeModal"
                );

            }
        );


    $("#saveIncomeButton")
        .addEventListener(
            "click",
            () => {

                const amount =
                    Number(
                        $("#incomeInput").value
                    );


                saveIncome(
                    amount
                );

            }
        );

}


function saveIncome(amount) {

    if (!Number.isFinite(amount) ||
        amount <= 0
    ) {

        showToast(
            "Enter an income amount greater than zero."
        );

        return;

    }


    const data =
        getCurrentMonthData();


    data.income =
        amount;


    saveCurrentMonthData(
        data
    );


    $("#incomeInput").value =
        amount;


    $("#modalIncomeAmount").value =
        "";


    updateAllUI();


    showToast(
        "Monthly income saved."
    );

}


/* =========================================================
   EXPENSES
========================================================= */

function initializeExpenses() {

    $("#expenseForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const description =
                    $("#expenseDescription")
                    .value
                    .trim();


                const amount =
                    Number(
                        $("#expenseAmount")
                        .value
                    );


                const category =
                    $("#expenseCategory")
                    .value;


                const date =
                    $("#expenseDate")
                    .value;


                if (!description ||
                    amount <= 0 ||
                    !category ||
                    !date
                ) {

                    showToast(
                        "Please complete all expense fields."
                    );

                    return;

                }


                const data =
                    getCurrentMonthData();


                data.expenses.push({

                    id: generateId(),

                    description,

                    amount,

                    category,

                    date

                });


                saveCurrentMonthData(
                    data
                );


                event.target.reset();

                prepareExpenseDate();

                closeModal(
                    "expenseModal"
                );


                updateAllUI();


                showToast(
                    "Expense added."
                );

            }
        );


    $("#expenseSearch")
        .addEventListener(
            "input",
            renderExpenseTable
        );


    $("#expenseFilter")
        .addEventListener(
            "change",
            renderExpenseTable
        );

}


function prepareExpenseDate() {

    const today =
        new Date();


    const localDate =
        today.toISOString()
        .split("T")[0];


    $("#expenseDate").value =
        localDate;

}


function renderExpenseTable() {

    const data =
        getCurrentMonthData();


    const search =
        $("#expenseSearch")
        .value
        .trim()
        .toLowerCase();


    const filter =
        $("#expenseFilter")
        .value;


    let expenses = [...data.expenses];


    if (search) {

        expenses =
            expenses.filter(
                expense =>
                expense.description
                .toLowerCase()
                .includes(search)
            );

    }


    if (filter !== "all") {

        expenses =
            expenses.filter(
                expense =>
                expense.category === filter
            );

    }


    expenses.sort(
        (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


    const tbody =
        $("#expenseTableBody");


    if (expenses.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-empty"
                >
                    No matching expenses found.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        expenses
        .map(expense => `

                <tr>

                    <td>
                        ${formatDate(expense.date)}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(
                                expense.description
                            )}
                        </strong>
                    </td>

                    <td>

                        <span
                            class="table-category ${expense.category}"
                        >
                            ${capitalize(
                                expense.category
                            )}
                        </span>

                    </td>

                    <td>
                        ${formatCurrency(
                            expense.amount
                        )}
                    </td>

                    <td>

                        <button
                            class="delete-expense"
                            data-delete-expense="${expense.id}"
                            type="button"
                            aria-label="Delete expense"
                        >
                            ×
                        </button>

                    </td>

                </tr>

            `)
        .join("");


    $$("[data-delete-expense]")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteExpense(
                            button.dataset.deleteExpense
                        );

                    }
                );

            }
        );

}


function deleteExpense(id) {

    const data =
        getCurrentMonthData();


    data.expenses =
        data.expenses.filter(
            expense =>
            expense.id !== id
        );


    saveCurrentMonthData(
        data
    );


    updateAllUI();


    showToast(
        "Expense removed."
    );

}


/* =========================================================
   GOALS
========================================================= */

function initializeGoals() {

    $("#goalForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    $("#goalName")
                    .value
                    .trim();


                const target =
                    Number(
                        $("#goalTarget")
                        .value
                    );


                const current =
                    Number(
                        $("#goalCurrent")
                        .value
                    ) || 0;


                const monthly =
                    Number(
                        $("#goalMonthly")
                        .value
                    );


                if (!name ||
                    target <= 0 ||
                    current < 0 ||
                    monthly < 0
                ) {

                    showToast(
                        "Please enter valid goal details."
                    );

                    return;

                }


                if (current > target) {

                    showToast(
                        "Current savings cannot exceed the target."
                    );

                    return;

                }


                const data =
                    getCurrentMonthData();


                data.goals.push({

                    id: generateId(),

                    name,

                    target,

                    current,

                    monthly,

                    createdAt: new Date().toISOString()

                });


                saveCurrentMonthData(
                    data
                );


                event.target.reset();


                closeModal(
                    "goalModal"
                );


                updateAllUI();


                showToast(
                    "Savings goal created."
                );

            }
        );


    $("#goalsGrid")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-delete-goal]"
                    );


                if (!button) {

                    return;

                }


                deleteGoal(
                    button.dataset.deleteGoal
                );

            }
        );

}


function deleteGoal(id) {

    const data =
        getCurrentMonthData();


    data.goals =
        data.goals.filter(
            goal =>
            goal.id !== id
        );


    saveCurrentMonthData(
        data
    );


    updateAllUI();


    showToast(
        "Savings goal removed."
    );

}


function renderGoals() {

    const data =
        getCurrentMonthData();


    const container =
        $("#goalsGrid");


    if (data.goals.length === 0) {

        container.innerHTML = `

            <div class="goal-empty-large">

                <div class="empty-goal-icon large">
                    ↗
                </div>

                <h3>
                    Your first goal starts here.
                </h3>

                <p>
                    A laptop, emergency fund, school expense,
                    trip or something meaningful to you.
                </p>

                <button
                    class="primary-action"
                    data-action="goal"
                    type="button"
                >
                    Create savings goal →
                </button>

            </div>

        `;


        const button =
            container.querySelector(
                "[data-action='goal']"
            );


        button.addEventListener(
            "click",
            () => {

                openModal(
                    "goalModal"
                );

            }
        );


        return;

    }


    container.innerHTML =
        data.goals
        .map(goal => {

            const progress =
                calculateGoalProgress(
                    goal
                );


            const remaining =
                Math.max(
                    goal.target -
                    goal.current,
                    0
                );


            const months =
                goal.monthly > 0 ?
                Math.ceil(
                    remaining /
                    goal.monthly
                ) :
                null;


            return `

                    <article
                        class="goal-card"
                    >

                        <div class="goal-card-header">

                            <div>

                                <span>
                                    SAVINGS GOAL
                                </span>

                                <h3>
                                    ${escapeHtml(
                                        goal.name
                                    )}
                                </h3>

                            </div>

                            <button
                                class="goal-delete"
                                data-delete-goal="${goal.id}"
                                type="button"
                                aria-label="Delete goal"
                            >
                                ×
                            </button>

                        </div>


                        <div class="goal-amount">

                            <strong>
                                ${formatCurrency(
                                    goal.current
                                )}
                            </strong>

                            <span>
                                of ${formatCurrency(
                                    goal.target
                                )}
                            </span>

                        </div>


                        <div class="large-progress">

                            <span
                                style="width:${progress}%"
                            ></span>

                        </div>


                        <div class="goal-meta">

                            <span>
                                ${progress}% complete
                            </span>

                            <span>
                                ${formatCurrency(
                                    remaining
                                )} remaining
                            </span>

                        </div>


                        <div class="goal-details">

                            <div class="goal-detail">

                                <span>
                                    MONTHLY
                                </span>

                                <strong>
                                    ${formatCurrency(
                                        goal.monthly
                                    )}
                                </strong>

                            </div>


                            <div class="goal-detail">

                                <span>
                                    TIME LEFT
                                </span>

                                <strong>
                                    ${
                                        months === null
                                            ? "—"
                                            : months + " mo"
                                    }
                                </strong>

                            </div>


                            <div class="goal-detail">

                                <span>
                                    TARGET
                                </span>

                                <strong>
                                    ${formatCurrency(
                                        goal.target
                                    )}
                                </strong>

                            </div>

                        </div>

                    </article>

                `;

        })
        .join("");

}


function calculateGoalProgress(goal) {

    if (!goal.target ||
        goal.target <= 0
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.round(
            (goal.current /
                goal.target) *
            100
        )
    );

}


/* =========================================================
   LEARNING
========================================================= */

const lessons = {

    budget: {

        title: "Budgeting basics",

        tag: "FOUNDATIONS",

        time: "5 min",

        icon: "≋",

        body: "A budget is a plan for how you intend to use your money during a period. Start by understanding what comes in, what must go out, what is flexible, and what you want to save.",

        question: "What should you understand before building a budget?",

        answers: [

            {
                text: "Your income and expected expenses",

                correct: true
            },

            {
                text: "Only what you want to buy",

                correct: false
            },

            {
                text: "Nothing — just start spending",

                correct: false
            }

        ]

    },


    needs: {

        title: "Needs vs wants",

        tag: "SPENDING",

        time: "4 min",

        icon: "◇",

        body: "Needs are generally essential expenses. Wants are things you would like to have but may be flexible. The difference can help you make more deliberate spending decisions.",

        question: "Which question can help when deciding whether something is a want?",

        answers: [

            {
                text: "Can I delay this purchase?",

                correct: true
            },

            {
                text: "Is it expensive?",

                correct: false
            },

            {
                text: "Does everyone have it?",

                correct: false
            }

        ]

    },


    rule: {

        title: "50 / 30 / 20",

        tag: "PLANNING",

        time: "6 min",

        icon: "%",

        body: "The 50/30/20 framework is one educational starting point: 50% for needs, 30% for wants and 20% for savings or debt-related goals. It is a framework, not a universal rule.",

        question: "What does the 20% represent in this framework?",

        answers: [

            {
                text: "Savings or future-focused money",

                correct: true
            },

            {
                text: "Only entertainment",

                correct: false
            },

            {
                text: "All monthly expenses",

                correct: false
            }

        ]

    },


    saving: {

        title: "Savings goals",

        tag: "SAVING",

        time: "5 min",

        icon: "↗",

        body: "A savings goal turns a general wish into a specific target. Knowing the amount you need and how much you can contribute each month makes the timeline easier to understand.",

        question: "Which information is most useful when creating a savings goal?",

        answers: [

            {
                text: "Target amount and monthly contribution",

                correct: true
            },

            {
                text: "Only the name of the item",

                correct: false
            },

            {
                text: "How much your friend saved",

                correct: false
            }

        ]

    },


    mistakes: {

        title: "Money mistakes",

        tag: "HABITS",

        time: "5 min",

        icon: "!",

        body: "Common money mistakes include impulse buying, ignoring small repeated expenses, missing payment dates and paying for unused subscriptions. Awareness can help you design better habits.",

        question: "What is a useful response to impulse buying?",

        answers: [

            {
                text: "Pause and decide whether the purchase fits your plan",

                correct: true
            },

            {
                text: "Buy immediately before the price changes",

                correct: false
            },

            {
                text: "Ignore your budget",

                correct: false
            }

        ]

    },


    emergency: {

        title: "Emergency savings",

        tag: "PROTECTION",

        time: "4 min",

        icon: "+",

        body: "Unexpected expenses can disrupt a monthly plan. Building savings gradually can create a buffer for situations you did not expect.",

        question: "Why can emergency savings help?",

        answers: [

            {
                text: "It can provide a buffer for unexpected expenses",

                correct: true
            },

            {
                text: "It guarantees you will never have expenses",

                correct: false
            },

            {
                text: "It removes the need for budgeting",

                correct: false
            }

        ]

    }

};


let currentLesson =
    null;


function initializeLearning() {

    $$("[data-lesson-start]")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openLesson(
                            button.dataset.lessonStart
                        );

                    }
                );

            }
        );


    $("#lessonAnswers")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button || !currentLesson) {

                    return;

                }


                const index =
                    Number(
                        button.dataset.answerIndex
                    );


                const answer =
                    currentLesson.answers[index];


                if (!answer) {

                    return;

                }


                $$("#lessonAnswers button")
                    .forEach(
                        current => {

                            current.classList.remove(
                                "correct",
                                "wrong"
                            );

                        }
                    );


                if (answer.correct) {

                    button.classList.add(
                        "correct"
                    );


                    $("#lessonResult").innerHTML =
                        "✓ Correct. You connected the concept to a practical decision.";


                    $("#lessonResult")
                        .style.color =
                        "var(--success)";


                    $("#lessonDoneButton")
                        .classList.remove(
                            "hidden"
                        );

                } else {

                    button.classList.add(
                        "wrong"
                    );


                    $("#lessonResult").innerHTML =
                        "Not quite. Think about how this concept would help you make a real decision.";


                    $("#lessonResult")
                        .style.color =
                        "var(--coral)";

                }

            }
        );


    $("#lessonDoneButton")
        .addEventListener(
            "click",
            completeLesson
        );

}


function openLesson(key) {

    const lesson =
        lessons[key];


    if (!lesson) {

        return;

    }


    currentLesson =
        lesson;


    $("#lessonModalTag").textContent =
        lesson.tag;


    $("#lessonModalTime").textContent =
        lesson.time;


    $("#lessonModalIcon").textContent =
        lesson.icon;


    $("#lessonModalTitle").textContent =
        lesson.title;


    $("#lessonModalBody").textContent =
        lesson.body;


    $("#lessonQuestionText").textContent =
        lesson.question;


    $("#lessonResult").textContent =
        "";


    $("#lessonDoneButton")
        .classList.add(
            "hidden"
        );


    $("#lessonAnswers").innerHTML =
        lesson.answers
        .map(
            (answer, index) => `

                    <button
                        type="button"
                        data-answer-index="${index}"
                    >
                        ${escapeHtml(
                            answer.text
                        )}
                    </button>

                `
        )
        .join("");


    openModal(
        "lessonModal"
    );

}


function completeLesson() {

    if (!currentLesson) {

        return;

    }


    if (!currentUser.learning) {

        currentUser.learning = {};

    }


    const lessonKey =
        Object.keys(lessons)
        .find(
            key =>
            lessons[key] ===
            currentLesson
        );


    currentUser.learning[lessonKey] =
        true;


    updateCurrentUser(
        currentUser
    );


    closeModal(
        "lessonModal"
    );


    updateLearningProgress();


    showToast(
        "Lesson completed."
    );


    currentLesson =
        null;

}


function updateLearningProgress() {

    const progress =
        currentUser.learning || {};


    const completed =
        Object.values(progress)
        .filter(Boolean)
        .length;


    const total =
        Object.keys(lessons)
        .length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    $("#learningProgressText")
        .textContent =
        percentage + "%";


    $("#learningProgressBar")
        .style.width =
        percentage + "%";

}


/* =========================================================
   MONEY MISSION
========================================================= */

const missionSteps = [

    {

        title: "Your first money decision",

        scenario: "You receive your monthly income. Your rent and transport are due, but your friend invites you out. What do you do first?",

        correct: "needs",

        correctText: "Pay essential expenses first.",

        feedback: "Good decision. Essential expenses generally deserve attention before flexible spending. You can then see what remains for wants and savings."

    },

    {

        title: "A tempting purchase",

        scenario: "You have already planned your essentials. You see a pair of shoes you like, but buying them would use money you planned to save. What do you do?",

        correct: "wants",

        correctText: "Pause and compare the purchase with your savings goal.",

        feedback: "Good thinking. A want is not automatically bad. The useful question is whether the purchase fits the plan and the goal you care about."

    },

    {

        title: "Small expenses",

        scenario: "You notice several small food purchases during the month. None looked large on its own. Together, they are much more than you expected.",

        correct: "needs",

        correctText: "Review the pattern before deciding what to change.",

        feedback: "Exactly. Small repeated expenses can add up. Tracking them first helps you make a decision based on the actual pattern."

    },

    {

        title: "Unexpected expense",

        scenario: "An unexpected school expense appears. Your monthly plan has very little flexibility left.",

        correct: "split",

        correctText: "Review your flexible spending and savings before making the decision.",

        feedback: "A flexible plan gives you room to respond. Looking at wants and available savings can help you decide what adjustment makes sense."

    },

    {

        title: "Month-end decision",

        scenario: "You reach the end of the fictional month with some money remaining. What is a useful next step?",

        correct: "needs",

        correctText: "Review the month and decide what the remaining money should do.",

        feedback: "Great. A monthly review helps turn the previous month's numbers into information for the next plan."

    }

];


let missionIndex =
    0;

let missionXP =
    0;


function initializeChallenge() {

    $$("#missionOptions button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        answerMission(
                            button.dataset.choice
                        );

                    }
                );

            }
        );


    $("#missionNext")
        .addEventListener(
            "click",
            nextMission
        );

}


function renderMission() {

    const mission =
        missionSteps[missionIndex];


    if (!mission) {

        finishMission();

        return;

    }


    $("#missionTitle").textContent =
        mission.title;


    $("#missionQuestion").innerHTML = `

        <span>
            SCENARIO
        </span>

        <h3>
            ${mission.scenario}
        </h3>

    `;


    $("#missionProgress").textContent =
        `${missionIndex + 1} / ${missionSteps.length}`;


    $("#missionRemaining").textContent =
        formatCurrency(
            120000 -
            (missionIndex * 15000)
        );


    $("#missionFeedback")
        .className =
        "mission-feedback";


    $("#missionFeedback")
        .textContent =
        "";


    $("#missionNext")
        .classList.add(
            "hidden"
        );


    $$("#missionOptions button")
        .forEach(
            button => {

                button.disabled =
                    false;

                button.style.opacity =
                    "1";

            }
        );

}


function answerMission(choice) {

    const mission =
        missionSteps[missionIndex];


    if (!mission) {

        return;

    }


    $$("#missionOptions button")
        .forEach(
            button => {

                button.disabled =
                    true;

                if (
                    button.dataset.choice !==
                    choice
                ) {

                    button.style.opacity =
                        ".55";

                }

            }
        );


    const feedback =
        $("#missionFeedback");


    if (choice === mission.correct) {

        missionXP += 20;


        feedback.className =
            "mission-feedback show correct";


        feedback.innerHTML =
            `<strong>Good choice.</strong><br>${mission.feedback}`;

    } else {

        missionXP += 5;


        feedback.className =
            "mission-feedback show warning";


        feedback.innerHTML =
            `<strong>Think it through.</strong><br>${mission.feedback}`;

    }


    $("#challengeXP").textContent =
        missionXP;


    $("#missionNext")
        .classList.remove(
            "hidden"
        );

}


function nextMission() {

    missionIndex++;

    renderMission();

}


function finishMission() {

    $("#missionQuestion").innerHTML = `

        <span>
            MISSION COMPLETE
        </span>

        <h3>
            You completed the Money Mission.
            Your score is a reflection of learning,
            not your personal wealth.
        </h3>

    `;


    $("#missionOptions")
        .innerHTML =
        "";


    $("#missionFeedback")
        .className =
        "mission-feedback show correct";


    $("#missionFeedback")
        .innerHTML =
        `<strong>+${missionXP} XP</strong><br>Review what each decision taught you and try the mission again later.`;


    $("#missionNext")
        .classList.add(
            "hidden"
        );

}


renderMission();


/* =========================================================
   SEARCH
========================================================= */

const searchItems = [

    {
        title: "Budgeting basics",

        type: "Lesson",

        keywords: "budget budgeting income expenses plan",

        section: "learn"
    },

    {
        title: "Needs vs wants",

        type: "Lesson",

        keywords: "needs wants spending purchase",

        section: "learn"
    },

    {
        title: "50 / 30 / 20",

        type: "Planner",

        keywords: "50 30 20 needs wants savings rule",

        section: "plan"
    },

    {
        title: "Savings goals",

        type: "Goals",

        keywords: "save savings target goal contribution",

        section: "goals"
    },

    {
        title: "Expense planner",

        type: "Spending",

        keywords: "expense spending transaction category",

        section: "spending"
    },

    {
        title: "Money Mission",

        type: "Game",

        keywords: "game challenge scenario choices",

        section: "challenge"
    },

    {
        title: "Monthly insights",

        type: "Insights",

        keywords: "insight spending pattern chart",

        section: "insights"
    },

    {
        title: "Monthly Review",

        type: "Review",

        keywords: "review month summary reflection",

        section: "review"
    }

];


function initializeSearch() {

    $("#globalSearchButton")
        .addEventListener(
            "click",
            () => {

                openModal(
                    "searchModal"
                );


                setTimeout(
                    () => {

                        $("#globalSearchInput")
                            .focus();

                    },
                    150
                );

            }
        );


    $("#globalSearchInput")
        .addEventListener(
            "input",
            renderSearchResults
        );


    $("#searchResults")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-search-section]"
                    );


                if (!button) {

                    return;

                }


                closeModal(
                    "searchModal"
                );


                openSection(
                    button.dataset.searchSection
                );

            }
        );

}


function renderSearchResults() {

    const query =
        $("#globalSearchInput")
        .value
        .trim()
        .toLowerCase();


    const container =
        $("#searchResults");


    if (!query) {

        container.innerHTML = `

            <div class="search-empty">
                Start typing to search your workspace.
            </div>

        `;

        return;

    }


    const results =
        searchItems.filter(
            item => {

                const searchable =
                    (
                        item.title +
                        " " +
                        item.type +
                        " " +
                        item.keywords
                    ).toLowerCase();


                return searchable.includes(
                    query
                );

            }
        );


    if (!results.length) {

        container.innerHTML = `

            <div class="search-empty">
                No results found for
                “${escapeHtml(query)}”.
            </div>

        `;

        return;

    }


    container.innerHTML =
        results
        .map(
            item => `

                    <div class="search-result">

                        <div>

                            <strong>
                                ${item.title}
                            </strong>

                            <span>
                                ${item.type}
                            </span>

                        </div>

                        <button
                            data-search-section="${item.section}"
                            type="button"
                        >
                            Open
                        </button>

                    </div>

                `
        )
        .join("");

}


/* =========================================================
   BUDGETBEE
========================================================= */

function initializeBudgetBee() {

    $("#beeFloatingButton")
        .addEventListener(
            "click",
            openBudgetBee
        );


    $("#sidebarBeeButton")
        .addEventListener(
            "click",
            openBudgetBee
        );


    $("#homeBeeButton")
        .addEventListener(
            "click",
            openBudgetBee
        );


    $("#reviewBeeButton")
        .addEventListener(
            "click",
            openBudgetBee
        );


    $("#beeClose")
        .addEventListener(
            "click",
            closeBudgetBee
        );


    $("#beeForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    $("#beeInput");

                const question =
                    input.value.trim();


                if (!question) {

                    return;

                }


                addBeeUserMessage(
                    question
                );


                input.value =
                    "";


                setTimeout(
                    () => {

                        answerBee(
                            question
                        );

                    },
                    350
                );

            }
        );


    $$(".bee-suggestions button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const question =
                            button.textContent.trim();


                        addBeeUserMessage(
                            question
                        );


                        setTimeout(
                            () => {

                                answerBee(
                                    question
                                );

                            },
                            250
                        );

                    }
                );

            }
        );

}


function openBudgetBee() {

    $("#beePanel")
        .classList.add(
            "open"
        );


    $("#beePanel")
        .setAttribute(
            "aria-hidden",
            "false"
        );


    setTimeout(
        () => {

            $("#beeInput")
                .focus();

        },
        350
    );

}


function closeBudgetBee() {

    $("#beePanel")
        .classList.remove(
            "open"
        );


    $("#beePanel")
        .setAttribute(
            "aria-hidden",
            "true"
        );

}


function addBeeUserMessage(message) {

    const chat =
        $("#beeChat");


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "bee-user-message";


    element.textContent =
        message;


    chat.appendChild(
        element
    );


    chat.scrollTop =
        chat.scrollHeight;

}


function addBeeMessage(message, actions = []) {

    const chat =
        $("#beeChat");


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "bee-message bubble";


    wrapper.innerHTML =
        message;


    chat.appendChild(
        wrapper
    );


    if (actions.length) {

        const actionWrap =
            document.createElement(
                "div"
            );


        actionWrap.style.display =
            "flex";


        actionWrap.style.flexWrap =
            "wrap";


        actionWrap.style.gap =
            "6px";


        actionWrap.style.marginTop =
            "8px";


        actions.forEach(
            action => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.textContent =
                    action.label;


                button.style.padding =
                    "7px 9px";


                button.style.borderRadius =
                    "8px";


                button.style.border =
                    "1px solid var(--border)";


                button.style.background =
                    "var(--surface)";


                button.style.color =
                    "var(--blue)";


                button.style.fontSize =
                    "7px";


                button.style.fontWeight =
                    "800";


                button.addEventListener(
                    "click",
                    () => {

                        openSection(
                            action.section
                        );

                        closeBudgetBee();

                    }
                );


                actionWrap.appendChild(
                    button
                );

            }
        );


        wrapper.appendChild(
            actionWrap
        );

    }


    chat.scrollTop =
        chat.scrollHeight;

}


function answerBee(question) {

    const q =
        question.toLowerCase();


    if (
        q.includes("budget") ||
        q.includes("plan")
    ) {

        addBeeMessage(
            "A good place to start is your <strong>Plan my month</strong> section. Add your income, then use the 50/30/20 framework as a starting point. You can adjust the plan to your actual situation.", [{
                    label: "Open planner",
                    section: "plan"
                },
                {
                    label: "Learn budgeting",
                    section: "learn"
                }
            ]
        );

        return;

    }


    if (
        q.includes("50") ||
        q.includes("30") ||
        q.includes("20")
    ) {

        addBeeMessage(
            "The 50/30/20 framework divides a starting budget into roughly 50% needs, 30% wants and 20% savings. It is an educational framework, not a universal rule.", [{
                label: "Open calculator",
                section: "plan"
            }]
        );

        return;

    }


    if (
        q.includes("save") ||
        q.includes("saving") ||
        q.includes("goal")
    ) {

        addBeeMessage(
            "Try creating a savings goal. Give it a target amount and monthly contribution. BudgetBasics will calculate the remaining amount and an estimated timeline.", [{
                    label: "Open goals",
                    section: "goals"
                },
                {
                    label: "Learn savings",
                    section: "learn"
                }
            ]
        );

        return;

    }


    if (
        q.includes("expense") ||
        q.includes("spending") ||
        q.includes("spent")
    ) {

        addBeeMessage(
            "You can record expenses in <strong>Spending</strong>. Add a description, amount, category and date. Once you have some entries, you'll see category patterns and insights.", [{
                    label: "Add expenses",
                    section: "spending"
                },
                {
                    label: "See insights",
                    section: "insights"
                }
            ]
        );

        return;

    }


    if (
        q.includes("need") ||
        q.includes("want")
    ) {

        addBeeMessage(
            "Needs are generally essential expenses while wants are usually more flexible. The useful question is not simply whether something is a want — it is whether the purchase fits your priorities and plan.", [{
                label: "Learn needs vs wants",
                section: "learn"
            }]
        );

        return;

    }


    if (
        q.includes("game") ||
        q.includes("challenge") ||
        q.includes("mission")
    ) {

        addBeeMessage(
            "Money Mission lets you practice fictional money decisions and see the educational consequence of your choices.", [{
                label: "Play Money Mission",
                section: "challenge"
            }]
        );

        return;

    }


    if (
        q.includes("month") ||
        q.includes("review")
    ) {

        addBeeMessage(
            "Your Monthly Review helps you look at income, spending, savings and your biggest category before starting the next month.", [{
                label: "Open review",
                section: "review"
            }]
        );

        return;

    }


    addBeeMessage(
        "I can help you navigate BudgetBasics and explain topics such as budgeting, 50/30/20, needs vs wants, expenses, savings goals, Money Mission and monthly reviews. Try asking me one of those."
    );

}


/* =========================================================
   PROFILE
========================================================= */

function initializeProfileMenu() {

    $("#profileButton")
        .addEventListener(
            "click",
            toggleProfileMenu
        );


    $("#headerAvatar")
        .addEventListener(
            "click",
            toggleProfileMenu
        );


    $("#profileSettingsButton")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "Profile settings can be expanded in the next phase."
                );


                closeProfileMenu();

            }
        );


    $("#logoutButton")
        .addEventListener(
            "click",
            logout
        );


    document.addEventListener(
        "click",
        event => {

            const menu =
                $("#profileMenu");


            if (!menu.contains(event.target) &&
                event.target !== $("#profileButton") &&
                event.target !== $("#headerAvatar")
            ) {

                closeProfileMenu();

            }

        }
    );

}


function toggleProfileMenu(event) {

    event.stopPropagation();


    $("#profileMenu")
        .classList.toggle(
            "open"
        );

}


function closeProfileMenu() {

    $("#profileMenu")
        .classList.remove(
            "open"
        );

}


function logout() {

    localStorage.removeItem(
        STORAGE.session
    );


    window.location.href =
        "index.html";

}


/* =========================================================
   MONTHS
========================================================= */

function initializeMonths() {

    $("#workspaceSwitcher")
        .addEventListener(
            "click",
            openMonthModal
        );


    $("#monthModalClose")
        .addEventListener(
            "click",
            () =>
            closeModal(
                "monthModal"
            )
        );


    $("#createNextMonth")
        .addEventListener(
            "click",
            createNextMonth
        );

}


function openMonthModal() {

    renderMonthList();

    openModal(
        "monthModal"
    );

}


function renderMonthList() {

    const container =
        $("#monthList");


    const months =
        Object.keys(
            currentUser.monthlyData || {}
        ).sort().reverse();


    if (!months.includes(currentMonthKey)) {

        months.unshift(
            currentMonthKey
        );

    }


    container.innerHTML =
        months
        .map(
            key => `

                    <button
                        class="month-option ${
                            key === currentMonthKey
                                ? "active"
                                : ""
                        }"
                        data-month="${key}"
                        type="button"
                    >

                        <span>
                            ${getMonthName(key)}
                        </span>

                        ${
                            key === currentMonthKey
                                ? "Current"
                                : "Open"
                        }

                    </button>

                `
        )
        .join("");


    $$(".month-option")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        switchMonth(
                            button.dataset.month
                        );

                    }
                );

            }
        );

}


function switchMonth(monthKey) {

    if (!currentUser.monthlyData[monthKey]) {

        currentUser.monthlyData[monthKey] =
            createEmptyMonth();

    }


    currentMonthKey =
        monthKey;


    currentUser.activeMonth =
        monthKey;


    updateCurrentUser(
        currentUser
    );


    closeModal(
        "monthModal"
    );


    updateAllUI();


    showToast(
        `${getMonthName(monthKey)} workspace opened.`
    );

}


function createNextMonth() {

    const [
        year,
        month
    ] =
    currentMonthKey
        .split("-")
        .map(Number);


    const nextDate =
        new Date(
            year,
            month,
            1
        );


    const nextKey =
        getMonthKey(
            nextDate
        );


    if (
        currentUser.monthlyData[nextKey]
    ) {

        switchMonth(
            nextKey
        );

        return;

    }


    currentUser.monthlyData[nextKey] =
        createEmptyMonth();


    currentMonthKey =
        nextKey;


    currentUser.activeMonth =
        nextKey;


    updateCurrentUser(
        currentUser
    );


    closeModal(
        "monthModal"
    );


    updateAllUI();


    showToast(
        `${getMonthName(nextKey)} started fresh.`
    );

}


/* =========================================================
   REVIEW
========================================================= */

function initializeReview() {

    $("#newMonthButton")
        .addEventListener(
            "click",
            createNextMonth
        );


    $("#newMonthButtonBottom")
        .addEventListener(
            "click",
            createNextMonth
        );

}


function renderReview() {

    const data =
        getCurrentMonthData();


    const spent =
        calculateSpent(data);


    const saved =
        calculateSaved(data);


    const remaining =
        Math.max(
            data.income -
            spent,
            0
        );


    $("#reviewIncome").textContent =
        formatCurrency(
            data.income
        );


    $("#reviewSpent").textContent =
        formatCurrency(
            spent
        );


    $("#reviewSaved").textContent =
        formatCurrency(
            saved
        );


    $("#reviewRemaining").textContent =
        formatCurrency(
            remaining
        );


    const category =
        getTopCategory(
            data.expenses
        );


    if (!category) {

        $("#reviewTopCategory")
            .textContent =
            "No spending yet";


        $("#reviewTopCategoryAmount")
            .textContent =
            "Add expenses to see your biggest category.";


        $("#reviewCategoryIcon")
            .textContent =
            "—";

    } else {

        $("#reviewTopCategory")
            .textContent =
            capitalize(
                category.name
            );


        $("#reviewTopCategoryAmount")
            .textContent =
            `${formatCurrency(
                category.amount
            )} spent this month`;


        $("#reviewCategoryIcon")
            .textContent =
            category.name
            .charAt(0)
            .toUpperCase();

    }


    if (data.income === 0) {

        $("#reviewBeeText")
            .textContent =
            "Add your monthly income first. Your review becomes more useful once there are numbers to reflect on.";

    } else if (spent === 0) {

        $("#reviewBeeText")
            .textContent =
            "You have income recorded but no expenses yet. Add a few real entries so your month can tell you something.";

    } else if (spent > data.income) {

        $("#reviewBeeText")
            .textContent =
            "Your recorded spending is above your income. Review the expense list and identify which flexible categories you can reconsider.";

    } else {

        $("#reviewBeeText")
            .textContent =
            "A month does not have to be perfect. Look at the biggest category and choose one small improvement for your next plan.";

    }

}


/* =========================================================
   REFLECTION
========================================================= */

function initializeReflection() {

    $$(".reflection-options button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        $$(".reflection-options button")
                            .forEach(
                                item =>
                                item.classList.remove(
                                    "selected"
                                )
                            );


                        button.classList.add(
                            "selected"
                        );


                        showToast(
                            "Reflection saved for this session."
                        );

                    }
                );

            }
        );

}


/* =========================================================
   UPDATE ALL UI
========================================================= */

function updateAllUI() {

    if (!currentUser) {

        return;

    }


    const data =
        getCurrentMonthData();


    $("#workspaceMonthLabel")
        .textContent =
        getMonthName(
            currentMonthKey
        );


    const spent =
        calculateSpent(data);


    const saved =
        calculateSaved(data);


    const remaining =
        data.income -
        spent;


    $("#overviewIncome")
        .textContent =
        formatCurrency(
            data.income
        );


    $("#overviewSpent")
        .textContent =
        formatCurrency(
            spent
        );


    $("#overviewSaved")
        .textContent =
        formatCurrency(
            saved
        );


    $("#overviewRemaining")
        .textContent =
        formatCurrency(
            Math.max(
                remaining,
                0
            )
        );


    $("#spendingTotal")
        .textContent =
        formatCurrency(
            spent
        );


    $("#transactionCount")
        .textContent =
        data.expenses.length;


    const topCategory =
        getTopCategory(
            data.expenses
        );


    $("#topCategory")
        .textContent =
        topCategory ?
        capitalize(
            topCategory.name
        ) :
        "—";


    updateBudgetPlanner(
        data
    );


    updateHealth(
        data
    );


    updateHomeGoal(
        data
    );


    renderGoals();

    renderExpenseTable();

    renderCategoryList(
        data
    );

    renderInsights(
        data
    );

    renderReview();

    updateLearningProgress();

    updateNextStep(
        data
    );


    $("#incomeInput").value =
        data.income || "";


    $("#plannerIncome").textContent =
        formatCurrency(
            data.income
        );


    $("#reviewIncome").textContent =
        formatCurrency(
            data.income
        );

}


/* =========================================================
   BUDGET PLANNER
========================================================= */

function updateBudgetPlanner(data) {

    const income =
        data.income || 0;


    const needs =
        income * .50;


    const wants =
        income * .30;


    const savings =
        income * .20;


    $("#plannerNeeds")
        .textContent =
        formatCurrency(
            needs
        );


    $("#plannerWants")
        .textContent =
        formatCurrency(
            wants
        );


    $("#plannerSavings")
        .textContent =
        formatCurrency(
            savings
        );


    $("#sideNeeds")
        .textContent =
        formatCurrency(
            needs
        );


    $("#sideWants")
        .textContent =
        formatCurrency(
            wants
        );


    $("#sideSavings")
        .textContent =
        formatCurrency(
            savings
        );


    $("#needsBar")
        .style.width =
        "50%";


    $("#wantsBar")
        .style.width =
        "30%";


    $("#savingsBar")
        .style.width =
        "20%";

}


/* =========================================================
   HEALTH
========================================================= */

function updateHealth(data) {

    const income =
        data.income;


    const spent =
        calculateSpent(data);


    const saved =
        calculateSaved(data);


    let percentage =
        0;


    if (income > 0) {

        percentage =
            Math.min(
                100,
                Math.round(
                    ((spent + saved) /
                        income) *
                    100
                )
            );

    }


    $(".health-ring")
        .style
        .setProperty(
            "--health-progress",
            `${percentage}%`
        );


    $("#healthPercent")
        .textContent =
        percentage + "%";


    let status =
        "Add your income";


    let message =
        "Once you add income and spending, BudgetBasics will help you understand your month.";


    let statusColor =
        "var(--yellow)";


    if (income > 0 && spent === 0) {

        status =
            "Plan your month";

        message =
            "Your income is ready. Add your planned spending and savings goals next.";

        statusColor =
            "var(--blue)";

    }


    if (
        income > 0 &&
        spent > 0 &&
        spent <= income
    ) {

        status =
            "You have room";

        message =
            "Your recorded spending is within your income. Keep reviewing where the money is going.";

        statusColor =
            "var(--mint)";

    }


    if (
        income > 0 &&
        spent > income
    ) {

        status =
            "Review your spending";

        message =
            "Your recorded expenses are above this month's income. Look at the categories before deciding what to change.";

        statusColor =
            "var(--coral)";

    }


    $("#healthStatus")
        .textContent =
        status;


    $("#healthMessage")
        .textContent =
        message;


    $("#healthStatusDot")
        .style.background =
        statusColor;


    const categoryTotals =
        getCategoryTotals(
            data.expenses
        );


    const total =
        Object.values(
            categoryTotals
        )
        .reduce(
            (sum, value) =>
            sum + value,
            0
        );


    const needsPercentage =
        total ?
        Math.round(
            ((categoryTotals.needs || 0) /
                total) *
            100
        ) :
        0;


    const wantsPercentage =
        total ?
        Math.round(
            ((categoryTotals.wants || 0) /
                total) *
            100
        ) :
        0;


    const savingsPercentage =
        total ?
        Math.round(
            ((categoryTotals.savings || 0) /
                total) *
            100
        ) :
        0;


    $("#healthNeeds")
        .textContent =
        needsPercentage + "%";


    $("#healthWants")
        .textContent =
        wantsPercentage + "%";


    $("#healthSavings")
        .textContent =
        savingsPercentage + "%";

}


/* =========================================================
   HOME GOAL
========================================================= */

function updateHomeGoal(data) {

    const goal =
        data.goals[0];


    if (!goal) {

        $("#homeGoalEmpty")
            .classList.remove(
                "hidden"
            );


        $("#homeGoalContent")
            .classList.add(
                "hidden"
            );


        $("#homeGoalName")
            .textContent =
            "No goal yet";


        return;

    }


    $("#homeGoalEmpty")
        .classList.add(
            "hidden"
        );


    $("#homeGoalContent")
        .classList.remove(
            "hidden"
        );


    const progress =
        calculateGoalProgress(
            goal
        );


    const remaining =
        Math.max(
            goal.target -
            goal.current,
            0
        );


    const months =
        goal.monthly > 0 ?
        Math.ceil(
            remaining /
            goal.monthly
        ) :
        null;


    $("#homeGoalName")
        .textContent =
        goal.name;


    $("#homeGoalCurrent")
        .textContent =
        formatCurrency(
            goal.current
        );


    $("#homeGoalTarget")
        .textContent =
        "of " +
        formatCurrency(
            goal.target
        );


    $("#homeGoalProgress")
        .style.width =
        progress + "%";


    $("#homeGoalRemaining")
        .textContent =
        formatCurrency(
            remaining
        ) +
        " remaining";


    $("#homeGoalMonths")
        .textContent =
        months === null ?
        "No timeline" :
        `${months} months`;

}


/* =========================================================
   CATEGORY LIST
========================================================= */

function renderCategoryList(data) {

    const container =
        $("#homeCategoryList");


    const totals =
        getCategoryTotals(
            data.expenses
        );


    const entries =
        Object.entries(
            totals
        )
        .filter(
            ([, amount]) =>
            amount > 0
        )
        .sort(
            (a, b) =>
            b[1] - a[1]
        );


    if (!entries.length) {

        container.innerHTML = `

            <div class="empty-state-small">
                Add expenses to see your categories.
            </div>

        `;

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                ([, amount]) =>
                amount
            )
        );


    const categoryColors = {

        needs: "var(--blue)",

        wants: "var(--coral)",

        savings: "var(--mint)"

    };


    container.innerHTML =
        entries
        .map(
            ([category, amount]) => `

                    <div class="category-row">

                        <span class="category-name">
                            ${capitalize(
                                category
                            )}
                        </span>

                        <div class="category-track">

                            <span
                                style="
                                    width:${Math.max(
                                        5,
                                        (amount / max) * 100
                                    )}%;
                                    background:${
                                        categoryColors[
                                            category
                                        ]
                                    };
                                "
                            ></span>

                        </div>

                        <span class="category-amount">
                            ${formatCurrency(
                                amount
                            )}
                        </span>

                    </div>

                `
        )
        .join("");

}


/* =========================================================
   INSIGHTS
========================================================= */

function renderInsights(data) {

    const totals =
        getCategoryTotals(
            data.expenses
        );


    const entries =
        Object.entries(
            totals
        )
        .filter(
            ([, amount]) =>
            amount > 0
        )
        .sort(
            (a, b) =>
            b[1] - a[1]
        );


    const chart =
        $("#insightCategoryChart");


    if (!entries.length) {

        chart.innerHTML = `

            <div class="chart-empty">
                Add expenses to build your chart.
            </div>

        `;


        $("#insightBeeTitle")
            .textContent =
            "Your first insight is waiting.";


        $("#insightBeeText")
            .textContent =
            "Once you record some expenses, BudgetBee can help you spot the category taking the most space.";

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                ([, amount]) =>
                amount
            )
        );


    const colors = {

        needs: "var(--blue)",

        wants: "var(--coral)",

        savings: "var(--mint)"

    };


    chart.innerHTML =
        entries
        .map(
            ([category, amount]) => {

                const height =
                    Math.max(
                        8,
                        (amount / max) *
                        190
                    );


                return `

                        <div
                            class="chart-bar-wrapper"
                        >

                            <span class="chart-value">
                                ${formatCurrency(
                                    amount
                                )}
                            </span>

                            <div
                                class="chart-bar"
                                style="
                                    height:${height}px;
                                    background:${
                                        colors[
                                            category
                                        ]
                                    };
                                "
                            ></div>

                            <span class="chart-label">
                                ${capitalize(
                                    category
                                )}
                            </span>

                        </div>

                    `;

            }
        )
        .join("");


    const top =
        entries[0];


    $("#insightBeeTitle")
        .textContent =
        `${capitalize(
            top[0]
        )} is your largest category.`;


    $("#insightBeeText")
        .textContent =
        `You recorded ${formatCurrency(
            top[1]
        )} in ${top[0]} spending this month. Review the entries before deciding whether anything needs to change.`;

}


/* =========================================================
   NEXT STEP
========================================================= */

function updateNextStep(data) {

    const title =
        $("#nextStepTitle");


    const text =
        $("#nextStepText");


    const button =
        $("#nextStepButton");


    if (data.income === 0) {

        title.textContent =
            "Give your income a purpose.";


        text.textContent =
            "Add your monthly income to start building your plan.";


        button.textContent =
            "Add income →";


        button.onclick =
            () =>
            openModal(
                "incomeModal"
            );


        $("#homeBeeMessage")
            .textContent =
            "Start by adding your monthly income. Then I'll help you decide what to look at next.";

        return;

    }


    if (data.expenses.length === 0) {

        title.textContent =
            "Record your first expense.";


        text.textContent =
            "A few real entries will make your monthly picture much clearer.";


        button.textContent =
            "Add expense →";


        button.onclick =
            () =>
            handleQuickAction(
                "expense"
            );


        $("#homeBeeMessage")
            .textContent =
            "Your income is ready. Add a few expenses and I'll help you spot your spending pattern.";

        return;

    }


    if (data.goals.length === 0) {

        title.textContent =
            "Give your savings a destination.";


        text.textContent =
            "Create a savings goal and turn your next step into a measurable target.";


        button.textContent =
            "Create goal →";


        button.onclick =
            () =>
            openModal(
                "goalModal"
            );


        $("#homeBeeMessage")
            .textContent =
            "You've started tracking money. Now consider giving some of it a future purpose.";

        return;

    }


    title.textContent =
        "Review what your numbers are telling you.";


    text.textContent =
        "Open Insights or Monthly Review and choose one thing to improve.";


    button.textContent =
        "Review month →";


    button.onclick =
        () =>
        openSection(
            "review"
        );


    $("#homeBeeMessage")
        .textContent =
        "You have the basics in place. Your next useful step is reflection — look at your biggest category and your savings progress.";

}


/* =========================================================
   ONBOARDING
========================================================= */

function checkOnboarding() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const setup =
        params.get("setup");


    if (
        setup === "true" &&
        currentUser &&
        !currentUser.onboardingComplete
    ) {

        showOnboardingWizard();

    }

}


function showOnboardingWizard() {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "onboardingOverlay";


    overlay.innerHTML = `

        <div class="onboarding-modal">

            <div class="onboarding-brand">

                <div class="app-logo">
                    B
                </div>

                <strong>
                    BudgetBasics
                </strong>

            </div>


            <div class="onboarding-progress">

                <span
                    id="onboardingProgress"
                    style="width:25%;"
                ></span>

            </div>


            <div
                class="onboarding-step active"
                data-step="1"
            >

                <span class="onboarding-kicker">
                    STEP 1 OF 4
                </span>

                <h2>
                    Let's make this space yours.
                </h2>

                <p>
                    We'll ask a few questions so your BudgetBasics
                    experience starts with context.
                </p>


                <label>

                    What should we call you?

                    <input
                        id="onboardingName"
                        type="text"
                        value="${escapeHtml(
                            currentUser.name
                        )}"
                        placeholder="Your name"
                    >

                </label>

            </div>


            <div
                class="onboarding-step"
                data-step="2"
            >

                <span class="onboarding-kicker">
                    STEP 2 OF 4
                </span>

                <h2>
                    What do you want to improve?
                </h2>

                <p>
                    Choose the areas that matter most to you.
                </p>


                <div class="onboarding-options">

                    <button
                        type="button"
                        data-goal="budgeting"
                    >
                        <strong>
                            Budgeting
                        </strong>

                        <span>
                            Plan where my money goes
                        </span>
                    </button>


                    <button
                        type="button"
                        data-goal="saving"
                    >
                        <strong>
                            Saving
                        </strong>

                        <span>
                            Build better savings habits
                        </span>
                    </button>


                    <button
                        type="button"
                        data-goal="spending"
                    >
                        <strong>
                            Spending
                        </strong>

                        <span>
                            Understand where money goes
                        </span>
                    </button>


                    <button
                        type="button"
                        data-goal="learning"
                    >
                        <strong>
                            Money knowledge
                        </strong>

                        <span>
                            Understand financial basics
                        </span>
                    </button>

                </div>

            </div>


            <div
                class="onboarding-step"
                data-step="3"
            >

                <span class="onboarding-kicker">
                    STEP 3 OF 4
                </span>

                <h2>
                    What's your main goal?
                </h2>

                <p>
                    Pick the one outcome you want to focus on first.
                </p>


                <div class="onboarding-goal-options">

                    <button
                        type="button"
                        data-main-goal="emergency"
                    >
                        Build an emergency fund
                    </button>

                    <button
                        type="button"
                        data-main-goal="school"
                    >
                        Prepare for school expenses
                    </button>

                    <button
                        type="button"
                        data-main-goal="purchase"
                    >
                        Save for a purchase
                    </button>

                    <button
                        type="button"
                        data-main-goal="habit"
                    >
                        Build better money habits
                    </button>

                </div>

            </div>


            <div
                class="onboarding-step"
                data-step="4"
            >

                <span class="onboarding-kicker">
                    STEP 4 OF 4
                </span>

                <h2>
                    Add your starting numbers.
                </h2>

                <p>
                    These can be estimates. You can change them later.
                </p>


                <label>

                    Monthly income

                    <div class="onboarding-currency">

                        <span>
                            ₦
                        </span>

                        <input
                            id="onboardingIncome"
                            type="number"
                            min="0"
                            placeholder="0"
                        >

                    </div>

                </label>


                <label>

                    Current savings

                    <div class="onboarding-currency">

                        <span>
                            ₦
                        </span>

                        <input
                            id="onboardingSavings"
                            type="number"
                            min="0"
                            placeholder="0"
                        >

                    </div>

                </label>


                <label>

                    First savings target

                    <div class="onboarding-currency">

                        <span>
                            ₦
                        </span>

                        <input
                            id="onboardingTarget"
                            type="number"
                            min="0"
                            placeholder="Optional"
                        >

                    </div>

                </label>

            </div>


            <div class="onboarding-actions">

                <button
                    type="button"
                    id="onboardingBack"
                    class="onboarding-back hidden"
                >
                    Back
                </button>

                <button
                    type="button"
                    id="onboardingNext"
                    class="primary-action"
                >
                    Continue →
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    addOnboardingStyles();


    initializeOnboarding(
        overlay
    );

}


function initializeOnboarding(overlay) {

    let step =
        1;


    const selections = {

        interests: [],

        mainGoal: ""

    };


    const steps =
        $$(".onboarding-step", overlay);


    const progress =
        $("#onboardingProgress", overlay);


    const back =
        $("#onboardingBack", overlay);


    const next =
        $("#onboardingNext", overlay);


    $$("[data-goal]", overlay)
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const value =
                            button.dataset.goal;


                        if (
                            selections.interests
                            .includes(value)
                        ) {

                            selections.interests =
                                selections.interests
                                .filter(
                                    item =>
                                    item !==
                                    value
                                );

                        } else {

                            selections.interests.push(
                                value
                            );

                        }


                        button.classList.toggle(
                            "selected",
                            selections.interests
                            .includes(value)
                        );

                    }
                );

            }
        );


    $$("[data-main-goal]", overlay)
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selections.mainGoal =
                            button.dataset.mainGoal;


                        $$(
                                "[data-main-goal]",
                                overlay
                            )
                            .forEach(
                                item =>
                                item.classList.remove(
                                    "selected"
                                )
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );

            }
        );


    function showStep() {

        steps.forEach(
            item => {

                item.classList.toggle(
                    "active",
                    Number(
                        item.dataset.step
                    ) === step
                );

            }
        );


        progress.style.width =
            `${step * 25}%`;


        back.classList.toggle(
            "hidden",
            step === 1
        );


        next.textContent =
            step === 4 ?
            "Create my space →" :
            "Continue →";

    }


    next.addEventListener(
        "click",
        () => {

            if (step === 1) {

                const name =
                    $("#onboardingName", overlay)
                    .value
                    .trim();


                if (name.length < 2) {

                    showToast(
                        "Please enter your name."
                    );

                    return;

                }

            }


            if (step === 3) {

                if (!selections.mainGoal) {

                    showToast(
                        "Choose a main goal to continue."
                    );

                    return;

                }

            }


            if (step < 4) {

                step++;

                showStep();

                return;

            }


            finishOnboarding(
                overlay,
                selections
            );

        }
    );


    back.addEventListener(
        "click",
        () => {

            if (step > 1) {

                step--;

                showStep();

            }

        }
    );


    showStep();

}


function finishOnboarding(
    overlay,
    selections
) {

    const name =
        $("#onboardingName", overlay)
        .value
        .trim();


    const income =
        Number(
            $("#onboardingIncome", overlay)
            .value
        ) || 0;


    const savings =
        Number(
            $("#onboardingSavings", overlay)
            .value
        ) || 0;


    const target =
        Number(
            $("#onboardingTarget", overlay)
            .value
        ) || 0;


    currentUser.name =
        name;


    currentUser.profile = {

        interests: selections.interests,

        mainGoal: selections.mainGoal

    };


    currentUser.onboardingComplete =
        true;


    currentUser.monthlyData =
        currentUser.monthlyData || {};


    const month =
        getCurrentMonthData();


    month.income =
        income;


    if (
        target > 0
    ) {

        month.goals = [

            {

                id: generateId(),

                name: getGoalName(
                    selections.mainGoal
                ),

                target,

                current: Math.min(
                    savings,
                    target
                ),

                monthly: income > 0 ?
                    Math.round(
                        income * .10
                    ) : 0,

                createdAt: new Date().toISOString()

            }

        ];

    }


    currentUser.monthlyData[
            currentMonthKey
        ] =
        month;


    currentUser.activeMonth =
        currentMonthKey;


    updateCurrentUser(
        currentUser
    );


    overlay.remove();


    initializeUser();


    updateAllUI();


    showToast(
        "Your BudgetBasics space is ready."
    );


    window.history.replaceState({},
        "",
        "app.html"
    );

}


function getGoalName(mainGoal) {

    const names = {

        emergency: "Emergency fund",

        school: "School expenses",

        purchase: "My next purchase",

        habit: "Money habit goal"

    };


    return (
        names[mainGoal] ||
        "My savings goal"
    );

}


/* =========================================================
   ONBOARDING STYLES
========================================================= */

function addOnboardingStyles() {

    if (
        document.getElementById(
            "onboardingStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "onboardingStyles";


    style.textContent = `

        #onboardingOverlay {
            position: fixed;
            inset: 0;
            z-index: 6000;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(7,11,19,.64);
            backdrop-filter: blur(12px);
        }

        .onboarding-modal {
            width: min(100%, 560px);
            padding: 30px;
            border: 1px solid var(--border);
            border-radius: 24px;
            background: var(--surface);
            color: var(--ink);
            box-shadow: 0 40px 110px rgba(0,0,0,.30);
        }

        .onboarding-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            font-family: "Manrope", sans-serif;
            font-size: 13px;
        }

        .onboarding-progress {
            height: 5px;
            margin-top: 22px;
            border-radius: 100px;
            overflow: hidden;
            background: var(--border);
        }

        .onboarding-progress span {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: var(--blue);
            transition: width .3s ease;
        }

        .onboarding-step {
            display: none;
            padding-top: 35px;
        }

        .onboarding-step.active {
            display: block;
            animation: onboardingIn .3s ease;
        }

        @keyframes onboardingIn {
            from {
                opacity: 0;
                transform: translateX(10px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .onboarding-kicker {
            color: var(--blue);
            font-size: 7px;
            font-weight: 900;
            letter-spacing: 1px;
        }

        .onboarding-step h2 {
            margin-top: 7px;
            font-family: "Manrope", sans-serif;
            font-size: 27px;
            line-height: 1.1;
            letter-spacing: -1px;
        }

        .onboarding-step > p {
            max-width: 470px;
            margin-top: 9px;
            color: var(--muted);
            font-size: 10px;
            line-height: 1.7;
        }

        .onboarding-step label {
            display: grid;
            gap: 7px;
            margin-top: 25px;
            color: var(--ink);
            font-size: 8px;
            font-weight: 800;
        }

        .onboarding-step input {
            width: 100%;
            height: 45px;
            padding: 0 12px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: var(--surface-soft);
            color: var(--ink);
            outline: none;
            font-size: 10px;
        }

        .onboarding-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 23px;
        }

        .onboarding-options button,
        .onboarding-goal-options button {
            padding: 15px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--surface-soft);
            color: var(--ink);
            text-align: left;
        }

        .onboarding-options button.selected,
        .onboarding-goal-options button.selected {
            border-color: var(--blue);
            background: rgba(36,87,230,.08);
            color: var(--blue);
        }

        .onboarding-options strong {
            display: block;
            font-size: 10px;
        }

        .onboarding-options span {
            display: block;
            margin-top: 3px;
            color: var(--muted);
            font-size: 8px;
        }

        .onboarding-goal-options {
            display: grid;
            gap: 8px;
            margin-top: 23px;
        }

        .onboarding-goal-options button {
            font-size: 9px;
            font-weight: 700;
        }

        .onboarding-currency {
            display: flex;
            align-items: center;
            border: 1px solid var(--border);
            border-radius: 10px;
            overflow: hidden;
            background: var(--surface-soft);
        }

        .onboarding-currency span {
            padding: 0 11px;
            color: var(--muted);
            font-size: 11px;
            font-weight: 900;
        }

        .onboarding-currency input {
            border: 0;
            border-radius: 0;
            background: transparent;
        }

        .onboarding-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }

        .onboarding-back {
            padding: 9px 12px;
            border-radius: 9px;
            background: transparent;
            color: var(--muted);
            font-size: 9px;
            font-weight: 800;
        }

        @media (max-width: 600px) {

            .onboarding-modal {
                padding: 23px 18px;
            }

            .onboarding-options {
                grid-template-columns: 1fr;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


$$("[data-close-modal]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.closeModal
                    );

                }
            );

        }
    );


$$(".modal-backdrop")
    .forEach(
        backdrop => {

            backdrop.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        backdrop
                    ) {

                        closeModal(
                            backdrop.id
                        );

                    }

                }
            );

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            $$(".modal-backdrop.open")
                .forEach(
                    modal => {

                        closeModal(
                            modal.id
                        );

                    }
                );

            closeBudgetBee();

            closeProfileMenu();

        }

    }
);


/* =========================================================
   UTILITIES
========================================================= */

function calculateSpent(data) {

    return data.expenses.reduce(
        (
            total,
            expense
        ) =>
        total +
        Number(
            expense.amount
        ),
        0
    );

}


function calculateSaved(data) {

    return data.goals.reduce(
        (
            total,
            goal
        ) =>
        total +
        Number(
            goal.current
        ),
        0
    );

}


function getCategoryTotals(expenses) {

    return expenses.reduce(
        (
            totals,
            expense
        ) => {

            const category =
                expense.category;


            totals[category] =
                (
                    totals[category] ||
                    0
                ) +
                Number(
                    expense.amount
                );


            return totals;

        }, {
            needs: 0,
            wants: 0,
            savings: 0
        }
    );

}


function getTopCategory(expenses) {

    const totals =
        getCategoryTotals(
            expenses
        );


    const entries =
        Object.entries(
            totals
        )
        .filter(
            ([, amount]) =>
            amount > 0
        )
        .sort(
            (a, b) =>
            b[1] - a[1]
        );


    if (!entries.length) {

        return null;

    }


    return {

        name: entries[0][0],

        amount: entries[0][1]

    };

}


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(
        Number(amount) || 0
    );

}


function formatDate(dateString) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return new Intl.DateTimeFormat(
        "en-US", {
            month: "short",
            day: "numeric"
        }
    ).format(date);

}


function capitalize(value) {

    if (!value) {

        return "";

    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


function generateId() {

    return (
        Date.now() +
        "_" +
        Math.random()
        .toString(36)
        .slice(2, 8)
    );

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

    const toast =
        $("#appToast");


    $("#appToastText")
        .textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}