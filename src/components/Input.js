import React, {Component} from "react";
import {Tooltip as Tippy} from "react-tippy";

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: props.default,
			open: false,
			isFocused: false,
		};
	}
	addValue = () => {
		this.setState((prevState) => ({
			text:
				parseInt(prevState.text) < 999
					? parseInt(prevState.text) + 1
					: 999,
		}));
	};
	decreaseValue = () => {
		this.setState((prevState) => ({
			text:
				parseInt(prevState.text) > 0 ? parseInt(prevState.text) - 1 : 0,
		}));
	};
	handleChange = (event) => {
		this.setState({
			text: event.target.value,
		});
		this.props.pass(event, event.target.value);
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
	checkInput = (event) => {
		switch (event.target.id) {
			case "Password":
			case "รหัสผ่าน":
			case "ยืนยันรหัสผ่าน":
				if (!/[0-9A-Za-z]+/g.test(event.key)) event.preventDefault();
				break;
			case "บัญชีผู้ใช้":
				if (!/[\w]+/g.test(event.key)) event.preventDefault();
				break;
			case "Email":
			case "อีเมล":
				if (
					!/[A-Za-z0-9!#$%&"'*+-/=?^_`{|}~(),:;<>@[\].]+/g.test(
						event.key
					)
				)
					event.preventDefault();
				break;
			case "เบอร์โทรศัพท์":
			case "button":
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
		else if (this.props.id === "button") {
			return (
				<>
					<input
						className="button textS"
						type="button"
						value="-"
						onClick={this.decreaseValue}
					/>
					<input
						className="numOfProduct textS"
						id={this.props.id}
						value={this.state.text}
						onChange={this.handleChange}
						onPaste={(event) => {
							event.preventDefault();
						}}
						onKeyDown={this.checkInput}
                        maxLength={this.props.maxLength}
                        onClick={(e) => { e.target.select();}}
					/>
					<input
						className="button textS"
						type="button"
						value="+"
						onClick={this.addValue}
					/>
					&nbsp; {this.props.unitOfProduct}
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
							style={this.props.style}
							onClick={this.handleClick}
						/>
					</div>
				</>
			);
	}
}

export default Input;
