import Button from './Button.jsx';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryTable from './CategoryTable.jsx';
import Error from './Error.jsx';
import ProductTable from './ProductTable.jsx';
import Search from './Search.jsx';
import './App.css'

function App() {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => { fetchData("Category", setCategoryData) }, []);
  useEffect(() => { fetchData("Product", setProductData) }, []);

  const fetchData = async (tabName, func) => {
    try {
      let result = await axios(`http://localhost:3001/${tabName}`);
      // console.log(result.data);
      func(result.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <>
        <Routes>
          <Route path="/" element={
            <>
              <Search/>
              <Button href="/Category/page=1" value="Categories" />
              <Button href="/Product/page=1" value="Products" />
            </>}
          />

          {/* <Route path="/Category" element={
            <>
              <CategoryTable categoryData={categoryData}/>
            </>}
            />
            <Route path="/Product" element={
            <>
              <ProductTable productData={productData}/>
            </>}
            /> */}

          <Route path="/Category/:pageNo" element={
            <>
              <CategoryTable categoryData={categoryData} />
            </>}
          />
          <Route path="/Product/:pageNo" element={
            <>
              <ProductTable title="All Products" categoryData={categoryData} productData={productData} />
            </>}
          />
          <Route path="/Product/:catId/:pageNo" element={
            <>
              <ProductTable title="Products" categoryData={categoryData} productData={productData} />
            </>}
          />
          <Route path="*" element={
            <>
              <Error />
            </>}
          />
        </Routes>
    </>
  )
}

export default App;
