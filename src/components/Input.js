import React, {Component} from "react";
import {Tooltip as Tippy} from "react-tippy";
import {updateCart} from "../redux/index";
import {connect} from "react-redux";

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.default,
			open: false,
			isFocused: false,
		};
		this.props.quantity
			? this.props.updateCart(
					this.props.index,
					this.state.text,
					this.props.size
			  )
			: console.log("");
	}
	componentWillMount = () => {
		if (this.props.onRef) this.props.onRef(undefined);
	};
	componentDidMount = () => {
		if (this.props.onRef) this.props.onRef(this);
	};
	addValue = (event) => {
		this.setState(
			(prevState) => ({
				text:
					parseInt(prevState.text) < 999
						? parseInt(prevState.text) <
						  parseInt(this.props.boundary)
							? parseInt(prevState.text) + 1
							: parseInt(this.props.boundary)
						: 999,
			}),
			() => {
				this.props.pass(event, this.state.text);
				if (this.props.id.split(" ").length > 2)
					this.props.updateCart(
						this.props.index,
						this.state.text,
						this.props.size
					);
			}
		);
	};
	decreaseValue = (event) => {
		this.setState(
			(prevState) => ({
				text:
					parseInt(prevState.text) >
					(this.props.id.includes("button") ? 1 : 0)
						? parseInt(prevState.text) - 1
						: this.props.id.includes("button")
						? 1
						: 0,
			}),
			() => {
				this.props.pass(event, this.state.text);
				if (this.props.id.split(" ").length > 2)
					this.props.updateCart(
						this.props.index,
						this.state.text,
						this.props.size
					);
			}
		);
	};
	setText = (event, quantity) => {
		let value = quantity;
		if (quantity === 0) value = 1;
		this.setState({
			text: value,
		});
		this.props.pass(event, value);
		if (this.props.index)
			this.props.updateCart(this.props.index, value, this.props.size);
	};
	handleChange = (event) => {
		this.setState({
			text: event.target.value,
		});
		if (event.target.id.includes("button")) {
			if (parseInt(event.target.value) === 0) {
				event.target.value = 1;
			}
			if (parseInt(event.target.value) > this.props.boundary) {
				event.target.value = this.props.boundary;
			}
			this.setState({
				text: event.target.value,
			});
			this.props.pass(event, parseInt(event.target.value));
			if (this.props.id.split(" ").length > 2)
				this.props.updateCart(
					this.props.index,
					this.state.text,
					this.props.size
				);
		} else this.props.pass(event, event.target.value);
	};
	handleClick = (event) => {
		let x = document.getElementById("Password");
		let y = document.getElementById("Email");
		if (event.target.id === "Password icon") {
			if (x.type === "password") {
				event.target.className = "login-showPassword showPassword";
				x.type = "text";
			} else if (x.type === "text") {
				event.target.className = "login-hidePassword hidePassword";
				x.type = "password";
			}
		}
		if (event.target.id === "Email icon") {
			this.setState({
				text: "",
			});
			this.props.pass(y, "", false);
		}
	};
	setCheck = (event) => {
		if (event.target.id.includes("button")) {
			if (event.target.value === "") {
				event.target.value = 1;
			}
			this.setState({
				text: event.target.value,
			});
			this.props.pass(event, parseInt(event.target.value));
			if (this.props.id.split(" ").length > 2)
				this.props.updateCart(
					this.props.index,
					this.state.text,
					this.props.size
				);
		}
	};
	checkInput = (event) => {
		if (this.props.id.includes("button")) {
			if (
				!/[\d]+/g.test(event.key) &&
				event.key !== "ArrowLeft" &&
				event.key !== "ArrowRight" &&
				event.key !== "Backspace" &&
				event.key !== "Tab" &&
				event.key !== "Enter" &&
				event.key !== "Delete"
			) {
				event.preventDefault();
			}
		} else {
			switch (event.target.id) {
				case "Password":
				case "รหัสผ่าน":
				case "ยืนยันรหัสผ่าน":
					if (!/[0-9A-Za-z]+/g.test(event.key))
						event.preventDefault();
					break;
				case "บัญชีผู้ใช้":
					if (!/[\w]+/g.test(event.key)) event.preventDefault();
					break;
				case "Email":
				case "อีเมล":
					if (
						!/[a-z0-9!#$%&"'*+-/=?^_`{|}~(),:;<>@[\].]+/g.test(
							event.key
						)
					)
						event.preventDefault();
					break;
				case "เบอร์โทรศัพท์":
					if (
						!/[\d]+/g.test(event.key) &&
						event.key !== "ArrowLeft" &&
						event.key !== "ArrowRight" &&
						event.key !== "Backspace" &&
						event.key !== "Tab" &&
						event.key !== "Enter" &&
						event.key !== "Delete"
					)
						event.preventDefault();
					break;
				case "ที่อยู่":
					if (
						!/[\u0E00-\u0E7F0-9A-Za-z\s\./]+/g.test(event.key) ||
						event.key === "Enter"
					)
						event.preventDefault();
					break;
				default:
					if (!/[\u0E00-\u0E7FA-Za-z]+/g.test(event.key))
						event.preventDefault();
					break;
			}
		}
	};

	render() {
		if (this.props.id === "ที่อยู่")
			return (
				<textarea
					className={
						"register" + (this.props.disabled ? "" : " error")
					}
					onPaste={(event) => {
						event.preventDefault();
					}}
					type={this.props.type}
					id={this.props.id}
					value={this.state.text}
					onChange={this.handleChange}
					maxLength={this.props.maxLength}
					onKeyDown={this.checkInput}
					onPaste={(event) => {
						event.preventDefault();
					}}
					placeholder={this.props.placeholder}
				/>
			);
		else if (this.props.id.includes("button")) {
			return (
				<>
					<input
						className={
							"button textS " +
							(this.props.boundary === 0 ? "gray" : "normal")
						}
						type="button"
						value="-"
						disabled={this.props.boundary === 0 ? "false" : null}
						onClick={this.decreaseValue}
					/>
					<input
						className={
							"numOfProduct textS " +
							(this.props.boundary === 0 ? "gray" : "normal")
						}
						id={this.props.id}
						value={this.state.text}
						onChange={this.handleChange}
						onPaste={(event) => {
							event.preventDefault();
						}}
						onBlur={this.setCheck}
						onKeyDown={this.checkInput}
						maxLength={this.props.maxLength}
						onClick={(e) => {
							e.target.select();
						}}
						disabled={this.props.boundary === 0 ? "false" : null}
					/>
					<input
						className={
							"button textS " +
							(this.props.boundary === 0 ? "gray" : "normal")
						}
						type="button"
						value="+"
						disabled={this.props.boundary === 0 ? "false" : null}
						onClick={this.addValue}
					/>
					&nbsp;&nbsp;{this.props.unitOfProduct}
				</>
			);
		} else if (this.props.hidden)
			return (
				<input
					maxLength={this.props.maxLength}
					className={
						"register" + (this.props.disabled ? "" : " error")
					}
					onPaste={(event) => {
						event.preventDefault();
					}}
					type={this.props.type}
					id={this.props.id}
					value={this.state.text}
					onChange={this.handleChange}
					onKeyDown={this.checkInput}
					placeholder={this.props.placeholder}
				/>
			);
		else
			return (
				<>
					<Tippy
						disabled={this.props.disabled}
						position={this.props.position}
						arrow="true"
						arrowSize="small"
						theme="error"
						open={this.state.open}
						html={<div className="error">{this.props.display}</div>}
						style={{width: "100%", height: "10%"}}
					>
						<input
							onPaste={(event) => {
								event.preventDefault();
							}}
							maxLength={this.props.maxLength}
							className={
								(this.props.className == null
									? this.props.id === "Email"
										? "user"
										: "pass"
									: this.props.className) +
								(this.props.display === "" ? "" : " error")
							}
							onMouseEnter={() => {
								this.setState({open: true});
							}}
							onFocus={() => {
								this.setState({open: true, isFocused: true});
							}}
							onBlur={() => {
								this.setState({open: false, isFocused: false});
							}}
							onMouseOut={() => {
								if (!this.state.isFocused)
									this.setState({open: false});
							}}
							type={this.props.type}
							id={this.props.id}
							value={this.state.text}
							onChange={this.handleChange}
							onKeyDown={this.checkInput}
						/>
					</Tippy>
					<div className="row-flex">
						<button
							type="button"
							id={this.props.id + " icon"}
							className={
								this.props.id === "Email"
									? "login-close close"
									: "login-hidePassword hidePassword"
							}
							tabIndex="-1"
							style={this.props.style}
							onClick={this.handleClick}
						/>
					</div>
				</>
			);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateCart: (index, value, size) =>
			dispatch(updateCart(index, value, size)),
	};
};
export default connect(null, mapDispatchToProps)(Input);
