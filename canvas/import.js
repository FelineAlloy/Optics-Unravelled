function importContent(path) {
	return fetch(path)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json(); // Parse the response body as JSON
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}
