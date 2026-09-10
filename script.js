const sheets = document.querySelectorAll(".sheet");
const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");
const instructions = document.getElementById("instructions");

let currentSheet = 0;
let isAnimating = false;


/* =========================================================
   STACKING
========================================================= */

/*
    Unturned sheets sit on top of turned sheets.

    Example after opening:

        Sheet 2   ← highest
        Sheet 3
        Sheet 4
        ...
        Sheet 1   ← lowest because it has been turned

    This is what makes the book behave like a real stack
    of physical sheets.
*/

function updateStack() {

    const base = sheets.length * 2;

    sheets.forEach((sheet, index) => {

        if (sheet.classList.contains("flipped")) {

            /*
                Turned sheets go toward the bottom.
            */
            sheet.style.zIndex = index + 1;

        } else {

            /*
                Unturned sheets stay above turned sheets.

                Earlier unturned sheets are slightly higher
                than later ones.
            */
            sheet.style.zIndex = base - index;
        }

    });
}


/* =========================================================
   UI
========================================================= */

function updateBook() {

    if (currentSheet === 0) {

        instructions.textContent =
            "Click the book to open it ✨";

    } else if (currentSheet === sheets.length) {

        instructions.textContent =
            "You've reached the end! 💕";

    } else {

        instructions.textContent =
            "Click a page or use the buttons to turn it ✨";
    }


    prevButton.disabled =
        currentSheet === 0 || isAnimating;

    nextButton.disabled =
        currentSheet === sheets.length || isAnimating;
}


/* =========================================================
   FINISH ANIMATION
========================================================= */

function waitForTurnToFinish(sheet, callback) {

    function finished(event) {

        if (event.propertyName !== "transform") {
            return;
        }

        sheet.removeEventListener(
            "transitionend",
            finished
        );

        callback();
    }

    sheet.addEventListener(
        "transitionend",
        finished
    );
}


/* =========================================================
   NEXT PAGE
========================================================= */

function nextPage() {

    if (
        currentSheet >= sheets.length ||
        isAnimating
    ) {
        return;
    }


    isAnimating = true;
    updateBook();


    const sheet = sheets[currentSheet];


    /*
        While this sheet is physically turning,
        it needs to be above everything.
    */
    sheet.style.zIndex = 100;


    /*
        Turn the sheet.
    */
    sheet.classList.add("flipped");


    currentSheet++;


    /*
        IMPORTANT:

        Don't change its z-index until the animation
        has completely finished.
    */
    waitForTurnToFinish(sheet, () => {

        updateStack();

        isAnimating = false;

        updateBook();
    });
}


/* =========================================================
   PREVIOUS PAGE
========================================================= */

function previousPage() {

    if (
        currentSheet <= 0 ||
        isAnimating
    ) {
        return;
    }


    isAnimating = true;
    updateBook();


    /*
        The sheet we want to bring back.
    */
    const sheet = sheets[currentSheet - 1];


    /*
        Put it above everything while it physically
        turns back.
    */
    sheet.style.zIndex = 100;


    /*
        Start the reverse animation.
    */
    sheet.classList.remove("flipped");


    currentSheet--;


    /*
        Wait until the sheet has COMPLETELY returned
        to the right side.
    */
    waitForTurnToFinish(sheet, () => {

        /*
            NOW it can go back into the normal stack.
        */
        updateStack();

        isAnimating = false;

        updateBook();
    });
}


/* =========================================================
   BUTTONS
========================================================= */

nextButton.addEventListener("click", (event) => {

    event.stopPropagation();

    nextPage();
});


prevButton.addEventListener("click", (event) => {

    event.stopPropagation();

    previousPage();
});


/* =========================================================
   PAGE CLICKING
========================================================= */

sheets.forEach((sheet, index) => {

    sheet.addEventListener("click", (event) => {

        event.stopPropagation();

        if (isAnimating) {
            return;
        }


        /*
            Current unflipped sheet:
            turn forward.
        */
        if (
            index === currentSheet &&
            !sheet.classList.contains("flipped")
        ) {

            nextPage();

            return;
        }


        /*
            Most recently flipped sheet:
            turn backward.
        */
        if (
            index === currentSheet - 1 &&
            sheet.classList.contains("flipped")
        ) {

            previousPage();
        }

    });

});


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

});


/* =========================================================
   INITIALIZE
========================================================= */

updateStack();
updateBook();
