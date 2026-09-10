const sheets = document.querySelectorAll(".sheet");
const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");
const instructions = document.getElementById("instructions");

let currentSheet = 0;
let isAnimating = false;

const TURN_DURATION = 1000;


/* --------------------------------
   STACK MANAGEMENT
-------------------------------- */

function setNormalStack() {
    sheets.forEach((sheet, index) => {
        // First sheet is highest, last sheet is lowest.
        sheet.style.zIndex = sheets.length - index;
    });
}


/* --------------------------------
   UI
-------------------------------- */

function updateBook() {
    if (currentSheet === 0) {
        instructions.textContent = "Click the book to open it ✨";
    } else if (currentSheet === sheets.length) {
        instructions.textContent = "You've reached the end! 💕";
    } else {
        instructions.textContent =
            "Click a page or use the buttons to turn it ✨";
    }

    prevButton.disabled =
        currentSheet === 0 || isAnimating;

    nextButton.disabled =
        currentSheet === sheets.length || isAnimating;
}


/* --------------------------------
   NEXT PAGE
-------------------------------- */

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
        Put the sheet being turned above EVERYTHING.

        This is important because it prevents the next
        sheet from appearing through it during the turn.
    */
    sheet.style.zIndex = 100;

    sheet.classList.add("flipped");

    currentSheet++;

    /*
        Wait for the ACTUAL CSS transition instead of
        guessing with setTimeout.
    */
    const finishForward = (event) => {
        if (event.propertyName !== "transform") return;

        sheet.removeEventListener(
            "transitionend",
            finishForward
        );

        /*
            Once the turn is finished, put the sheet back
            into its normal stack position.
        */
        setNormalStack();

        isAnimating = false;
        updateBook();
    };

    sheet.addEventListener(
        "transitionend",
        finishForward
    );
}


/* --------------------------------
   PREVIOUS PAGE
-------------------------------- */

function previousPage() {
    if (
        currentSheet <= 0 ||
        isAnimating
    ) {
        return;
    }

    isAnimating = true;
    updateBook();

    const sheet = sheets[currentSheet - 1];

    /*
        THIS is the important difference.

        During a backwards turn, the sheet must remain
        above every other sheet from beginning to end.

        Otherwise the sheet underneath becomes visible
        before the animation has finished.
    */
    sheet.style.zIndex = 100;

    /*
        Start the reverse animation.

        We deliberately do NOT change the stack or remove
        any classes after a timeout.
    */
    sheet.classList.remove("flipped");

    currentSheet--;

    const finishBackward = (event) => {
        if (event.propertyName !== "transform") return;

        sheet.removeEventListener(
            "transitionend",
            finishBackward
        );

        /*
            Only NOW, after the physical page has reached
            the right side, restore the normal stack.
        */
        setNormalStack();

        isAnimating = false;
        updateBook();
    };

    sheet.addEventListener(
        "transitionend",
        finishBackward
    );
}


/* --------------------------------
   BUTTONS
-------------------------------- */

nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    nextPage();
});

prevButton.addEventListener("click", (event) => {
    event.stopPropagation();
    previousPage();
});


/* --------------------------------
   CLICKING THE PAGES
-------------------------------- */

sheets.forEach((sheet, index) => {

    sheet.addEventListener("click", (event) => {
        event.stopPropagation();

        if (isAnimating) return;

        /*
            Clicking the currently active right-hand sheet
            turns forward.
        */
        if (
            index === currentSheet &&
            !sheet.classList.contains("flipped")
        ) {
            nextPage();
            return;
        }

        /*
            Clicking the most recently turned sheet
            turns backward.
        */
        if (
            index === currentSheet - 1 &&
            sheet.classList.contains("flipped")
        ) {
            previousPage();
        }
    });

});


/* --------------------------------
   KEYBOARD
-------------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

});


/* --------------------------------
   INITIALIZE
-------------------------------- */

setNormalStack();
updateBook();
