const pages = document.querySelectorAll(".page");

const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");

const instructions = document.getElementById("instructions");

let currentPage = 0;


/* TURN TO NEXT PAGE */

function nextPage() {

    if (currentPage < pages.length - 1) {

        pages[currentPage].classList.add("flipped");

        currentPage++;

        updateBook();

    }

}


/* TURN BACK */

function previousPage() {

    if (currentPage > 0) {

        currentPage--;

        pages[currentPage].classList.remove("flipped");

        updateBook();

    }

}


/* UPDATE BUTTONS */

function updateBook() {

    if (currentPage === 0) {

        instructions.textContent =
            "Click the book to open it ✨";

    } else if (currentPage === pages.length - 1) {

        instructions.textContent =
            "You've reached the end! 💕";

    } else {

        instructions.textContent =
            "Click a page or use the buttons to turn it ✨";

    }

}


/* BUTTON EVENTS */

nextButton.addEventListener("click", nextPage);

prevButton.addEventListener("click", previousPage);


/* CLICK BOOK TO TURN */

pages.forEach((page) => {

    page.addEventListener("click", () => {

        /*
        If this page is already flipped,
        turn it backward.
        */

        if (page.classList.contains("flipped")) {

            previousPage();

        } else {

            nextPage();

        }

    });

});


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

});
