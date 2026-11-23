
// =====================================
// TAKETWO - MOVIE BOOKING WEBSITE
// =====================================

const ticketPrice = 200;

let selectedSeats = [];
let activeBooking = null;

let bookedSeats = {};

let snacks = {
    popcorn: { name: "Classic Popcorn", price: 120, quantity: 0 },
    nachos: { name: "Cheese Nachos", price: 150, quantity: 0 },
    drink: { name: "Cold Drink", price: 90, quantity: 0 },
    burger: { name: "Classic Burger", price: 180, quantity: 0 }
};


// =====================================
// MOVIE POSTER FALLBACK
// =====================================

document.querySelectorAll(".poster-wrap img").forEach(img => {
    img.addEventListener("error", function () {
        this.style.display = "none";
        this.parentElement.classList.add("poster-fallback");
    });
});


// =====================================
// MOVIE SEARCH
// =====================================

document.getElementById("movieSearch").addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();
    const cards = document.querySelectorAll(".movie-card");

    let visibleCount = 0;

    cards.forEach(card => {

        const movieName = card.querySelector("h3").textContent.toLowerCase();

        if (movieName.includes(searchValue)) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    });

    document.getElementById("noMovies").classList.toggle(
        "hidden",
        visibleCount !== 0
    );

});


// =====================================
// SELECT MOVIE
// =====================================

function selectMovie(movieName) {

    if (activeBooking) {
        alert("Please cancel your current booking before making another booking.");
        return;
    }

    document.getElementById("movie").value = movieName;

    selectedSeats = [];

    updateSeats();
    updateBill();

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

}


// =====================================
// GET SHOW DETAILS
// =====================================

function getShowKey() {

    const movie = document.getElementById("movie").value;
    const theatre = document.getElementById("theatre").value;
    const time = document.getElementById("showtime").value;

    if (!movie || !theatre || !time) {
        return null;
    }

    return movie + "|" + theatre + "|" + time;

}


// =====================================
// UPDATE SEAT AVAILABILITY
// =====================================

function updateSeats() {

    const showKey = getShowKey();

    const unavailable = showKey ? (bookedSeats[showKey] || []) : [];

    document.querySelectorAll(".seat").forEach(seat => {

        const seatName = seat.dataset.seat;

        seat.classList.remove("selected", "booked");

        if (unavailable.includes(seatName)) {

            seat.classList.add("booked");
            seat.disabled = true;

        } else {

            seat.disabled = false;

            if (selectedSeats.includes(seatName)) {
                seat.classList.add("selected");
            }

        }

    });

    document.getElementById("selectedSeats").textContent =
        selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None";

    updateBill();

}


// =====================================
// SELECT AND DESELECT SEATS
// =====================================

document.querySelectorAll(".seat").forEach(seat => {

    seat.addEventListener("click", function () {

        if (activeBooking) {
            alert("Cancel your existing booking before selecting new seats.");
            return;
        }

        if (!getShowKey()) {
            alert("Please select a movie, theatre and show time first!");
            return;
        }

        const seatName = this.dataset.seat;

        if (this.classList.contains("booked")) {
            return;
        }

        if (selectedSeats.includes(seatName)) {

            selectedSeats = selectedSeats.filter(
                item => item !== seatName
            );

        } else {

            selectedSeats.push(seatName);

        }

        updateSeats();

    });

});


// =====================================
// CHANGE MOVIE / THEATRE / SHOWTIME
// =====================================

["movie", "theatre", "showtime"].forEach(id => {

    document.getElementById(id).addEventListener("change", function () {

        if (activeBooking) {
            return;
        }

        selectedSeats = [];

        updateSeats();
        updateBill();

    });

});


// =====================================
// ADD REFRESHMENTS
// =====================================

function changeSnack(item, amount) {

    if (activeBooking) {
        alert("Please cancel your current booking before changing snacks.");
        return;
    }

    snacks[item].quantity += amount;

    if (snacks[item].quantity < 0) {
        snacks[item].quantity = 0;
    }

    updateSnackBill();
    updateBill();

}


// =====================================
// CALCULATE SNACK TOTAL
// =====================================

function calculateSnackTotal() {

    let total = 0;

    for (let item in snacks) {

        total += snacks[item].price * snacks[item].quantity;

    }

    return total;

}


// =====================================
// DISPLAY SNACK BILL
// =====================================

function updateSnackBill() {

    const billContainer = document.getElementById("snackBillItems");

    billContainer.innerHTML = "";

    let hasSnacks = false;

    for (let item in snacks) {

        const snack = snacks[item];

        document.getElementById(item + "Qty").textContent =
            snack.quantity;

        if (snack.quantity > 0) {

            hasSnacks = true;

            const row = document.createElement("div");

            row.className = "snack-bill-item";

            const name = document.createElement("span");

            name.textContent =
                snack.name + " x " + snack.quantity;

            const price = document.createElement("strong");

            price.textContent =
                "₹" + (snack.price * snack.quantity);

            const remove = document.createElement("button");

            remove.textContent = "Remove 1";

            remove.disabled = Boolean(activeBooking);

            remove.addEventListener("click", function () {
                changeSnack(item, -1);
            });

            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(remove);

            billContainer.appendChild(row);

        }

    }

    if (!hasSnacks) {

        billContainer.innerHTML =
            '<p class="empty-message">No snacks added yet.</p>';

    }

    document.getElementById("snackTotal").textContent =
        "₹" + calculateSnackTotal();

}


// =====================================
// UPDATE COMPLETE BOOKING BILL
// =====================================

function updateBill() {

    const movie = document.getElementById("movie").value;
    const theatre = document.getElementById("theatre").value;
    const time = document.getElementById("showtime").value;

    const ticketTotal = selectedSeats.length * ticketPrice;

    const snackTotal = calculateSnackTotal();

    const grandTotal = ticketTotal + snackTotal;

    document.getElementById("billMovie").textContent =
        movie || "Not selected";

    document.getElementById("billTheatre").textContent =
        theatre || "Not selected";

    document.getElementById("billTime").textContent =
        time || "Not selected";

    document.getElementById("billSeats").textContent =
        selectedSeats.length
            ? selectedSeats.join(", ")
            : "None";

    document.getElementById("ticketTotal").textContent =
        "₹" + ticketTotal;

    document.getElementById("billSnackTotal").textContent =
        "₹" + snackTotal;

    document.getElementById("grandTotal").textContent =
        "₹" + grandTotal;

}


// =====================================
// PAYMENT METHOD
// =====================================

document.querySelectorAll('input[name="payment"]').forEach(option => {

    option.addEventListener("change", function () {

        const cardFields = document.getElementById("cardFields");

        const upiFields = document.getElementById("upiFields");

        if (this.value === "card") {

            cardFields.classList.remove("hidden");

            upiFields.classList.add("hidden");

        } else {

            cardFields.classList.add("hidden");

            upiFields.classList.remove("hidden");

        }

    });

});


// =====================================
// VALIDATE PAYMENT DETAILS
// =====================================

function validatePayment() {

    const method = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    if (method === "card") {

        const card = document.getElementById("cardNumber").value.trim();

        const expiry = document.getElementById("expiry").value.trim();

        const cvv = document.getElementById("cvv").value.trim();

        if (!/^\d{16}$/.test(card)) {
            alert("Enter a valid 16-digit card number.");
            return false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            alert("Enter expiry in MM/YY format.");
            return false;
        }

        const parts = expiry.split("/");

        const month = Number(parts[0]);
        const year = 2000 + Number(parts[1]);

        const expiryDate = new Date(year, month, 1);

        if (expiryDate <= new Date()) {
            alert("Your card has expired.");
            return false;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert("Enter a valid 3-digit CVV.");
            return false;
        }

    } else {

        const upi = document.getElementById("upiId").value.trim();

        if (!/^[\w.-]+@[\w.-]+$/.test(upi)) {
            alert("Enter a valid UPI ID.");
            return false;
        }

    }

    return true;

}


// =====================================
// CONFIRM BOOKING
// =====================================

function confirmBooking() {

    const movie = document.getElementById("movie").value;

    const theatre = document.getElementById("theatre").value;

    const time = document.getElementById("showtime").value;

    const message = document.getElementById("bookingMessage");

    if (activeBooking) {
        alert("You already have a confirmed booking.");
        return;
    }

    if (!movie || !theatre || !time) {
        alert("Please select a movie, theatre and show time.");
        return;
    }

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    if (!validatePayment()) {
        return;
    }

    const showKey = getShowKey();

    if (!bookedSeats[showKey]) {
        bookedSeats[showKey] = [];
    }

    // Check seat availability again.

    if (selectedSeats.some(seat =>
        bookedSeats[showKey].includes(seat)
    )) {

        alert("Some selected seats are already booked. Please select again.");

        selectedSeats = [];

        updateSeats();

        return;
    }

    const ticketTotal = selectedSeats.length * ticketPrice;

    const snackTotal = calculateSnackTotal();

    const total = ticketTotal + snackTotal;

    const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    // Create booking object.

    const booking = {

        id: "TT" + Date.now(),

        movie: movie,

        theatre: theatre,

        time: time,

        seats: [...selectedSeats],

        total: total,

        paymentMethod: paymentMethod,

        status: "Confirmed"

    };

    // Mark selected seats as booked.

    bookedSeats[showKey].push(...selectedSeats);

    activeBooking = booking;

    // Display confirmation.

    message.innerHTML =
        "✓ BOOKING CONFIRMED!<br>" +
        "Booking ID: " + booking.id + "<br>" +
        "Movie: " + movie + "<br>" +
        "Theatre: " + theatre + "<br>" +
        "Seats: " + booking.seats.join(", ") + "<br>" +
        "Payment: " + paymentMethod.toUpperCase() + "<br>" +
        "Total Amount: ₹" + total +
        "<br><br>Enjoy your movie! 🍿";

    alert(
        "Your TAKETWO booking is confirmed!\n" +
        "Booking ID: " + booking.id
    );

    // Lock booking details.

    document.getElementById("movie").disabled = true;

    document.getElementById("theatre").disabled = true;

    document.getElementById("showtime").disabled = true;

    document.querySelectorAll(".seat").forEach(seat => {
        seat.disabled = true;
    });

    document.querySelectorAll(".snack-card button").forEach(button => {
        button.disabled = true;
    });

    document.querySelectorAll(".snack-bill-item button").forEach(button => {
        button.disabled = true;
    });

    document.getElementById("confirmBtn").disabled = true;

    updateSnackBill();

    updateSeats();

    message.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================
// CANCEL BOOKING
// =====================================

function cancelBooking() {

    if (!activeBooking) {

        alert("There is no confirmed booking to cancel.");

        return;

    }

    const confirmCancel = confirm(
        "Are you sure you want to cancel your booking?\n" +
        "Refund amount: ₹" + activeBooking.total
    );

    if (!confirmCancel) {
        return;
    }

    const showKey =
        activeBooking.movie + "|" +
        activeBooking.theatre + "|" +
        activeBooking.time;

    // Release the booked seats.

    bookedSeats[showKey] = bookedSeats[showKey].filter(
        seat => !activeBooking.seats.includes(seat)
    );

    const refundAmount = activeBooking.total;

    const bookingID = activeBooking.id;

    // Reset current booking.

    activeBooking = null;

    selectedSeats = [];

    // Reset refreshments.

    for (let item in snacks) {

        snacks[item].quantity = 0;

    }

    // Unlock the booking form.

    document.getElementById("movie").disabled = false;

    document.getElementById("theatre").disabled = false;

    document.getElementById("showtime").disabled = false;

    document.getElementById("confirmBtn").disabled = false;

    // Clear payment details.

    document.getElementById("cardNumber").value = "";

    document.getElementById("expiry").value = "";

    document.getElementById("cvv").value = "";

    document.getElementById("upiId").value = "";

    // Display cancellation message.

    document.getElementById("bookingMessage").textContent =
        "Your booking has been cancelled.";

    document.getElementById("cancelMessage").innerHTML =
        "✓ BOOKING CANCELLED!<br>" +
        "Booking ID: " + bookingID + "<br>" +
        "Refund initiated: ₹" + refundAmount +
        "<br>Your seats are available again.";

    updateSnackBill();

    updateSeats();

    updateBill();

}


// =====================================
// INITIAL PAGE SETUP
// =====================================

updateSnackBill();

updateSeats();

updateBill();
