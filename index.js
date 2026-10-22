/* =========================================================
   BUDGETBASICS LANDING PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

    users: "budgetbasics_users_v1",

    session: "budgetbasics_session_v1",

    theme: "budgetbasics_theme_v1"

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) => {

    return parent.querySelector(selector);

};


const $$ = (selector, parent = document) => {

    return [...parent.querySelectorAll(selector)];

};


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const body = document.body;

const pageLoader = $("#pageLoader");

const siteHeader = $("#siteHeader");

const themeToggle = $("#themeToggle");

const mobileMenuButton = $("#mobileMenuButton");

const mobileNav = $("#mobileNav");

const authModal = $("#authModal");

const authClose = $("#authClose");

const signUpForm = $("#signUpForm");

const signInForm = $("#signInForm");

const authTitle = $("#authTitle");

const authSubtitle = $("#authSubtitle");

const signInMessage = $("#signInMessage");

const toast = $("#toast");

const toastMessage = $("#toastMessage");

const backToTop = $("#backToTop");

const footerYear = $("#footerYear");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    initializeLoader();

    initializeHeader();

    initializeMobileNavigation();

    initializeAuth();

    initializeRevealAnimations();

    initializeBackToTop();

    initializeFooterYear();

    initializeLandingInteractions();

});


/* =========================================================
   PAGE LOADER
========================================================= */

function initializeLoader() {

    window.addEventListener("load", () => {

        setTimeout(() => {

            pageLoader.classList.add("loaded");

        }, 450);

    });

}


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(STORAGE_KEYS.theme);

    if (savedTheme === "dark") {

        body.dataset.theme = "dark";

    } else {

        body.dataset.theme = "light";

    }


    themeToggle.addEventListener("click", () => {

        const currentTheme =
            body.dataset.theme;

        const nextTheme =
            currentTheme === "dark" ?
            "light" :
            "dark";

        body.dataset.theme =
            nextTheme;

        localStorage.setItem(
            STORAGE_KEYS.theme,
            nextTheme
        );

        showToast(
            nextTheme === "dark" ?
            "Dark mode enabled" :
            "Light mode enabled"
        );

    });

}


/* =========================================================
   HEADER
========================================================= */

function initializeHeader() {

    function updateHeader() {

        if (window.scrollY > 20) {

            siteHeader.classList.add("scrolled");

        } else {

            siteHeader.classList.remove("scrolled");

        }


        if (window.scrollY > 500) {

            backToTop.classList.add("visible");

        } else {

            backToTop.classList.remove("visible");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader, { passive: true }
    );


    updateHeader();

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeMobileNavigation() {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileNav.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    $$(".mobile-nav a").forEach(link => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    $$(".mobile-nav button").forEach(button => {

        button.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    document.addEventListener("click", event => {

        const clickedInsideHeader =
            siteHeader.contains(event.target);

        if (!clickedInsideHeader) {

            closeMobileMenu();

        }

    });

}


function closeMobileMenu() {

    mobileNav.classList.remove("open");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}


/* =========================================================
   AUTH SYSTEM
========================================================= */

function initializeAuth() {

    $$("[data-open-auth]").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const mode =
                button.dataset.openAuth;

            openAuthModal(mode);

        });

    });


    $$("[data-switch-auth]").forEach(button => {

        button.addEventListener("click", () => {

            const mode =
                button.dataset.switchAuth;

            switchAuthMode(mode);

        });

    });


    authClose.addEventListener(
        "click",
        closeAuthModal
    );


    authModal.addEventListener("click", event => {

        if (event.target === authModal) {

            closeAuthModal();

        }

    });


    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            authModal.classList.contains("open")
        ) {

            closeAuthModal();

        }

    });


    signUpForm.addEventListener(
        "submit",
        handleSignUp
    );


    signInForm.addEventListener(
        "submit",
        handleSignIn
    );

}


/* =========================================================
   OPEN AUTH MODAL
========================================================= */

function openAuthModal(mode = "signup") {

    authModal.classList.add("open");

    authModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    switchAuthMode(mode);

    const firstInput =
        mode === "signup" ?
        $("#signUpName") :
        $("#signInEmail");

    setTimeout(() => {

        if (firstInput) {
            firstInput.focus();
        }

    }, 250);

}


/* =========================================================
   CLOSE AUTH MODAL
========================================================= */

function closeAuthModal() {

    authModal.classList.remove("open");

    authModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    clearFormErrors();

    signInMessage.classList.remove("show");

    signInMessage.textContent =
        "";

}


/* =========================================================
   SWITCH AUTH MODE
========================================================= */

function switchAuthMode(mode) {

    clearFormErrors();

    signInMessage.classList.remove("show");

    signInMessage.textContent =
        "";


    if (mode === "signup") {

        signUpForm.classList.remove("hidden");

        signInForm.classList.add("hidden");

        authTitle.textContent =
            "Create your money space";

        authSubtitle.textContent =
            "Start with a few simple details.";

    } else {

        signUpForm.classList.add("hidden");

        signInForm.classList.remove("hidden");

        authTitle.textContent =
            "Welcome back";

        authSubtitle.textContent =
            "Continue building better money habits.";

    }

}


/* =========================================================
   GET USERS
========================================================= */

function getUsers() {

    try {

        const raw =
            localStorage.getItem(
                STORAGE_KEYS.users
            );

        if (!raw) {

            return [];

        }

        const users =
            JSON.parse(raw);

        return Array.isArray(users) ?
            users : [];

    } catch (error) {

        console.error(
            "Could not read users:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users) {

    localStorage.setItem(
        STORAGE_KEYS.users,
        JSON.stringify(users)
    );

}


/* =========================================================
   HANDLE SIGN UP
========================================================= */

function handleSignUp(event) {

    event.preventDefault();

    clearFormErrors();


    const name =
        $("#signUpName").value.trim();

    const email =
        $("#signUpEmail").value.trim().toLowerCase();

    const password =
        $("#signUpPassword").value;

    const confirmPassword =
        $("#signUpConfirm").value;

    const agreement =
        $("#signupAgreement").checked;


    let valid = true;


    if (name.length < 2) {

        setFieldError(
            $("#signUpName"),
            "Please enter your name."
        );

        valid = false;

    }


    if (!isValidEmail(email)) {

        setFieldError(
            $("#signUpEmail"),
            "Please enter a valid email."
        );

        valid = false;

    }


    if (password.length < 6) {

        setFieldError(
            $("#signUpPassword"),
            "Use at least 6 characters."
        );

        valid = false;

    }


    if (password !== confirmPassword) {

        setFieldError(
            $("#signUpConfirm"),
            "Passwords do not match."
        );

        valid = false;

    }


    if (!agreement) {

        showToast(
            "Please accept the educational-use notice."
        );

        valid = false;

    }


    if (!valid) {

        return;

    }


    const users =
        getUsers();


    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        setFieldError(
            $("#signUpEmail"),
            "An account with this email already exists."
        );

        return;

    }


    const user = {

        id: generateId(),

        name,

        email,

        password,

        createdAt: new Date().toISOString(),

        onboardingComplete: false,

        profile: {},

        monthlyData: {}

    };


    users.push(user);

    saveUsers(users);


    localStorage.setItem(
        STORAGE_KEYS.session,
        user.id
    );


    closeAuthModal();


    showToast(
        "Account created. Let's personalize your space."
    );


    setTimeout(() => {

        window.location.href =
            "app.html?setup=true";

    }, 800);

}


/* =========================================================
   HANDLE SIGN IN
========================================================= */

function handleSignIn(event) {

    event.preventDefault();

    clearFormErrors();

    signInMessage.classList.remove("show");


    const email =
        $("#signInEmail").value.trim().toLowerCase();

    const password =
        $("#signInPassword").value;


    if (!isValidEmail(email)) {

        setFieldError(
            $("#signInEmail"),
            "Enter a valid email."
        );

        return;

    }


    if (!password) {

        setFieldError(
            $("#signInPassword"),
            "Enter your password."
        );

        return;

    }


    const users =
        getUsers();


    const user =
        users.find(
            currentUser =>
            currentUser.email === email
        );


    if (!user) {

        showSignInError(
            "No BudgetBasics account was found with this email."
        );

        return;

    }


    if (user.password !== password) {

        showSignInError(
            "The password you entered is incorrect."
        );

        return;

    }


    localStorage.setItem(
        STORAGE_KEYS.session,
        user.id
    );


    closeAuthModal();


    showToast(
        `Welcome back, ${user.name.split(" ")[0]}!`
    );


    setTimeout(() => {

        if (user.onboardingComplete) {

            window.location.href =
                "app.html";

        } else {

            window.location.href =
                "app.html?setup=true";

        }

    }, 700);

}


/* =========================================================
   VALIDATE EMAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* =========================================================
   FIELD ERROR
========================================================= */

function setFieldError(input, message) {

    const field =
        input.closest(".form-field");

    if (!field) {

        return;

    }


    field.classList.add("invalid");


    const error =
        $(".field-error", field);


    if (error) {

        error.textContent =
            message;

    }

}


/* =========================================================
   CLEAR FORM ERRORS
========================================================= */

function clearFormErrors() {

    $$(".form-field").forEach(field => {

        field.classList.remove("invalid");

        const error =
            $(".field-error", field);

        if (error) {

            error.textContent =
                "";

        }

    });

}


/* =========================================================
   SIGN IN ERROR
========================================================= */

function showSignInError(message) {

    signInMessage.textContent =
        message;

    signInMessage.classList.add("show");

}


/* =========================================================
   GENERATE ID
========================================================= */

function generateId() {

    return (
        "user_" +
        Date.now() +
        "_" +
        Math.random()
        .toString(36)
        .slice(2, 9)
    );

}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initializeRevealAnimations() {

    const elements =
        $$(".reveal");


    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            }, {
                threshold: .12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   BACK TO TOP
========================================================= */

function initializeBackToTop() {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   FOOTER YEAR
========================================================= */

function initializeFooterYear() {

    footerYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   LANDING INTERACTIONS
========================================================= */

function initializeLandingInteractions() {

    const answerOptions =
        $$(".answer-option");


    answerOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                answerOptions.forEach(
                    current => {

                        current.classList.remove(
                            "correct"
                        );

                        const result =
                            $(".answer-result", current);

                        if (result) {

                            result.remove();

                        }

                    }
                );


                option.classList.add(
                    "correct"
                );


                const result =
                    document.createElement("span");

                result.className =
                    "answer-result";

                result.textContent =
                    option.textContent.includes(
                        "Help me plan"
                    ) ?
                    "✓" :
                    "×";


                option.appendChild(
                    result
                );


                if (
                    option.textContent.includes(
                        "Help me plan"
                    )
                ) {

                    showToast(
                        "Correct — a budget gives your money a purpose."
                    );

                } else {

                    showToast(
                        "Think about what a budget helps you decide."
                    );

                }

            }
        );

    });


    $$(".how-item").forEach(item => {

        item.addEventListener(
            "click",
            () => {

                $$(".how-item").forEach(
                    current => {

                        current.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3200);

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {

            return;

        }


        if (
            mobileNav.classList.contains("open")
        ) {

            closeMobileMenu();

        }

    }
);