import '../styles/highlights.css'
import { useEffect, useState } from "react";
import CategoryTable from "../components/CategoryTable";

export default function Categories() {
  

  return (
    <div className="categories-page">
      <CategoryTable 
      site='top-market-cap-categories'
      endpoint='/coins/categories'
      title='Cap. de mercado mas alto'
      />
      <CategoryTable 
      site='top-market-cap24h-categories'
      endpoint='/coins/categories'
      params={{order: "market_cap_change_24h_desc"}}
      title='Cap. de mercado mas alto ult. 24h'
      />
      <CategoryTable
      endpoint="/search/trending"
      site='categories-trending'
      title='Mas populares'
      />
    </div>
  );
}
