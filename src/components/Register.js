import React, {Component} from "react";
import RegisterField from "./RegisterField";
import Input from "./Input";
import information from "../images/information.png";
import {withRouter, Redirect} from "react-router-dom";
import firebase from "../database/firebase";
import Loading from "./Loading";
import {connect} from "react-redux";
import {compose} from "redux";
import {toast} from "react-toastify";
class Register extends Component {
	constructor() {
		super();
		this.state = {
			isError: true,
			ชื่อจริง: "",
			นามสกุล: "",
			อีเมล: "",
			บัญชีผู้ใช้: "",
			รหัสผ่าน: "",
			ยืนยันรหัสผ่าน: "",
			ที่อยู่: "",
			เบอร์โทรศัพท์: "",
			error: {
				nameError: "",
				usernameError: "",
				surnameError: "",
				emailError: "",
				addressError: "",
				passwordError: "",
				confirmError: "",
				phoneError: "",
			},
			cartid: "",
			notiid: "",
			loading: false,
		};
	}

	getData = (e, data) => {
		this.setState({
			[e.target.id]: data,
		});
	};

	checkUsername = async () => {
		let db = firebase.firestore();
		let tmpdata = "";
		await db
			.collection("user")
			.where("username", "==", this.state.บัญชีผู้ใช้)
			.limit(1)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					tmpdata = doc.data().username;
					if (tmpdata === this.state.บัญชีผู้ใช้) {
						this.setState((prevState) => {
							return {
								...prevState,
								error: Object.assign({}, prevState.error, {
									usernameError:
										"บัญชีผู้ใช้นี้ถูกใช้งานไปแล้ว",
								}),
							};
						});
					}
				});
				if (tmpdata === "") {
					this.setState((prevState) => {
						return {
							...prevState,
							error: Object.assign({}, prevState.error, {
								usernameError: "",
							}),
						};
					});
				}
			})
			.catch(function (error) {
				console.log("Error getting document:", error);
			});
	};

	signup = async () => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(
				this.state.อีเมล,
				this.state.รหัสผ่าน
			)
			.then((u) => {
				this.addCartToFirestore();
				this.addNoticationToFirestore();
				this.addDataToFirestore();
				toast.info(
					<>
						<div align="center" style={{color: "white"}}>
							คุณได้สมัครสมาชิกเรียบร้อยแล้ว
						</div>
					</>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 3000,
						pauseOnFocusLoss: false,
						closeButton: true,
					}
				);
				this.props.history.push({
					pathname: "/login",
					state: {
						from: "/register",
					},
				});
			})
			.catch((e) => {
				console.log(e.message);
				this.setState((prevState) => {
					return {
						...prevState,
						error: Object.assign({}, prevState.error, {
							emailError: "อีเมลนี้ถูกใช้งานไปแล้ว",
						}),
					};
				});
			});
	};
	addCartToFirestore = async () => {
		let db = firebase.firestore().collection("cart").doc();
		await db
			.set({
				cartlist: [
					{
						created_at: firebase.firestore.Timestamp.now(),
						payment_status: Boolean(false),
						customer_check: Boolean(false),
						shop_check: Boolean(false),
						price: 0,
						productlist: [],
					},
				],
			})
			.then(
				this.setState({
					cartid: db.id,
				})
			)
			.catch(function (error) {
				console.log(error);
			});
	};
	addNoticationToFirestore = async () => {
		let db = firebase.firestore().collection("notification").doc();
		await db
			.set({
				notification_list: [
					{
						message:
							"ยินดีต้อนรับเข้าสู่ครอบครัว ARRROI คุณสามารถเลือกดูสินค้า และเมนูการทำอาหารที่หลากหลายได้ที่นี่ รอช้าอยู่ใย รีบไปซื้อสินค้ากันเลย",
						type: "announce",
						title: "สมัครสมาชิกสำเร็จ",
						time: firebase.firestore.Timestamp.now(),
					},
				],
				username: this.state.บัญชีผู้ใช้,
			})
			.then(
				this.setState({
					notiid: db.id,
				})
			)
			.catch(function (error) {
				console.log(error);
			});
	};
	addDataToFirestore = () => {
		//add data to firestore
		let db = firebase.firestore();
		db.collection("user")
			.add({
				name: this.state.ชื่อจริง,
				surname: this.state.นามสกุล,
				email: this.state.อีเมล,
				username: this.state.บัญชีผู้ใช้,
				address: this.state.ที่อยู่,
				phone: this.state.เบอร์โทรศัพท์,
				cartid: this.state.cartid,
				menu: [],
				store_id: "",
				noti_key: this.state.notiid,
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	checkerror = async () => {
		let error = this.state.error;

		if (this.state.บัญชีผู้ใช้ === "") {
			error.usernameError = "กรุณากรอกบัญชีผู้ใช้";
		}

		error.passwordError =
			this.state.รหัสผ่าน === ""
				? "กรุณากรอกรหัสผ่าน"
				: this.state.รหัสผ่าน.length >= 8 &&
				  this.state.รหัสผ่าน.match(/[A-Z]+/g) &&
				  this.state.รหัสผ่าน.match(/[a-z]+/g) &&
				  this.state.รหัสผ่าน.match(/[0-9]+/g)
				? ""
				: "รหัสผ่านไม่ตรงตามรูปแบบที่กำหนด";
		error.surnameError =
			this.state.นามสกุล === "" ? "กรุณากรอกนามสกุล" : "";
		error.nameError = this.state.ชื่อจริง === "" ? "กรุณากรอกชื่อจริง" : "";
		error.emailError =
			this.state.อีเมล === ""
				? "กรุณากรอกอีเมล"
				: this.state.อีเมล.match(/[@]+/g) &&
				  this.state.อีเมล.match(/[\.]+/g)
				? ""
				: "อีเมลไม่ถูกต้อง";
		error.addressError =
			this.state.ที่อยู่ === "" ? "กรุณากรอกที่อยู่" : "";
		error.confirmError =
			this.state.ยืนยันรหัสผ่าน === ""
				? "กรุณายืนยันรหัสผ่าน"
				: this.state.ยืนยันรหัสผ่าน !== this.state.รหัสผ่าน
				? "รหัสผ่านที่ยืนยันไม่ตรงกับรหัสผ่านข้างต้น"
				: "";
		error.phoneError =
			this.state.เบอร์โทรศัพท์ === ""
				? "กรุณากรอกเบอร์โทรศัพท์"
				: this.state.เบอร์โทรศัพท์.length >= 9 &&
				  this.state.เบอร์โทรศัพท์.charAt(0) === "0"
				? ""
				: "เบอร์โทรศัพท์ไม่ถูกต้อง";

		this.setState({
			error: error,
		});
	};

	aftercheck = async () => {
		let error = this.state.error;
		let isError = true;
		isError =
			error.usernameError !== "" ||
			error.passwordError !== "" ||
			error.surnameError !== "" ||
			error.nameError !== "" ||
			error.addressError !== "" ||
			error.confirmError !== "" ||
			error.emailError !== "" ||
			error.phoneError !== ""
				? true
				: false;
		this.setState({
			isError: isError,
		});
	};

	handleSubmit = async (event) => {
		this.setState({loading: true});
		event.preventDefault();

		await this.checkUsername();
		await this.checkerror();
		await this.aftercheck();
		if (!this.state.isError) {
			await this.signup();
		}

		this.setState({loading: false});
	};

	render() {
		if (!this.props.isLoggedIn)
			return (
				<div className="horizontal-center textS">
					{this.state.loading ? <Loading /> : null}
					<p className="title">Register</p>
					<div
						style={{
							fontSize: "1.5vw",
							textAlign: "left",
							textIndent: "19vw",
							margin: "0px 0px 1.5vw 0px",
						}}
					>
						<span style={{color: "red"}}>**</span>
						<span style={{color: "#707070"}}>
							หากท่านต้องการคำแนะนำในการกรอกข้อมูลหัวข้อใด
							ท่านสามารถคลิกที่ไอคอน
						</span>
						<span>
							<img
								src={information}
								alt="info"
								style={{width: "1.6%", marginLeft: "0.6vw"}}
							/>
						</span>
					</div>
					<div className="form-register-center">
						<form
							className="register form-register-center"
							id="register"
							autoComplete="off"
							onSubmit={this.handleSubmit}
						>
							<RegisterField
								id="ชื่อจริง"
								display={this.state.error.nameError}
							>
								<Input
									type="text"
									id="ชื่อจริง"
									pass={this.getData}
									display={this.state.error.nameError}
									disabled={this.state.error.nameError === ""}
									maxLength="25"
									hidden={true}
									placeholder="สมชาย"
									default=""
								/>
							</RegisterField>
							<RegisterField
								id="นามสกุล"
								display={this.state.error.surnameError}
							>
								<Input
									type="text"
									id="นามสกุล"
									pass={this.getData}
									display={this.state.error.surnameError}
									disabled={
										this.state.error.surnameError === ""
									}
									maxLength="25"
									hidden={true}
									placeholder="รักชาติ"
									default=""
								/>
							</RegisterField>
							<RegisterField
								id="อีเมล"
								display={this.state.error.emailError}
							>
								<Input
									type="text"
									id="อีเมล"
									pass={this.getData}
									disabled={
										this.state.error.emailError === ""
									}
									maxLength="25"
									hidden={true}
									placeholder="test@example.com"
									default=""
								/>
							</RegisterField>
							<RegisterField
								id="บัญชีผู้ใช้"
								display={this.state.error.usernameError}
							>
								<Input
									type="text"
									id="บัญชีผู้ใช้"
									pass={this.getData}
									disabled={
										this.state.error.usernameError === ""
									}
									maxLength="11"
									hidden={true}
									placeholder="example_01"
									default=""
								/>
							</RegisterField>
							<RegisterField
								id="รหัสผ่าน"
								info={
									"รหัสผ่านต้องประกอบด้วย\n- ความยาวอย่างน้อย 8 ตัวอักษร\n- ภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร\n- ภาษาอังกฤษพิมพ์เล็กอย่างน้อย 1 ตัวอักษร\n- ตัวเลขอย่างน้อย 1 ตัวอักษร"
								}
								hasIcon={true}
								display={this.state.error.passwordError}
							>
								<Input
									type="password"
									id="รหัสผ่าน"
									pass={this.getData}
									disabled={
										this.state.error.passwordError === ""
									}
									maxLength="25"
									hidden={true}
									placeholder="Ex123456789"
									default=""
								/>
							</RegisterField>

							<RegisterField
								id="ยืนยันรหัสผ่าน"
								display={this.state.error.confirmError}
							>
								<Input
									type="password"
									id="ยืนยันรหัสผ่าน"
									pass={this.getData}
									disabled={
										this.state.error.confirmError === ""
									}
									maxLength="25"
									hidden={true}
									placeholder="Ex123456789"
									default=""
								/>
							</RegisterField>

							<RegisterField
								id="เบอร์โทรศัพท์"
								display={this.state.error.phoneError}
							>
								<Input
									type="text"
									id="เบอร์โทรศัพท์"
									pass={this.getData}
									disabled={
										this.state.error.phoneError === ""
									}
									maxLength="10"
									hidden={true}
									placeholder="0899199218"
									default=""
								/>
							</RegisterField>
							<RegisterField
								id="ที่อยู่"
								display={this.state.error.addressError}
							>
								<Input
									default=""
									type="text"
									id="ที่อยู่"
									pass={this.getData}
									disabled={
										this.state.error.addressError === ""
									}
									maxLength="92"
									hidden={true}
									placeholder="99/99 ม.9 ต.ขนอม อ.ขนอม จ.นครศรีธรรมราช"
								/>
							</RegisterField>
						</form>
						<button
							className="textS login"
							type="submit"
							form="register"
							style={{
								position: "absolute",
								top: "105%",
								left: "95%",
							}}
						>
							ยืนยัน
						</button>
					</div>
				</div>
			);
		else return <Redirect to="/home" />;
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
export default compose(connect(mapStateToProps), withRouter)(Register);
