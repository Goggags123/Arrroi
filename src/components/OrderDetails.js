import React, {Component} from "react";
import OrderDetailField from "./OrderDetailField";
import PaymentField from "./PaymentField";
import MyHistoryField from "./MyHistoryField";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import firebase from "../database/firebase";
import {newCart} from "../redux/index";

class OrderDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {userDetail: ""};
	}

	sendNotification = async (noti_key, username) => {
		let query = firebase.firestore().collection("notification");
		let noti_list = [];
		await query
			.doc(noti_key)
			.get()
			.then((documentsnapshot) => {
				noti_list = documentsnapshot.data().notification_list;
			}).catch((e) => {
                console.log(e.message);
            });
		noti_list.push({
			message:
				username +
				" ได้สั่งสินค้าในรถเข็น #" +
				this.props.cart_id +
				" และกำลังรอการตอบรับ",
			time: firebase.firestore.Timestamp.now(),
			title: username + " ได้สั่งสินค้า",
			type: "order",
		});
		await query
			.doc(noti_key)
			.update({
				notification_list: noti_list,
			})
			.catch((e) => {
				console.log(e.message);
			});
	};
	componentDidMount = async () => {
		window.scrollTo(0, 0);
		await this.importData();
		let x = document.getElementsByName("radio payment");
		x[0].checked = "checked";
	};
	importData = async () => {
		let query = firebase.firestore().collection("user");
		console.log(this.props.match.params.name);
		await query
			.where("username", "==", this.props.username)
			.limit(1)
			.get()
			.then((querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					this.setState({userDetail: documentsnapshot.data()});
				});
			})
			.catch((e) => {
				console.log(e.message);
			});
	};
	submitCart = async () => {
		let carttmp = "";
		let query = firebase.firestore().collection("cart");
		await query
			.doc(this.props.cart_id)
			.get()
			.then(async (documentsnapshot) => {
				carttmp = documentsnapshot.data().cartlist;
				carttmp[
					carttmp.length - 1
				].productlist = this.props.productList;
				carttmp[carttmp.length - 1].payment_status = true;
				let storeList = [];
				for (const product of carttmp[carttmp.length - 1].productlist) {
					let query2 = firebase.firestore().collection("product");
					await query2
						.doc(product.id.split(" ")[0])
						.get()
						.then((documentsnapshot) => {
							storeList.push(documentsnapshot.data().store_id);
						})
						.catch((e) => {
							console.log(e.message);
						});
				}
				let unique = storeList.filter((value, index, self) => {
					return self.indexOf(value) === index;
				});
				for (const store of unique) {
					let query3 = firebase.firestore().collection("user");
					await query3
						.where("store_id", "==", store)
						.limit(1)
						.get()
						.then((querysnapshot) => {
							querysnapshot.forEach(async (documentsnapshot) => {
								await this.sendNotification(
									documentsnapshot.data().noti_key,
									documentsnapshot.data().username
								);
							});
						})
						.catch((e) => {
							console.log(e.message);
						});
				}
				carttmp.push({
					created_at: firebase.firestore.Timestamp.now(),
					payment_status: Boolean(false),
					shop_check: Boolean(false),
					customer_check: Boolean(false),
					price: 0,
					productlist: [],
				});
				await query.doc(this.props.cart_id).set({cartlist: carttmp});

				this.props.newCart();
				this.props.history.push("/" + this.props.username + "/orders");
			});
	};

	render() {
		if (this.props.isLoggedIn)
			return (
				<div className="textS">
					<h1 align="center" style={{fontSize: "4vw"}}>
						รายละเอียดคำสั่งซื้อ
					</h1>
					<p style={{marginLeft: "calc(0vw + 18%)", fontSize: "2vw"}}>
						ข้อมูล
					</p>
					<MyHistoryField
						color="brown"
						name={
							this.state.userDetail.name +
							" " +
							this.state.userDetail.surname
						}
						phone={this.state.userDetail.phone}
						email={this.state.userDetail.email}
						address={this.state.userDetail.address}
					></MyHistoryField>
					<p
						style={{
							margin:
								"calc(0vw + 1%) 0 calc(0vw + 1%) calc(0vw + 18%)",
							fontSize: "2vw",
						}}
					>
						รายการสินค้าที่สั่งซื้อ
					</p>
					{this.props.productList.map((product, i) => {
						return (
							<OrderDetailField
								nameFood={product.name}
								size={product.size}
								price={product.price}
								quantity={product.quantity}
								key={product.id + "order"}
							></OrderDetailField>
						);
					})}
					<div
						style={{
							fontSize: "2vw",
							marginLeft: "calc(0vw + 18%)",
							marginBottom: "1vw",
							marginTop: "calc(0vw + 1%)",
						}}
					>
						สรุปรายการสั่งซื้อ
					</div>
					<div
						style={{
							fontSize: "1.5vw",
							marginLeft: "calc(0vw + 35%)",
						}}
					>
						<div
							className="row-flex"
							style={{marginBottom: "0.75vw"}}
						>
							<div style={{width: "calc(0vw + 30%)"}}>ยอดรวม</div>
							<div
								style={{
									textAlign: "right",
									width: "calc(0vw + 15%)",
								}}
							>
								{parseInt(this.props.totalPrice)}&nbsp;บาท
							</div>
						</div>
						<div
							className="row-flex"
							style={{marginBottom: "0.75vw"}}
						>
							<div style={{width: "calc(0vw + 30%)"}}>
								ค่าจัดส่ง
							</div>
							<div
								style={{
									textAlign: "right",
									width: "calc(0vw + 15%)",
								}}
							>
								50&nbsp;บาท
							</div>
						</div>
						<div
							className="row-flex"
							style={{marginBottom: "0.75vw"}}
						>
							<div
								style={{width: "calc(0vw + 30%)", color: "red"}}
							>
								ยอดรวมทั้งสิ้น
							</div>
							<div
								style={{
									textAlign: "right",
									width: "calc(0vw + 15%)",
									color: "red",
								}}
							>
								{parseInt(this.props.totalPrice) + 50}&nbsp;บาท
							</div>
						</div>
					</div>
					<div
						style={{
							fontSize: "2vw",
							marginLeft: "18vw",
							marginBottom: "1vw",
							marginTop: "2vw",
						}}
					>
						กรุณาเลือกวิธีชำระเงิน
					</div>
					<div className="payment">
						<PaymentField
							nameIcon="ไทยพาณิชย์"
							bank="ธนาคารไทยพาณิชย์"
						></PaymentField>
						<PaymentField
							nameIcon="ธนาคารกรุงเทพ"
							bank="ธนาคารกรุงเทพ"
						></PaymentField>
						<PaymentField
							nameIcon="กสิกร"
							bank="ธนาคารกสิกร"
						></PaymentField>
					</div>
					<div className="payment">
						<PaymentField
							nameIcon="กรุงไทย"
							bank="ธนาคารกรุงไทย"
						></PaymentField>
						<PaymentField
							nameIcon="truemoneywallet"
							bank="True money wallet"
						></PaymentField>
						<PaymentField
							nameIcon="money"
							bank="ชำระเงินปลายทาง"
						></PaymentField>
					</div>
					<button className="textS Order" onClick={this.submitCart}>
						สั่งสินค้า
					</button>
				</div>
			);
		else return <Redirect to="/login" />;
	}
}
const mapStateToProps = (state) => {
	return {
		productList: state.addToCartReducer.productList,
		totalPrice: state.addToCartReducer.totalPrice,
		username: state.loginReducer.username,
		cart_id: state.addToCartReducer.id,
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		newCart: () => dispatch(newCart()),
	};
};
export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withRouter
)(OrderDetails);
