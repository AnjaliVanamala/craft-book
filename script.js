const sheets = document.querySelectorAll(".sheet");

const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");

const instructions = document.getElementById("instructions");

let currentSheet = 0;


/* =========================================================
   UPDATE BOOK
========================================================= */

function updateBook() {

    /*
        currentSheet tells us how many physical sheets
        have been turned.

        0 = cover closed
        1 = page 1 | page 2
        2 = page 3 | page 4
        ...
        9 = back cover
    */

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


    /* Disable buttons at the appropriate ends */

    prevButton.disabled = currentSheet === 0;

    nextButton.disabled = currentSheet === sheets.length;
}


/* =========================================================
   TURN FORWARD
========================================================= */

function nextPage() {

    if (currentSheet >= sheets.length) {
        return;
    }

    /*
        Turn the current physical sheet.
    */

    sheets[currentSheet].classList.add("flipped");

    currentSheet++;

    updateBook();
}


/* =========================================================
   TURN BACKWARD
========================================================= */

function previousPage() {

    if (currentSheet <= 0) {
        return;
    }

    /*
        Move back to the previous physical sheet.
    */

    currentSheet--;

    sheets[currentSheet].classList.remove("flipped");

    updateBook();
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


        /*
            Only the currently active sheet should respond.

            If it hasn't been turned yet:
                clicking it turns it forward.

            If it has already been turned:
                clicking its backside turns it backward.
        */

        if (
            index === currentSheet &&
            !sheet.classList.contains("flipped")
        ) {

            nextPage();

            return;
        }


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
