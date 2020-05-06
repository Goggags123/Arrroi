import React, {Component} from "react";
import NotificationField from "./NotificationField";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {withRouter} from "react-router-dom";
import EmptyNoti from "./EmptyNoti";
import Loading from "./Loading";
import firebase from "../database/firebase";
class Notification extends Component {
	componentDidMount = () => {
		window.scrollTo(0, 0);
	};
	
	render() {
		if (this.props.isLoggedIn)
			if (this.props.notification) {
				if (
					this.props.notification[0] &&
					this.props.notification[0].notification_list &&
					this.props.notification[0].notification_list.length > 0
				) {
					let noti = this.props.notification[0].notification_list.slice();
					return (
						<div className="textS">
							<h1 align="center" style={{fontSize: "4vw"}}>
								Notification
							</h1>
							{noti.reverse().map((notification, i) => {
								return (
									<NotificationField
										type={notification.type}
										key={i}
										head={notification.title}
										des={notification.message}
										time={notification.time
											.toDate()
											.toLocaleString()
											.replace(",", "")}
									/>
								);
							})}
						</div>
					);
				} else return <EmptyNoti />;
			} else return <Loading />;
		else return <EmptyNoti />;
	}
}
const mapStateToProps = (state) => {
	return {
		notification: state.firestore.ordered.notification,
		username: state.loginReducer.username,
		isLoggedIn: state.loginReducer.isLoggedIn,
	};
};
export default compose(
	withRouter,
	connect(mapStateToProps),
	firestoreConnect((props) => [
		{
			collection: "notification",
			limit: 1,
			where: [["username", "==", props.username]],
			// orderBy: ["time", "desc"],
		},
	])
)(Notification);
