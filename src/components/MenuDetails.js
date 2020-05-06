import React, {Component} from "react";
import firebase from "../database/firebase";
import Loading from "./Loading";
import MenuField from "./MenuField";
import Image from "./Image";
class MenuDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id, //ชื่อเมนูอาหาร เช่น กุ้งคั่วกระเทียมพริก จาก url
			multiplier: "", //สำหรับใส่จำนวนที่
			ingredientsList: "", //สำหรับใส่ list ส่วนผสม
			stepsList: "", //สำหรับใส่ list วิธีการทำอาหาร
			temp: "",
            loading: true,
            name:""
		};
	}

	//ใส่ didMount ตรงนี้ก็ได้ ถ้ามี loading ก็เขียนเพิ่มใน state ได้เลย เดี๋ยวเรามาเรียง ingredients กับ steps ต่อให้
	componentWillMount = async () => {
		await this.importdata();
		await this.getname();
        window.scrollTo(0,0)
	};

	getname = async () => {
		let db = firebase.firestore().collection("product");
		for (
			let index = 0;
			index < this.state.ingredientsList.length;
			index++
		) {
			await db
				.doc(this.state.ingredientsList[index].product_id)
				.get()
				.then((documentsnapshot) => {
					this.setState((prevState) => ({
						...prevState,
						ingredientsList: [
							...prevState.ingredientsList.slice(0, index),
							Object.assign(
								{},
								prevState.ingredientsList[index],
								{name: documentsnapshot.data().name}
							),
							...prevState.ingredientsList.slice(index + 1),
						],
					}));
				})
                .catch((e) => {
                    console.log(e.message);
                });
		}
		this.setState((prevState) => ({
			...prevState,
			loading: false,
		}));
	};

	importdata = async () => {
		let db = firebase.firestore();
		await db
			.collection("menu")
			.doc(this.state.id)
			.get()
			.then((documentsnapshot) => {
                this.setState({
                    name:documentsnapshot.data().name,
					multiplier: documentsnapshot.data().multiplier,
					ingredientsList: documentsnapshot.data().productList,
					stepsList: documentsnapshot.data().howto,
				});
			})
			.catch((e) => {
				console.log(e.message);
			});
	};

	render() {
		if (!this.state.loading)
			return (
				<div className="textS" style={{fontSize: "1.5vw"}}>
					<h1 className="menu-title">{this.state.name}</h1>
					{/* //////////////////////////////////////////ส่วนจำนวนที่/////////////////////////////////////// */}
					<Image
						alt="background"
						className="BG"
						nameFood={this.state.name}
					/>
					<MenuField
						type="mulitplier"
						multiplier={this.state.multiplier}
						nameIcon="networking"
						alt="people"
					/>
					<MenuField
						type="ingredient"
						nameIcon="pan"
						alt="ingredients"
					/>
					{/* //////////////////////////////////////////กองทัพส่วนผสมต่าง ๆ////////////////////////////////////// */}
					<div className="menu-ingredients column-flex">
						{this.state.ingredientsList.map((ingredient) => {
							return (
								<div
									className="row-flex"
									style={{marginTop: "1vw"}}
									key={ingredient.product_id}
								>
									<div
										style={{
											width: "140%",
											marginLeft: "3vw",
										}}
									>
										{ingredient.name}
									</div>
									<div style={{width: "60%"}}>
										{ingredient.quantity}
									</div>
								</div>
							);
						})}
					</div>
					{/* //////////////////////////////////////////วิธีทำตั่งต่าง ๆ////////////////////////////////////// */}

					<MenuField type="step" nameIcon="mix" alt="steps" />
					{this.state.stepsList.map((step, i) => {
						return (
							<div className="steps" key={i}>
								<div className="step-title">Step{i + 1}</div>
								{step}
							</div>
						);
					})}
				</div>
			);
		else return <Loading />;
	}
}

export default MenuDetails;
