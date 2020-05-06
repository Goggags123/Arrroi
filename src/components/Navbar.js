import React, {Component} from "react";
import logo from "../images/logoweb2.png";
import menu from "../images/menu.png";
import shopping_cart from "../images/shopping-cart.png";
import notification from "../images/notification.png";
import {withRouter, Link} from "react-router-dom";
import {
	logout,
	updateNotification,
	clearAll,
	finish,
	clearShop,
} from "../redux/index";
import {connect} from "react-redux";
import {compose} from "redux";
import NavbarList from "./NavbarList";
import firebase from "../database/firebase";
import {toast} from "react-toastify";
import {firestoreConnect} from "react-redux-firebase";
class Navbar extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	componentWillMount = async () => {
		if (this.props.isLoggedIn) {
			let query = firebase.firestore();
			await query
				.collection("notification")
				.where("username", "==", this.props.username)
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
		}
	};

	showDropdown = () => {
		let x = document.getElementById("dropdown");
		if (x.className === "dropdown-block") {
			x.className = "dropdown-none";
		} else {
			x.className = "dropdown-block";
		}
	};
	showDropdownS = () => {
		let x = document.getElementById("dropdownS");
		if (x.className === "dropdown-block") {
			x.className = "dropdown-none";
		} else {
			x.className = "dropdown-block";
		}
	};
	sendCartData = async () => {
		let query = firebase.firestore().collection("cart");
		let carttmp;
		await query
			.doc(this.props.cart_id)
			.get()
			.then((documentsnapshot) => {
				carttmp = documentsnapshot.data().cartlist;
			})
			.catch(function (error) {
				console.log(error);
			});
		carttmp[carttmp.length - 1].productlist = this.props.productList;
		await query
			.doc(this.props.cart_id)
			.set({cartlist: carttmp})
			.catch(function (error) {
				console.log(error);
			});
		this.props.logout();
		this.props.clearAll();
		this.props.clearShop();
		this.props.history.push({
			pathname: "/login",
			state: this.props.location.pathname,
		});
	};
	notify = () => {
		let x = this.props.notification[0].notification_list.slice();
		let y = x.reverse()[0].title.split(" ");
		if (y[1].includes("ยกเลิก"))
			toast.error(
				<>
					<div align="center" style={{color: "white"}}>
						{y[0]}
					</div>
					<div align="center">{y[1]}</div>
				</>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
					pauseOnFocusLoss: false,
					closeButton: true,
				}
			);
		else
			toast.success(
				<>
					<div align="center" style={{color: "white"}}>
						{y[0]}
					</div>
					<div align="center">{y[1]}</div>
				</>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
					pauseOnFocusLoss: false,
					closeButton: true,
				}
			);
		this.props.updateNotification(x.length);
		return null;
	};
	render() {
		// console.log(this.props.notification,this.props.isFinished)
		return (
			<div className="row-flex navbar textM">
				{this.props.notification &&
				this.props.notification[0] &&
				this.props.isFinished &&
				parseInt(this.props.quantity) !==
					this.props.notification[0].notification_list.length
					? this.notify()
					: null}
				<img
					style={{
						width: "2%",
						margin: "0 1vw 0 0.25vw",
						cursor: "pointer",
					}}
					id="more_menu"
					src={menu}
					alt="menu"
					className="background"
					onClick={this.showDropdown}
				/>
				<div id="dropdown" className="dropdown">
					<NavbarList
						to="/about"
						name="- ค้นหาเมนู"
						style={{marginTop: "-0.5vw"}}
					/>
					<NavbarList to="/home" name="- หน้าแรก" />
					<NavbarList to="/menu" name="- เมนู" />
					<NavbarList
						to="/about"
						name="เมนูแนะนำ"
						style={{textIndent: "1.9vw"}}
					/>
					<NavbarList
						to="/about"
						name="อาหารเหนือ"
						style={{textIndent: "1.9vw"}}
					/>
					<NavbarList
						to="/about"
						name="อาหารอีสาน"
						style={{textIndent: "1.9vw"}}
					/>
					<NavbarList
						to="/about"
						name="อาหารกลาง"
						style={{textIndent: "1.9vw"}}
					/>
					<NavbarList
						to="/about"
						name="อาหารใต้"
						style={{textIndent: "1.9vw"}}
					/>
					<NavbarList to="/about" name="- สินค้ายอดฮิต" />
					<NavbarList to="/about" name="- เกี่ยวกับ" />
				</div>
				<img
					style={{
						width: "8vw",
						height: "7vw",
						margin: "-2.3vw 52vw 0 0",
					}}
					src={logo}
					alt="logo"
				/>
				<img
					style={{
						width: "1.3vw",
						height: "1.4vw",
						margin: "0.3vw 0.7vw 0vw 0",
						cursor: "pointer",
					}}
					onClick={() => {
						this.props.history.push(
							this.props.username
								? "/" + this.props.username + "/notification"
								: "/notification"
						);
					}}
					src={notification}
					alt="notification"
				/>
				<Link
					className="link"
					to={
						this.props.username
							? "/" + this.props.username + "/notification"
							: "/notification"
					}
					style={{
						fontSize: "1.4vw",
						margin: "-0.14vw 0 0 0",
					}}
				>
					Notification
				</Link>
				<div
					style={{
						borderLeft: "0.15vw solid #707070",
						margin: "0 2vw 0 2vw",
					}}
				/>
				{this.props.isLoggedIn ? (
					<>
						<div
							style={{
								cursor: "pointer",
								fontSize: "1.4vw",
								margin: "-0.14vw 0 0 0",
							}}
							id="more_menuS"
							onClick={this.showDropdownS}
						>
							{this.props.username}
						</div>
						<div
							id="dropdownS"
							className="dropdown"
							style={{left: "76.5vw", width: "13vw"}}
						>
							<NavbarList
								to={"/" + this.props.username + "/orders"}
								name="การซื้อของฉัน"
								style={{
									marginTop: "-0.5vw",
									textIndent: "1.5vw",
								}}
							/>
							<hr />
							<NavbarList
								to={"/" + this.props.username + "/sales"}
								name="การขายของฉัน"
								style={{
									textIndent: "1.5vw",
								}}
							/>
							<hr />
							<NavbarList
								to="/about"
								name="ร้านค้าของฉัน"
								style={{
									textIndent: "1.5vw",
								}}
							/>
							<hr />
							<NavbarList
								to="/about"
								name="สูตรอาหารของฉัน"
								style={{
									textIndent: "1.5vw",
								}}
							/>
							<hr />
							<div
								className="block dropdown-content textS"
								style={{
									textIndent: "1.5vw",
									cursor: "pointer",
								}}
								onClick={() => {
									this.sendCartData();
								}}
							>
								Log out
							</div>
						</div>
					</>
				) : (
					<>
						<Link
							className="link"
							to="/register"
							style={{
								fontSize: "1.4vw",
								margin: "-0.14vw 0 0 0",
							}}
						>
							Register
						</Link>
						<div
							style={{
								borderLeft: "0.15vw solid #707070",
								margin: "0 2vw 0 2vw",
							}}
						/>
						<Link
							to={{
								pathname: "/login",
								state: this.props.history.location.pathname,
							}}
							className="link"
							style={{
								fontSize: "1.4vw",
								margin: "-0.14vw 0 0 0",
							}}
						>
							Log in
						</Link>
					</>
				)}
				<Link
					className="link"
					// to={
					// 	this.props.isLoggedIn
					// 		? "/" + this.props.username + "/cart"
					// 		: {
					// 				pathname: "/login",
					// 				state: this.props.history.location.pathname,
					// 		  }
					// }
					onClick={() => {
						this.props.history.push(
							this.props.isLoggedIn
								? "/" + this.props.username + "/cart"
								: {
										pathname: "/login",
										state: this.props.history.location
											.pathname,
								  }
						);
						window.location.reload();
					}}
				>
					{this.props.numberOfItems !== 0 ? (
						<div
							style={{
								position: "absolute",
								fontSize: "1vw",
								padding:
									this.props.numberOfItems > 99
										? "0"
										: this.props.numberOfItems > 10
										? "0 0.3vw 0 0.3vw"
										: "0 0.5vw 0 0.5vw",
								backgroundColor: "red",
								borderRadius: "50%",
								left: "94.4%",
								top: "0.15vw",
								zIndex: "10",
							}}
						>
							{this.props.numberOfItems > 99
								? "99+"
								: this.props.numberOfItems}
						</div>
					) : null}
					<img
						style={{
							width: "2%",
							position: "absolute",
							left: "95%",
							top: "17%",
						}}
						src={shopping_cart}
						alt="menu"
						className="background"
					/>
				</Link>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.loginReducer.isLoggedIn,
		username: state.loginReducer.username,
		numberOfItems: state.addToCartReducer.numberOfItems,
		cart_id: state.addToCartReducer.id,
		productList: state.addToCartReducer.productList,
		notification: state.firestore.ordered.notification,
		quantity: state.notificationReducer.quantity,
		isFinished: state.notificationReducer.isFinished,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => dispatch(logout()),
		clearAll: () => dispatch(clearAll()),
		updateNotification: (length) => dispatch(updateNotification(length)),
		finish: () => dispatch(finish()),
		clearShop: () => dispatch(clearShop()),
	};
};
export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	firestoreConnect((props) => {
		return [
			{
				collection: "notification",
				limit: 1,
				where: [["username", "==", props.username]],
			},
		];
	}),
	withRouter
)(Navbar);
