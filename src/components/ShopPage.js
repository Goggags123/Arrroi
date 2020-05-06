import React, {Component} from "react";
import Shop from "./Shop";
import getImage from "../database/getImage";
import firebase from "../database/firebase";
import Loading from './Loading'
class ShopPage extends Component {
	constructor() {
		super();
		this.state = {
            storeList: "",
            loading:true
		};
	}
	componentDidMount = async () => {
		await this.importdata();
	};
	importdata = async () => {
        let tmp = []
		let db = firebase.firestore();
		await db
			.collection("store")
			.orderBy("star", "desc")
			.get()
			.then((querysnapshot) => {
                querysnapshot.forEach((documentsnapshot) => {
                    let x=  documentsnapshot.data()
                    x.id = documentsnapshot.id
                    tmp.push(x);
				});
			})
			.catch(function (error) {
				console.log("Error", error);
			});
            this.setState({
                storeList: tmp,
                loading:false
            });
	};
	render() {
        if (!this.state.loading) {
			return (
				<>
					<h1 className="textS shop-title"> ร้านค้าแนะนำ </h1>
					{this.state.storeList.map((store) => {
						return (
							<Shop
								nameFood={store.name}
								detail={store.detail}
								star={store.star}
                                address={store.address}
                                key={store.id}
                                id={store.id}
							/>
						);
					})}
				</>
			);
		} else {
			return <Loading />
		}
	}
}
export default getImage(ShopPage);
