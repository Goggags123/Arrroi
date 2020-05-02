import React, {Component} from "react";
import BuyProduct from "./BuyProduct";
import {addToCart, removeFromCart} from "../redux/index";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import EmptyCart from "./EmptyCart";
// import firebase from "../database/firebase";

class Cart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// productList: this.props.productList,
			// totalPrice: 0,
			// paymentStatus: false,
		};
	}

	render() {
		if (this.props.isLoggedIn)
			if (parseInt(this.props.numberOfItems) !== 0)
				return (
					<div className="textS">
						<h1
							align="center"
							style={{fontSize: "4vw", marginBottom: "1vw"}}
						>
							รถเข็น
						</h1>
						{this.props.productList.map((product, i) => {
							if (product.quantity !== 0)
								return (
									<BuyProduct
										nameOfProduct={product.name}
										nameFood={product.name}
										color={i % 2 === 0 ? "brown" : "cream"}
										option={product.option}
										key={product.id}
										id={product.id}
										index={i}
										type="x"
										size={product.size}
										used={product.used}
										match={this.props.match}
										quantity={product.quantity}
									/>
								);
							else return null;
						})}
						<div
							style={{
								fontSize: "2vw",
								marginLeft: "25%",
								marginBottom: "1vw",
							}}
						>
							สรุปรายการสั่งซื้อ
						</div>
						<div style={{fontSize: "1.5vw", marginLeft: "35%"}}>
							<div
								className="row-flex"
								style={{marginBottom: "0.75vw"}}
							>
								<div style={{width: "30%"}}>ยอดรวม</div>
								<div style={{textAlign: "right", width: "15%"}}>
									{parseInt(this.props.totalPrice)}&nbsp;บาท
								</div>
							</div>
							<div
								className="row-flex"
								style={{marginBottom: "0.75vw"}}
							>
								<div style={{width: "30%"}}>ค่าจัดส่ง</div>
								<div style={{textAlign: "right", width: "15%"}}>
									50&nbsp;บาท
								</div>
							</div>
							<div
								className="row-flex"
								style={{marginBottom: "0.75vw"}}
							>
								<div style={{width: "30%"}}>ยอดรวมทั้งสิ้น</div>
								<div style={{textAlign: "right", width: "15%"}}>
									{parseInt(this.props.totalPrice) + 50}
									&nbsp;บาท
								</div>
							</div>
						</div>
						<button
							className="textS login"
							style={{position: "relative", left: "70vw"}}
							onClick={() => {
								this.props.history.push(
									"/" + this.props.username + "/cart/payment"
								);
							}}
						>
							ชำระเงิน
						</button>
					</div>
				);
			else return <EmptyCart />;
		else return <Redirect to="/login" />;
	}
}

const mapStateToProps = (state) => {
	return {
		productList: state.addToCartReducer.productList,
		totalPrice: state.addToCartReducer.totalPrice,
		numberOfItems: state.addToCartReducer.numberOfItems,
		username: state.loginReducer.username,
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (item) => dispatch(addToCart(item)),
		removeFromCart: (index) => dispatch(removeFromCart(index)),
	};
};
export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withRouter
)(Cart);
