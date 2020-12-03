const getCurrentPrice = (e) => {
	e.preventDefault();

	if ($().val("#symbol") == '') {
		handleError("All fields are required");
		return false;
	}

	//console.log($("#searchForm").serialize());
	sendAjax('POST', '/getCurrentPrice', $("#searchForm").serialize(), (result) => {
		//console.log(document.querySelector("#symbol").value);
		ReactDOM.render(
			<BuyForm symbol={document.querySelector("#symbol").value} price={result.data} csrf={document.querySelector("#csrf").value} />, document.querySelector("#transactions")
		);
	});

	return false;
}

const SearchForm = (props) => {
	return (
		<form id="searchForm"
			name="searchForm"
			onSubmit={getCurrentPrice}
			action="/getInfo"
			method="POST"
			className="transactionForm"
		>
			<label htmlFor="symbol">Search Company: </label>
			<input id="symbol" type="text" name="symbol" placeholder="Symbol (ex: IBM)"></input>
			<input id="csrf" type="hidden" name="_csrf" value={props.csrf}></input>
			<input className="makeTransactionSubmit" type="submit" value="Search"></input>
		</form>
	);
};

const buyStock = (e) => {
	e.preventDefault();

	if ($().val("#amount") == '' || $().val("#amount") == 0) {
		handleError("Please Enter an Amount to Buy");
		return false;
	}

	sendAjax('POST', '/makeTransaction', $("#buyForm").serialize(), (result) => {
		location.reload();
	});

	return false;
}

const BuyForm = (props) => {
	return (
		<form id="buyForm"
			name="buyForm"
			onSubmit={buyStock}
			action="/getInfo"
			method="GET"
			className="buyForm"
		>
			<span>{props.symbol}:</span>
			<input type="hidden" name="symbol" value={props.symbol}></input>
			<span> ${props.price} each</span>
			<input type="hidden" name="price" value={props.price}></input>
			<label htmlFor="amount">Buy: </label>
			<input id="amount" type="number" min="0" max="1000" name="amount" placeholder="Quantity"></input>
			<input type="hidden" name="_csrf" value={props.csrf}></input>
			<input className="makeTransactionSubmit" type="submit" value="Buy"></input>
		</form>
	);
};

const TransactionList = function (props) {
	if (props.transactions.length === 0) {
		return (
			<div className="transactionList">
				<h3 className="emptyTransaction">No History yet</h3>
			</div>
		);
	}

	const transactionNodes = props.transactions.map(function (transaction) {
		return (
			<tr>
				<td>{transaction.symbol}</td>
				<td>{transaction.amount}</td>
				<td>{transaction.price}</td>
			</tr>
		);
	});

	return (
		<div className="transactionList">
			<h1>Your Stocks:</h1>
			<tr>
				<th>Company</th>
				<th>Amount</th>
				<th>Price</th>
			</tr>
			{transactionNodes}
		</div>	
	);
};

const updatePassword = (e) => {
	e.preventDefault();
	
	sendAjax('POST', '/updatePassword', $("#newPassForm").serialize(), (data) => {
		location.reload();
	});
	return false;
}

const UserProfile = function (props) {
	return (
		<div>
			<h3>Username: </h3><p> {props.profile.username}</p>
			<h3>Account Created: </h3><p> {props.profile.createdDate}</p>
			
			<form id="newPassForm"
				name="newPassForm"
				onSubmit={updatePassword}
				action="/updatePassword"
				method="POST"
				className="newPassForm"
			>
				<h1>Reset Password Here (will log user out)</h1>
				<label htmlFor="pass">Password: </label>
				<input type="password" name="pass" placeholder="password"></input>
				<label htmlFor="pass2">Retype Password: </label>
				<input type="password" name="pass2" placeholder="retype password"></input>
				<input id="csrf" type="hidden" name="_csrf" value={props.csrf}></input>
				<br></br>
				<input className="makeTransactionSubmit" type="submit" value="Reset"></input>
			</form>
		</div>
	);
};

const loadTransactionsFromServer = () => {
	sendAjax('GET', '/getTransactions', null, (data) => {
		ReactDOM.render(
			<TransactionList transactions={data.transactions} />, document.querySelector("#transactions")
		);
	});
};

const createTransactionWindow = (csrf) => {
	ReactDOM.render(
		<SearchForm csrf={csrf} />, document.querySelector("#makeTransactions")
	);

	ReactDOM.render(
		<TransactionList transactions={[]} />, document.querySelector("#transactions")
	);

	loadTransactionsFromServer();
};

const createProfileWindow = (csrf) => {
	ReactDOM.render(
		null, document.querySelector("#makeTransactions")
	);

	sendAjax('GET', '/getProfile', null, (data) => {
		//console.log(data);
		ReactDOM.render(
			<UserProfile profile={data.profile} csrf={csrf} />, document.querySelector("#transactions")
		);
	});
};

const setup = function (csrf) {
	const transactionButton = document.querySelector("#showTransactions");
	const profileButton = document.querySelector("#showProfile");

	transactionButton.addEventListener("click", (e) => {
		e.preventDefault();
		createTransactionWindow(csrf);
		return false;
	});

	profileButton.addEventListener("click", (e) => {
		e.preventDefault();
		createProfileWindow(document.querySelector("#csrf").value);
		return false;
	});

	createTransactionWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});