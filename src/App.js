import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./App.css";
import "react-tippy/dist/tippy.css";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Notification from "./components/Notification";
import MenuPage from "./components/MenuPage";
import MenuDetails from "./components/MenuDetails";
import Ingredients from "./components/Ingredients";
import ShopPage from "./components/ShopPage";
import {Provider} from "react-redux";
import OrderDetails from "./components/OrderDetails";
import Cart from "./components/Cart";
import {PersistGate} from "redux-persist/integration/react";
import MyHistory from "./components/MyHistory";
import configureStore from "./redux/store";
import {ReactReduxFirebaseProvider} from "react-redux-firebase";
import {createFirestoreInstance} from "redux-firestore";
import firebase from "./database/firebase";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MySales from "./components/MySales";
import MySaleList from "./components/MySaleList";
const rrfConfig = {
	userProfile: "users",
	userFirestoreForProfile: true,
};
const {store, persistor} = configureStore();
const rrfProps = {
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch,
	createFirestoreInstance,
};

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<ReactReduxFirebaseProvider {...rrfProps}>
						<Router>
							<Navbar />
							<div style={{marginBottom: "3vw"}} />
							<ToastContainer
                                newestOnTop={true}
                                bodyClassName="textS toast"
								style={{
									wordWrap: "break-word",
									whiteSpace: "normal",
                                    wordBreak: "break-all",
                                    color: "black",
                                    textAlign: "center",
                                    fontSize: "1.5vw",
                                    top:'2.5em',
                                    right:"1em"
								}}
							/>
							<Switch>
								<Route path="/" exact component={Welcome} />
								<Route path="/login" exact component={Login} />
								<Route
									path="/register"
									exact
									component={Register}
								/>
								<Route path="/home" exact component={Home} />
								<Route path="/about" exact component={About} />
								<Route
									path="/menu"
									exact
									component={MenuPage}
								/>
								<Route
									path="/menu/steps/id=:id"
									exact
									component={MenuDetails}
								/>
								<Route
									path="/menu/ingredients/id=:id"
									exact
									component={Ingredients}
								/>
								<Route
									path="/shop"
									exact
									component={ShopPage}
								/>
								<Route
									path="/shop/id=:id"
									exact
									component={Ingredients}
								/>
								<Route
									path="/:name/cart"
									exact
									component={Cart}
								/>
								<Route
									path="/:name/cart/payment"
									exact
									component={OrderDetails}
								/>
								<Route
									path="/:name/orders"
									exact
									component={MyHistory}
								/>
								<Route
									path="/:name/sales"
									exact
									component={MySaleList}
								/>
								<Route
									path="/:name/sales/:customer"
									exact
									component={MySales}
								/>
								<Route
									path="/:name/notification"
									exact
									component={Notification}
								/>
								<Route
									path="/notification"
									exact
									component={Notification}
								/>
							</Switch>
						</Router>
					</ReactReduxFirebaseProvider>
				</PersistGate>
			</Provider>
		);
	}
}

export default App;
