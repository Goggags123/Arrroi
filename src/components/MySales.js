import React, {Component} from "react";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import OrderDetailField from "./OrderDetailField";
import firebase from "../database/firebase";
import {removeShop} from "../redux/index";

class MySales extends Component {
	sendNotification = async (username, text, cartid) => {
		let query = firebase.firestore().collection("user");
		let noti_key;
		let noti_list = [];
		await query
			.where("username", "==", username)
			.limit(1)
			.get()
			.then((querysnapshot) => {
                querysnapshot.forEach((documentsnapshot) => {
                    noti_key = documentsnapshot.data().noti_key;
                });
			})
			.catch((e) => {
				console.log(e.message);
			});
		query = firebase.firestore().collection("notification");
		await query
			.doc(noti_key)
			.get()
			.then((documentsnapshot) => {
				noti_list = documentsnapshot.data().notification_list;
			})
			.catch((e) => {
				console.log(e.message);
			});
		noti_list.push({
			message:
				text === "cancel"
					? "ขออภัยรถเข็นหมายเลข #" +
					  cartid +
					  " ได้ถูกยกเลิกคำขอ อาจเนื่องจากเกิดข้อผิดพลาดบางสาเหตุ"
					: "รถเข็นหมายเลข #" +
					  cartid +
					  " ได้ถูกยอมรับคำขอแล้ว อยู่ในข่วงการส่งสินค้า",
			time: firebase.firestore.Timestamp.now(),
			title:
				text === "cancel"
					? "#" + cartid + " ได้ถูกยกเลิก"
					: "#" + cartid + " ได้รับการตอบรับแล้ว",
			type: "order",
		});
		await query.doc(noti_key).update({
			notification_list: noti_list,
		});
	};
	deleteCart = async (event) => {
		let x = parseInt(event.target.id.split(" ")[0]);
		let y = event.target.id.split(" ")[1];
		let query = firebase.firestore().collection("cart");
		let carttmp = "",
			cartid = "";
		for (let i = 0; i < this.props.orderList.length; i++) {
			if (
				this.props.orderList[i].userId ===
				this.props.match.params.customer
			) {
				cartid = this.props.orderList[i].userDetail.cartid;
				await query
					.doc(cartid)
					.get()
					.then(async (documentsnapshop) => {
						carttmp = documentsnapshop.data().cartlist;
						let tmp = "";
						if (y !== "cancel") {
							for (const [index, product] of carttmp[
								this.props.orderList[i].cartList[x]
									.realCartIndex
							].productlist.entries()) {
								let query2 = firebase
									.firestore()
									.collection("product");
								await query2
									.doc(product.id.split(" ")[0])
									.get()
									.then((documentsnapshot) => {
										tmp = documentsnapshot.data().option;
										tmp[
											product.option.findIndex(
												(item) =>
													item.size === product.size
											)
										].quantity < product.quantity
											? (tmp[
													product.option.findIndex(
														(item) =>
															item.size ===
															product.size
													)
											  ].quantity = 0)
											: (tmp[
													product.option.findIndex(
														(item) =>
															item.size ===
															product.size
													)
											  ].quantity -= product.quantity);
									})
									.catch(function (error) {
										console.log("Error", error);
									});
								await query2
									.doc(product.id.split(" ")[0])
									.update({option: tmp});
							}
						}
						carttmp[
							this.props.orderList[i].cartList[x].realCartIndex
						].shop_check = true;
						if (y === "cancel")
							{carttmp[
								this.props.orderList[i].cartList[
									x
								].realCartIndex
                        ].customer_check = true;
                        carttmp[
                            this.props.orderList[i].cartList[
                                x
                            ].realCartIndex
                        ].delete = true;
                        }
						this.props.removeShop(
							x,
							this.props.orderList[i].userDetail.username
						);
						await query
							.doc(cartid)
							.set({cartlist: carttmp})
							.catch((e) => {
								console.log(e.message);
							});
						await this.sendNotification(
							this.props.orderList[i].userDetail.username,
							y === "cancel" ? "cancel" : "accept",
							cartid
						);
					})
					.catch((e) => {
						console.log(e.message);
					});
			}
		}
	};
	checkNumber = (order) => {
		for (let j = 0; j < order.cartList.length; j++) {
			if (!order.cartList[j].shop_check) {
				return true;
			}
		}
		this.props.history.push("/" + this.props.username + "/sales");
		return false;
	};

	render() {
		if (this.props.isLoggedIn)
			if (this.props.orderList)
				return (
					<div className="textS">
						{this.props.orderList.map((order, k) => {
							if (
								order.userId ===
								this.props.match.params.customer
							) {
								if (this.checkNumber(order))
									return (
										<div key={k * k}>
											<h1
												align="center"
												style={{fontSize: "4vw"}}
											>
												{order.userDetail.username}
											</h1>
											<div className="MySales textS">
												การขายของฉัน
											</div>
											{order.cartList.map((cart, j) => {
												if (!cart.shop_check)
													return (
														<div key={j + k}>
															{cart.productList.map(
																(
																	product,
																	i
																) => {
																	return (
																		<OrderDetailField
																			nameFood={
																				product.name
																			}
																			size={
																				product.size
																			}
																			price={
																				product.price
																			}
																			quantity={
																				product.quantity
																			}
																			key={
																				product.id +
																				" " +
																				i +
																				" sales" +
																				k +
																				j
																			}
																		></OrderDetailField>
																	);
																}
															)}
															<div
																align="center"
																key={
																	j +
																	" sales " +
																	k
																}
																className="row-flex"
																style={{
																	justifyContent:
																		"center",
																}}
															>
																<button
																	onClick={
																		this
																			.deleteCart
																	}
																	className="login textS"
																	style={{
																		width:
																			"auto",
																		padding:
																			"0.5vw",
																		fontSize:
																			"1.8vw",
																		marginTop:
																			"2vw",
																		marginBottom:
																			"2vw",
																	}}
																	id={
																		j +
																		" accept"
																	}
																>
																	ฉันได้ตรวจสอบและส่งสินค้าแล้ว
																</button>
																<button
																	onClick={
																		this
																			.deleteCart
																	}
																	className="login textS"
																	style={{
																		width:
																			"auto",
																		padding:
																			"0.5vw",
																		fontSize:
																			"1.8vw",
																		marginTop:
																			"2vw",
																		marginBottom:
																			"2vw",
																	}}
																	id={
																		j +
																		" cancel"
																	}
																>
																	ยกเลิกรายการสั่งซื้อ
																</button>
															</div>
														</div>
													);
												else return null;
											})}
										</div>
									);
							} else return null;
						})}
					</div>
				);
			else return null;
		else return <Redirect to="/login" />;
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		removeShop: (index, username) => dispatch(removeShop(index, username)),
	};
};
const mapStateToProps = (state) => {
	return {
		orderList: state.shopReducer.orderList,
		username: state.loginReducer.username,
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withRouter
)(MySales);
