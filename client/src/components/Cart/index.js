import React, { useEffect } from 'react';
import CartItem from '../CartItem';


import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { useLazyQuery } from '@apollo/react-hooks';

import { useDispatch, useSelector } from 'react-redux';



const Cart = () => {
    const state = useSelector((state) => {
        return state;
    });
    const dispatch = useDispatch();

    const[getCheckout, {data}] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart]});
        };
        if(!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);

   

    function toggleCart() {
        dispatch({ type: TOGGLE_CART});
    }

    if(!state.cartOpen){
        return (
            <div className="cart-closed" onClick={toggleCart}>
                                <span role="img" aria-label="cart">🛒</span>
            </div>
        )
    }

    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(service => {
            sum += service.price * service.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    function submitCheckout() {
        const serviceIds = [];

        getCheckout({
            variables: {services: serviceIds}
        });

        state.cart.forEach((service) => {
            for (let i=0; i <service.purchaseQuantity; i++){
                serviceIds.push(service._id)
            }
        });
    }
    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
                <div>
                {state.cart.map(item => (
                    <CartItem key={item._id} item={item} />
                ))}
                <div className="flex-row space-between">
                    <strong>Total: ${calculateTotal()}</strong>
                   
                        <button onClick={submitCheckout}>
                        Checkout
                        </button>
                
                </div>
                </div>
            ) : (
                <h3>
                <span role="img" aria-label="shocked">
                    😱
                </span>
                You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );

};

export default Cart;
