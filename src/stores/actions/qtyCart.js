import {
    TOTAL_QTY_CART,
    REMOVE_QTY_CART
} from './actionTypes';

export const totalCartQty = (qty) => {
    console.log("TOTAL CHAT QTY: ")
    console.log(qty.qtyCart)
    return {
        type: TOTAL_QTY_CART,
        payload: qty.qtyCart
    };
};

export const removeCartQty = () => {
    console.log("Remove cart QTY")
    return {
        type: REMOVE_QTY_CART
    };
};