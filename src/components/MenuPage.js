import React, {Component} from "react";
import firebase from "../database/firebase";
import ข้าวผัดกุ้ง from "../images/ข้าวผัดกุ้ง.png";
import MenuList from "./MenuList";
import RegionalMenu from "./RegionalMenu";
import Slideshow from "./Slideshow";
import Loading from "./Loading";
class MenuPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuList: "",
			recommend: [],
		};
	}

	componentDidMount = async () => {
        window.scrollTo(0,0)
		await this.importRecommend();
		await this.importdata();
	};
	importRecommend = async () => {
		let tmp = [];
		let query = firebase.firestore();
		await query
			.collection("recommended_menu")
			.get()
			.then( (querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					let x = documentsnapshot.data().recommendlist;
					 x.forEach(async (id) => {
						await firebase
							.firestore()
							.collection("menu")
							.doc(id)
							.get()
                            .then(async (x) => {
                                tmp.push(x.data().name)
							})
							.catch(function (error) {
								console.log("Error", error);
							});
					});
				});
			})
			.catch(function (error) {
				console.log("Error", error);
			});
		this.setState({recommend:tmp})
	};
	importdata = async () => {
		let tmp = [];
		let db = firebase.firestore();
		await db
			.collection("menu")
			.get()
			.then((querysnapshot) => {
				querysnapshot.forEach((documentsnapshot) => {
					tmp.push({
						id: documentsnapshot.id,
						name: documentsnapshot.data().name,
					});
				});
			})
			.catch(function (error) {
				console.log("Error", error);
			});
		await this.setState({
			menuList: tmp,
		});
	};
	render() {
		if (this.state.menuList !== "" && this.state.recommend !== "")
			return (
				<div className="column-flex menu-page">
					<h1 className="menuPage_title textS">เมนูแนะนำ</h1>
					<Slideshow nameFood={this.state.recommend} />
					<div className="row-flex region-container">
						<RegionalMenu
							alt="อาหารเหนือ"
							title="อาหารเหนือ"
                            nameFood="อาหารเหนือ"
						/>
						<RegionalMenu
							alt="อาหารอีสาน"
							title="อาหารอีสาน"
                            nameFood="อาหารอีสาน"
						/>
						<RegionalMenu
                            alt="อาหารกลาง"
                            nameFood="อาหารกลาง"
							title="อาหารกลาง"
						/>
                        <RegionalMenu
                            nameFood="อาหารใต้"
							alt="อาหารใต้"
							title="อาหารใต้"
						/>
					</div>
					<div className="column-flex">
						{this.state.menuList.map((menu) => {
							return (
								<MenuList
									key={menu.id}
									src={ข้าวผัดกุ้ง}
									alt={menu.name}
									menu={menu.name}
									id={menu.id}
								/>
							);
						})}
					</div>
				</div>
			);
		else return <Loading />;
	}
}

export default MenuPage;
