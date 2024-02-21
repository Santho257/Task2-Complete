import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'
import ProductTable from './ProductTable.jsx';
import axios from 'axios';

function Search() {
    const [searchData, setSearchData] = useState([]);
    const [debounce, setDebounce] = useState(null);
    const [relatedData, setRelatedData] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ search: '' });
    const [searchValue, setSearchValue] = useSearchParams();
    const fetchData = async () => {
        try {
            if(document.getElementById("search").value!=''){
                let result = await axios(`http://localhost:3001/Product/search=${document.getElementById("search").value}`);
                setSearchData(result.data.search);
                setRelatedData(result.data.related);
                //console.log(searchData, relatedData);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        clearTimeout(debounce);
        setDebounce(setTimeout(fetchData,200));
    },[searchTerm]);
    return (
        <div
        >
            <div id="searchDiv"><input
                type="search"
                placeholder='search products'
                id="search"
                onInput={() => {
                    setSearchValue({ search: document.querySelector("#search").value })
                    setSearchTerm({ search: document.querySelector("#search").value })
                }}
                onBlur={() => {
                    if (document.querySelector("#search").value === '') {
                        setSearchValue({ })
                        setSearchTerm({ search: '' })
                    }
                }}
            /></div>
            {searchTerm.search && searchData!=undefined && relatedData!=undefined ? <>
            <ProductTable title="Search Results" productData={searchData} isSearch={true} />
            <ProductTable title={(searchData.length>0)?"Related Products":"Products You may like"} productData={relatedData} isSearch={true} />
            </> : null}
        </div>
    );
}

export default Search;
