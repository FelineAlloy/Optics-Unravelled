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

/* initialize popups for nature of light */
let params = new URL(document.location.toString()).searchParams;

const image_dict = {
	Newton: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/747px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg",
	rings: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Newton_rings.jpg/1200px-Newton_rings.jpg",
	Huygens:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Christiaan_Huygens-painting.jpeg/686px-Christiaan_Huygens-painting.jpeg",
	diffraction: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Doubleslit.gif",
	Young: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Thomas_Young_by_Briggs_cropped.jpg/705px-Thomas_Young_by_Briggs_cropped.jpg",
	Mallus: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Malus_by_Boilly_1810.jpg/375px-Malus_by_Boilly_1810.jpg",
	polarization:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Cross_linear_polarization.gif/330px-Cross_linear_polarization.gif",
	Fresnel:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Augustin_Fresnel.jpg/330px-Augustin_Fresnel.jpg",
	Maxwell:
		"https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Db_James_Clerk_Maxwell_in_his_40s_-2-7.jpg/330px-Db_James_Clerk_Maxwell_in_his_40s_-2-7.jpg",
	Hertz: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Heinrich_Rudolf_Hertz.jpg/330px-Heinrich_Rudolf_Hertz.jpg",
	photoelectric:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Photoelectric_effect_in_a_solid_-_diagram.svg/330px-Photoelectric_effect_in_a_solid_-_diagram.svg.png",
	Einstein:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/330px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg",
};

if (params.get("page") === "natureOfLight") {
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[target="_blank"]'));
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		tooltipTriggerEl.setAttribute("data-bs-toggle", "tooltip");
		tooltipTriggerEl.setAttribute("data-bs-placement", "top");
		tooltipTriggerEl.setAttribute("data-bs-html", "true");

		const id = tooltipTriggerEl.id;
		tooltipTriggerEl.title =
			"<img class='popup-img' src='" + image_dict[id] + "' alt='" + id + "'/>";

		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
}
