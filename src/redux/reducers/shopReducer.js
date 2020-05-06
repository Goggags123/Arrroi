import {
	CLEAR_SHOP,
	IMPORT_SHOP,
	UPDATE_SHOP,
	REMOVE_SHOP,
} from "../actions/shopAction";
const initialState = {
	store_id: "",
	orderList: [],
};

export const shopReducer = (state = initialState, action) => {
	switch (action.type) {
		case IMPORT_SHOP:
			return {
				...state,
				store_id: action.payload,
			};
		case REMOVE_SHOP:
			for (let i = 0; i < state.orderList.length; i++)
				if (
					state.orderList[i].userDetail.username ===
					action.payload.username
				) {
					return {
						...state,
						orderList: [
							...state.orderList.slice(0, i),
							Object.assign({}, state.orderList[i], {
								cartList: state.orderList[i].cartList.map(
									(cart, j) => {
										return j === action.payload.index
											? Object.assign(
													{},
													state.orderList[i].cartList[
														action.payload.index
													],
													{shop_check: true}
											  )
											: cart;
									}
								),
							}),
							...state.orderList.slice(i + 1),
						],
					};
				}
			return state;
		case UPDATE_SHOP:
			return {
				...state,
				orderList: action.payload,
			};
		case CLEAR_SHOP:
			return initialState;
		default:
			return state;
	}
};
