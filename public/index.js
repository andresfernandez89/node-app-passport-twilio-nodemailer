//Edit product
let editForm = document.querySelector("#editForm");
const sendPr = (e) => {
	if (e) e.preventDefault();
	let idPr = document.querySelector("#idPr").value;
	let timestampPr = new Date();
	let titlePr = document.querySelector("#titlePr").value;
	let descriptionPr = document.querySelector("#descriptionPr").value;
	let codePr = document.querySelector("#codePr").value;
	let thumbnailPr = document.querySelector("#thumbnailPr").value;
	let pricePr = document.querySelector("#pricePr").value;
	let stockPr = document.querySelector("#stockPr").value;

	return fetch("/api/products/" + idPr + "?admin=true", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			id: idPr,
			timestamp: timestampPr,
			title: titlePr,
			description: descriptionPr,
			code: codePr,
			thumbnail: thumbnailPr,
			price: pricePr,
			stock: stockPr,
		}),
	});
};
if (editForm) {
	editForm.addEventListener("submit", sendPr);
}

//Delete product
const sendId = (id) => {
	return fetch("/api/products/" + id + "?admin=true", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
};
