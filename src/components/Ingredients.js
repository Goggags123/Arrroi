import React, {Component} from "react";
import BuyProduct from "./BuyProduct";
import firebase from "../database/firebase";
import Loading from "./Loading";
import Image from "./Image";
import MyShopField from "./MyShopField";

class Ingredients extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.match.url.includes("menu") ? "menu" : "shop",
			name: "",
			id: this.props.match.params.id,
			productList: [],
			loading: true,
			detail: "",
		};
	}

	componentDidMount = async () => {
		window.scrollTo(0, 0);
		if (this.state.type === "menu") await this.showpdl_menu();
		else await this.showpdl_store();
	};
	showpdl_store = async () => {
		let tmp = [];
		let query = firebase.firestore().collection("store");
		await query
			.doc(this.state.id)
			.get()
			.then((documentsnapshot) => {
				this.setState({
					name: documentsnapshot.data().name,
					detail: documentsnapshot.data(),
				});
			})
			.catch((e) => {
				console.log(e.message);
			});
		query = firebase.firestore().collection("product");
		await query
			.where("store_id", "==", this.state.id)
			.get()
			.then((querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					tmp.push(
						Object.assign({}, documentsnapshot.data(), {
							product_id: documentsnapshot.id,
						})
					);
				});
			})
			.catch((e) => {
				console.log(e.message);
			});

		this.setState({
			productList: tmp,
			loading: false,
		});
	};
	showpdl_menu = async () => {
		let query = firebase.firestore().collection("menu");
		let query2 = firebase.firestore().collection("product");
		let tmp;
		await query
			.doc(this.state.id)
			.get()
			.then((documentsnapshot) => {
				tmp = {
					multiplier: documentsnapshot.data().multiplier,
					productList: documentsnapshot.data().productList,
				};
				this.setState({
					name: documentsnapshot.data().name,
				});
			});
		let tmpmenuall = [];
		for (let index = 0; index < tmp.productList.length; index++) {
			await query2
				.doc(tmp.productList[index].product_id)
				.get()
				.then((documentsnapshot) => {
					tmpmenuall.push(documentsnapshot.data());
				})
                .catch((e) => {
                    console.log(e.message);
                });
		}
		let productList = [];
		tmp.productList.forEach((data, index) => {
			productList.push({
				...tmpmenuall[index],
				product_id: data.product_id,
				used: data.quantity,
			});
		});
		this.setState({
			productList: productList,
			multiplier: tmp.multiplier,
			loading: false,
		});
	};
	render() {
		if (!this.state.loading)
			return (
				<>
					{!this.props.match.url.includes("shop") ? (
						<h1
							className="menu-title textS"
							style={{marginBottom: "2.5vw"}}
						>
							{this.state.name}
						</h1>
					) : null}
					<Image
						alt="background"
						className="BG"
						nameFood={this.state.name}
					/>
					{this.props.match.url.includes("shop") ? (
						<MyShopField
							nameShop={this.state.detail.name}
							nameFood={this.state.detail.name}
							nameIcon="pencil"
							des={this.state.detail.detail}
						/>
					) : null}
                    {this.state.productList.map((product, i) => {
						return (
							<BuyProduct
								key={product.product_id}
								id={product.product_id}
								nameOfProduct={product.name}
								color={i % 2 === 0 ? "brown" : "cream"}
								option={product.option}
								nameFood={product.name}
								used={product.used}
								match={this.props.match}
								size={product.size}
							/>
						);
					})}
				</>
			);
		else return <Loading />;
	}
}
export default Ingredients;
