const menuButton = document.querySelector(".nav-toggle");

if (menuButton) {
  const navigation = document.getElementById(menuButton.getAttribute("aria-controls"));

  if (navigation) {
    const closeMenu = () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      navigation.classList.toggle("is-open", !isOpen);
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 761px)").matches) {
        closeMenu();
      }
    });
  }
}

const matchGrid = document.getElementById("match-grid");
const teamFilter = document.getElementById("team-filter");

if (matchGrid && teamFilter) {
  const matchCards = Array.from(matchGrid.querySelectorAll(".match-card"));
  const scheduleStatus = document.getElementById("schedule-status");

  const filterMatches = () => {
    const selectedTeam = teamFilter.value;
    let visibleMatches = 0;

    for (const card of matchCards) {
      const teams = (card.dataset.teams || "").split(/\s+/);
      const shouldShow = selectedTeam === "all" || teams.includes(selectedTeam);
      card.hidden = !shouldShow;
      if (shouldShow) visibleMatches += 1;
    }

    if (scheduleStatus) {
      scheduleStatus.textContent = `Showing ${visibleMatches} ${visibleMatches === 1 ? "match" : "matches"}.`;
    }
  };

  teamFilter.addEventListener("change", filterMatches);
  filterMatches();

  const viewButtons = document.querySelectorAll("[data-view]");
  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      const isListView = button.dataset.view === "list";
      matchGrid.classList.toggle("is-list", isListView);

      for (const viewButton of viewButtons) {
        const isActive = viewButton === button;
        viewButton.classList.toggle("is-active", isActive);
        viewButton.setAttribute("aria-pressed", String(isActive));
      }
    });
  }
}

const bookingForm = document.getElementById("booking-form");

if (bookingForm) {
  const bookingResult = document.getElementById("booking-result");
  const bookingSummary = document.getElementById("booking-summary");
  const editBookingButton = document.getElementById("edit-booking");

  if (bookingResult && bookingSummary && editBookingButton) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(bookingForm);
      const match = bookingForm.querySelector("#match");
      const stand = bookingForm.querySelector("#stand");
      const preferences = Array.from(
        bookingForm.querySelectorAll('input[type="checkbox"]:checked'),
        (checkbox) => checkbox.labels?.[0]?.textContent.trim()
      ).filter(Boolean);

      const details = [
        ["Name", formData.get("name")],
        ["Email", formData.get("email")],
        ["Phone", formData.get("phone")],
        ["Match", match?.selectedOptions[0]?.textContent.trim()],
        ["Stand", stand?.selectedOptions[0]?.textContent.trim()],
        ["Tickets", formData.get("tickets")],
        ["Preferences", preferences.length ? preferences.join(", ") : "None"]
      ];

      bookingSummary.replaceChildren();

      for (const [label, value] of details) {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = String(value ?? "");
        bookingSummary.append(term, description);
      }

      bookingForm.hidden = true;
      bookingResult.hidden = false;
      bookingResult.focus();
    });

    editBookingButton.addEventListener("click", () => {
      bookingResult.hidden = true;
      bookingForm.hidden = false;
      bookingForm.querySelector("#name")?.focus();
    });
  }
}
