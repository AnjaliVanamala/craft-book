const sheets = document.querySelectorAll(".sheet");

const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");

const instructions = document.getElementById("instructions");

let currentSheet = 0;

let isAnimating = false;

const TURN_DURATION = 1000;


/* =========================================================
   UPDATE BOOK
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
   TURN FORWARD
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

    sheet.classList.add("flipped");

    currentSheet++;


    /*
        Wait for the physical page-turn animation
        to completely finish before accepting another turn.
    */

    setTimeout(() => {

        isAnimating = false;

        updateBook();

    }, TURN_DURATION);
}


/* =========================================================
   TURN BACKWARD
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
        The sheet we're about to turn back is the one
        immediately before currentSheet.
    */

    const sheet = sheets[currentSheet - 1];


    /*
        CRITICAL FIX:

        Keep this sheet at the top of the stack while
        it rotates backward.

        Without this, its z-index immediately drops and
        the page underneath becomes visible too early.
    */

    sheet.classList.add("turning-back");


    /*
        Remove the flipped state so the sheet begins
        rotating from -180 degrees back toward 0.
    */

    sheet.classList.remove("flipped");

    currentSheet--;


    /*
        Only after the animation is completely finished
        do we remove turning-back.

        This prevents the underlying page from appearing
        prematurely.
    */

    setTimeout(() => {

        sheet.classList.remove("turning-back");

        isAnimating = false;

        updateBook();

    }, TURN_DURATION);
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

nextButton.addEventListener("click", function (event) {

    event.stopPropagation();

    nextPage();
});


prevButton.addEventListener("click", function (event) {

    event.stopPropagation();

    previousPage();
});


/* =========================================================
   CLICK BOOK TO TURN
========================================================= */

sheets.forEach((sheet, index) => {

    sheet.addEventListener("click", function (event) {

        event.stopPropagation();


        if (isAnimating) {
            return;
        }


        /*
            Forward:

            The next sheet in the stack is the one that
            should be turned.
        */

        if (
            index === currentSheet &&
            !sheet.classList.contains("flipped")
        ) {

            nextPage();

            return;
        }


        /*
            Backward:

            The last sheet we turned is the one whose
            backside is currently visible.
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
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowRight") {

        nextPage();
    }

    if (event.key === "ArrowLeft") {

        previousPage();
    }
});


/* =========================================================
   INITIAL STATE
========================================================= */

updateBook();
