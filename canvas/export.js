function exportContent() {
	const jsonData = { rays: rays, objects: objects };
	const jsonString = JSON.stringify(jsonData);

	const fileName = prompt("Enter a file name:", "exported-content.json");

	if (fileName) {
		const blob = new Blob([jsonString], { type: "application/json" });

		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = fileName;
		document.body.appendChild(a);

		a.click();

		URL.revokeObjectURL(a.href);
		document.body.removeChild(a);
	}
}

const exportButton = document.getElementById("export-button");
exportButton.onclick = exportContent;
