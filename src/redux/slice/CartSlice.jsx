import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Cart items
  quantity: 0,
  order: null, // Store the order details here after checkout
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) item.quantity = quantity;
    },
    checkout(state) {
      state.order = { items: state.items };
      state.items = [];
    },
    buyNow(state, action) {
      state.order = { items: [action.payload] };
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, checkout, buyNow } =
  cartSlice.actions;

export default cartSlice.reducer;
