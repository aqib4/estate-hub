import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface filtersState {
  location: string;
  priceRange: [number, number] | [null, null];
  bedrooms: number | "any";
  bathrooms: number | "any";
  propertyType: string;
  amenities: string[];
  squareFeet: [number, number] | [null, null];
  availableFrom: string,
  coordinates: [number, number];
}

interface initialStateType{
  filters: filtersState;
  isFilterFullOpen:boolean;
  viewMode: "list" | "grid";
}

export const initialState: initialStateType = {
  filters : {
    location: "Los Angeles, CA",
    priceRange: [null, null],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
    amenities: [],
    squareFeet: [null, null],
    availableFrom: "",
    coordinates: [-118.25, 34.05],  
  },
  isFilterFullOpen:false,
  viewMode: "list",
};

export const globalSlice = createSlice({
  name: "global", 
  initialState,
  reducers: {
    setFilters: (state,action: PayloadAction<Partial<filtersState>>) => {
           state.filters = { ...state.filters,...action.payload};
    },
    toggleFilterFullOpen: (state) => {
      state.isFilterFullOpen = !state.isFilterFullOpen;
    },
    setViewMode: (state,action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    }


  },
});

export const {setFilters,setViewMode,toggleFilterFullOpen} = globalSlice.actions;

export default globalSlice.reducer;
