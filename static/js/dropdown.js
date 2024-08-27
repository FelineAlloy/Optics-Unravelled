/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdown(elem) {
	elem.parentElement.nextElementSibling.classList.toggle("show");
}

/* initialize tooltips with popper */
const help_title =
	"Poți mișca razele folosind <i class='fa-regular fa-hand'></i> sau <i class='fa-solid fa-circle fa-2xs'></i>, iar celeleate elemente, trăgând de capetele lor.";

const help_elem = document.getElementById("help");
help_elem.title = help_title;
const tooltip = new bootstrap.Tooltip(help_elem);
