import React, {Component} from "react";
import getImage from "../database/getImage";
import Input from "./Input";
import {addToCart, removeFromCart} from "../redux/index";
import {connect} from "react-redux";
import {compose} from "redux";
import Image from "./Image";
import {updateCart, updateOption} from "../redux/index";
import {withRouter} from "react-router-dom";
import {toast} from "react-toastify";

class BuyProduct extends Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
		this.state = {
			size_name: this.props.option[0].size,
			quantity: this.props.quantity ? this.props.quantity : 1,
			size: this.props.size
				? this.props.option.findIndex(
						(item) => item.size === this.props.size
				  )
				: 0,
		};
	}
	getData = (e, data) => {
		this.setState({
			quantity: data,
		});
	};
	addItem = () => {
		if (this.props.isLoggedIn) {
			let product = {
				name: this.props.nameOfProduct,
				size: this.state.size_name,
				price:
					this.props.option[this.state.size].price *
					this.state.quantity,
				quantity: parseInt(this.state.quantity),
				option: this.props.option,
				id: this.props.id + " " + this.props.numberOfItems,
			};
			this.props.addToCart(product);
			toast(
				<>
					<div align="center" style={{color: "#814A2C"}}>
						คุณได้เพิ่ม&nbsp;
						<span style={{color: "black"}}>
							[{this.props.nameOfProduct}]
						</span>
					</div>
					<div align="center" style={{color: "#814A2C"}}>
						&nbsp;เข้ารถเข็นแล้ว
					</div>
				</>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
					pauseOnFocusLoss: false,
					closeButton: true,
				}
			);
		} else this.props.history.push("/login");
	};
	componentDidMount = () => {
		let x = document.getElementsByName("radio " + this.props.id);
		x[this.state.size].checked = "checked";
	};
	setSize = (event) => {
		let x = document.getElementsByName("radio " + this.props.id);
		for (let i = 0; i < x.length; i++) {
			if (x[i].checked) {
				this.setState(
					(prevState) => ({
						...prevState,
						size: i,
						size_name: this.props.option[i].size,
					}),
					() => {
						let x = this.props.option[this.state.size].quantity;
						if (this.props.option[this.state.size].quantity === 0)
							x = 0;
						if (
							this.state.quantity >
							this.props.option[this.state.size].quantity
						) {
							this.child.setText(event, x);
							this.setState(
								{
									quantity: x,
								},
								() => {
                                    if (this.props.id.split(" ").length > 1)
                                    
										this.props.updateCart(
											this.props.index,
											this.state.quantity,
											this.state.size
										);
								}
							);
						} else if (this.props.id.split(" ").length > 1)
							this.props.updateCart(
								this.props.index,
								this.state.quantity,
								this.state.size
							);
					}
				);
			}
		}
	};
	render() {
		return (
			<div
				className="storeBox textS"
				style={
					this.props.color === "brown"
						? {backgroundColor: "#814A2C", color: "white"}
						: {backgroundColor: "#EBC27C", color: "black"}
				}
			>
				<img
					className="imgFood"
					id={this.props.nameOfProduct}
					name={this.props.nameOfProduct}
					alt={this.props.nameOfProduct}
				/>

				<div className="productDetail">
					<u className="nameOfProduct">{this.props.nameOfProduct}</u>
					{this.props.match.url.includes("menu") ? (
						<span style={{fontSize: "1vw", float: "right"}}>
							จำนวนที่ใช้ตามสูตร {this.props.used}
						</span>
					) : null}
					<div style={{wordWrap: "break-word"}}>
						{this.props.detail}
					</div>
					<p style={{fontSize: "2.2vw", margin: "1vw 0 1vw 0"}}>
						ราคา{" "}
						{this.props.option[this.state.size].price *
							(this.state.quantity
								? this.state.quantity 
								: 0)}{" "}
						บาท
					</p>
					<div
						className="row-flex"
						style={{
							justifyContent: "space-between",
							margin: "0 0 1vw 0",
						}}
					>
						<span>ปริมาณ</span>
						{this.props.option.map((option, i) => {
							return (
								<label key={this.props.id + " " + i}>
									<input
										type="radio"
										name={"radio " + this.props.id}
										onChange={this.setSize}
										className="radio"
									/>
									<span>{option.size}</span>
								</label>
							);
						})}
					</div>
					<label htmlFor="button">จำนวน</label>&nbsp;&nbsp;
					<Input
						pass={this.getData}
						id={"button " + this.props.id}
						default={this.props.quantity ? this.props.quantity : 1}
						onRef={(ref) => (this.child = ref)}
						maxLength="3"
						index={this.props.index}
						size={this.state.size}
						boundary={this.props.option[this.state.size].quantity}
						quantity={this.props.quantity}
					/>
					<span>
						สินค้าที่เหลือ&nbsp;
						{this.props.option[this.state.size].quantity}&nbsp;ชิ้น
					</span>
					{this.props.type === "x" ? (
						<div>
							<Image
								style={{
									width: "2.3vw",
									float: "right",
									cursor: "pointer",
									margin: "1vw 0 1.5vw 0",
								}}
								nameIcon="trash"
								alt="trash"
								onClick={() => {
									this.props.removeFromCart(this.props.index);
								}}
							/>
						</div>
					) : (
						<button
							className={
								"addToCartButton textS " +
								(this.props.option[this.state.size].quantity ===
								0
									? " gray"
									: " normal")
							}
							align="center"
							style={
								this.props.color === "brown"
									? {backgroundColor: "#4A362B"}
									: {backgroundColor: "#814A2C"}
							}
							disabled={
								this.props.option[this.state.size].quantity ===
								0
									? "false"
									: null
							}
							onClick={this.addItem}
						>
							<Image
								className="cartImg"
								nameIcon="cartW"
								alt="shopping_cart"
							/>
							<span style={{position: "relative", top: "-0.9vw"}}>
								เพิ่มในรถเข็น
							</span>
						</button>
					)}
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		numberOfItems: state.addToCartReducer.numberOfItems,
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (item) => dispatch(addToCart(item)),
		removeFromCart: (id) => dispatch(removeFromCart(id)),
		updateCart: (index, value, size) =>
			dispatch(updateCart(index, value, size)),
		updateOption: (option, index) => dispatch(updateOption(option, index)),
	};
};
export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	getImage,
	withRouter
)(BuyProduct);
