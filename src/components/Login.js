import React, {Component} from "react";
import LoginField from "./LoginField";
import {withRouter} from "react-router-dom";
import {
	login,
	importCart,
	updateNotification,
	finish,
	importShop,
} from "../redux/index";
import {connect} from "react-redux";
import {compose} from "redux";
import Input from "./Input";
import firebase from "../database/firebase";
class Login extends Component {
	constructor() {
		super();
		this.state = {
			Email: "",
			Password: "",
			username: "",
			error: {
				emailError: "",
				passwordError: "",
			},
			cart_id: "",
			cart: "",
			noti_id: "",
			shop_id: "",
		};
	}
	getCart = async () => {
		let query = firebase.firestore().collection("cart");
		await query
			.doc(this.state.cart_id)
			.get()
			.then((documentsnapshot) => {
				this.props.importCart(
					this.state.cart_id,
					documentsnapshot.data().cartlist[
						documentsnapshot.data().cartlist.length - 1
					].productlist
				);
				this.props.login(this.state.username);
			})
			.catch((e) => {
				console.log(e.message);
			});
	};

	getData = (e, data, what = true) => {
		if (what)
			this.setState({
				[e.target.id]: data,
			});
		else
			this.setState({
				[e.id]: data,
			});
	};
	getUsername = async () => {
		let query = firebase.firestore().collection("user");
		await query
			.where("email", "==", this.state.Email)
			.limit(1)
			.get()
			.then((querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					this.setState({
						username: documentsnapshot.data().username,
						cart_id: documentsnapshot.data().cartid,
					});
					this.props.importShop(documentsnapshot.data().store_id);
				});
			})
			.catch((e) => {
				console.log(e.message);
			});
	};
	getNotification = async () => {
		let query = firebase.firestore();
		await query
			.collection("notification")
			.where("username", "==", this.state.username)
			.limit(1)
			.get()
			.then((querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					this.props.updateNotification(
						documentsnapshot.data().notification_list.length
					);
					this.props.finish();
				});
			})
			.catch(function (error) {
				console.log("Error", error);
			});
	};
	signin = () => {
		firebase
			.auth()
			.signInWithEmailAndPassword(this.state.Email, this.state.Password)
			.then(async (u) => {
				await this.getUsername();
				await this.getNotification();
				await this.getCart();
			})
			.catch((e) => {
				this.setState((prevState) => {
					let error = Object.assign({}, prevState.error);
					error.emailError = "Email or password is incorrect.";
					error.passwordError = "Email or password is incorrect.";
					return {error};
				});
			});
	};
	handleSubmit = (event) => {
		let error = this.state.error;
		let isError = false;
		event.preventDefault();
		error.emailError = this.state.Email === "" ? "Email is required." : "";
		error.passwordError =
			this.state.Password === "" ? "Password is required." : "";
		isError =
			error.emailError !== "" || error.passwordError !== ""
				? true
				: false;
		this.setState({error});
		if (isError) {
			return false;
		}
		this.signin();
		return true;
	};

	render() {
		if (!this.props.isLoggedIn) {
			return (
				<div className="horizontal-center textS">
					<p className="title">Log in</p>
					<form
						id="login"
						className="form-login-center"
						onSubmit={this.handleSubmit}
						autoComplete="off"
					>
						<LoginField id="Email">
							<Input
								id="Email"
								pass={this.getData}
								position="right"
								disabled={this.state.error.emailError === ""}
								maxLength="25"
								display={this.state.error.emailError}
								type="text"
								style={{top: "-2.8vw", left: "37.6vw"}}
								default=""
							/>
						</LoginField>
						<LoginField id="Password">
							<Input
								id="Password"
								pass={this.getData}
								disabled={this.state.error.passwordError === ""}
								display={this.state.error.passwordError}
								position="right"
								maxLength="30"
								type="password"
								style={{top: "-3.3vw", left: "37vw"}}
								default=""
							/>
						</LoginField>
					</form>
					<button
						className="textS login"
						onClick={() => this.props.history.push("/register")}
					>
						Register
					</button>
					<button className="textS login" type="submit" form="login">
						Log in
					</button>
				</div>
			);
		} else {
			if (
				this.props.history.location.state &&
				this.props.history.location.state.from &&
				this.props.history.location.state.from !== "" &&
				(this.props.history.location.state.from.includes("menu") ||
					this.props.history.location.state.from.includes(
						this.props.username
					) ||
					this.props.history.location.state.from.includes("shop"))
			) {
				this.props.history.goBack();
			} else {
				this.props.history.push("/home");
			}
			return null;
		}
	}
}
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		login: (username) => dispatch(login(username)),
		importCart: (id, productList) => dispatch(importCart(id, productList)),
		updateNotification: (length) => dispatch(updateNotification(length)),
		finish: () => dispatch(finish()),
		importShop: (id) => dispatch(importShop(id)),
	};
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withRouter
)(Login);
