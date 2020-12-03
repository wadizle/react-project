const ApiDemo = (props) => {
	return (
		<div>
			<h2>See Console for data from API</h2>
		</div>
	);
};

const getInfo = () => {
	sendAjax('GET', '/getInfo', null, (result) => {
		console.log(result.data);
		ReactDOM.render(
			<ApiDemo data={result.data} />, document.querySelector("#content")
		);
	});
}

$(document).ready(function () {
	//getToken();
	getInfo();
});