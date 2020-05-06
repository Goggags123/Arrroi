import React, {Component} from "react";
import book from "../images/book.png";
import shop from "../images/shop.png";
import {Link} from "react-router-dom";

class Home extends Component {
	render() {
		return (
			<div className="textS">
				<h1 className="head_home" align="center">
					คุณกำลังมองหาสินค้าอยู่ใช่ไหม?
				</h1>
				<div className="box" align="center">
					<Link className="link box_menu" to="/menu">
						<img className="img_menu" src={book} alt="book"></img>
						<p className="text_menu">
							ค้นหาสินค้า<br></br>
							จากเมนู
						</p>
					</Link>
					<Link className="link box_menu" to="/shop">
						<img className="img_shop" src={shop} alt="shop"></img>
						<p className="text_shop">
							ค้นหาสินค้า<br></br>
							จากร้านค้า
						</p>
					</Link>
				</div>
			</div>
		);
	}
}
export default Home;
