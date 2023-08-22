import { configureStore, createSlice } from "@reduxjs/toolkit";

interface FavoriteSliceState {
    favorites: number[];
};

const favoriteIdsStr = localStorage.getItem("favoriteContactIds");
const favoriteIds = favoriteIdsStr ? JSON.parse(favoriteIdsStr) : [];

const initialState: FavoriteSliceState = {
    favorites: favoriteIds
};

export const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            state.favorites.push(action.payload);
            localStorage.setItem("favoriteContactIds", JSON.stringify(state.favorites));
        },
        removeFavorite: (state, action) => {
            state.favorites = state.favorites.filter((id) => id !== action.payload);
            localStorage.setItem("favoriteContactIds", JSON.stringify(state.favorites));
        }
    }
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;

const store = configureStore({
    reducer: {
        favorite: favoriteSlice.reducer
    }
});

type RootState = ReturnType<typeof store.getState>;

export const selectFavorites = (state: RootState) => state.favorite.favorites;

export default store;