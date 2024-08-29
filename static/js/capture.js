window.addEventListener(
	"keydown",
	function () {
		console.log("keydown");
		let downloadLink = document.createElement("a");
		downloadLink.setAttribute("download", canvas.id + ".png");
		let dataURL = canvas.toDataURL("image/png");
		let url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream");
		downloadLink.setAttribute("href", url);
		downloadLink.click();
	},
	true
);
