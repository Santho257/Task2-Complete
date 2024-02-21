import { useParams, useNavigate } from 'react-router-dom';
import Error from './Error.jsx';
import Paginator from './Paginator.jsx';
import Search from './Search.jsx';

function ProductTable({ productData, categoryData, isSearch, title }) {;
    let maxPage = 0, pageDatas = [];
    const navi = useNavigate();
    let { catId, pageNo } = useParams();
    if (/^page=[0-9]+$/.test(pageNo) && !isSearch)
        pageNo = parseInt(pageNo.slice(5));
    else if(isSearch){
        pageDatas = []
        pageNo = 1;
    }
    else
        return (<Error />);
    if (catId) {
        if (/^catId=[0-9]+$/.test(catId)) {
            const catData = productData.filter((data) => data.catId == parseInt(catId.slice(6)));
            maxPage = Math.ceil(catData.length / 10);
            pageDatas = catData.slice((pageNo - 1) * 10, pageNo * 10);
        }
        else
            return (<Error />);
    }
    else if(!isSearch){
        maxPage = Math.ceil(productData.length / 10);
        if(pageNo>maxPage)  return (<Error/>);
        pageDatas = productData.slice((pageNo - 1) * 10, pageNo * 10);
    }
    if(isSearch){pageDatas = productData;}
    return (
        <>
            {isSearch?null:<Search/>}
            {pageDatas.length > 0 ? (<>
                <div className="header">
                    {isSearch?<></>:catId ? <button onClick={() => navi('/Category/page=1')}>Categories</button>
                        : <button onClick={() => navi('/')}>Home</button>}                                                                                                                                                                                                                             

                    <h2>{title}</h2>

                    {!isSearch?<select id="catSelect" onChange={() =>
                        (document.querySelector("#catSelect").value == 0) ? navi(`/Product/page=1`) : navi(`/Product/catId=${document.querySelector("#catSelect").value}/page=1`)
                    } defaultValue={(catId) ? parseInt(catId.slice(6)) : 0}>
                        <option value="0">All Categories</option>
                        {(categoryData)?categoryData.map((category) => {
                            return (<option key={category.id} value={category.id}>{category.name}</option>)
                        }): null}
                    </select>:<></>}
                </div>
                <table id="proTable">
                    <thead>
                        <tr>
                            <th>S. No</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>MRP</th>
                            <th>Dicount Price</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pageDatas.map((product, i) => {
                                return (
                                    <tr key={i+1}>
                                        <td>{(pageNo - 1) * 10 + (i + 1)}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.Category}</td>
                                        <td>{product.MRP}</td>
                                        <td>{product.discountedPrice}</td>
                                        <td>{product.createdDate.substring(0, 10)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {isSearch ? null : catId ? (
                    <Paginator pageNo={pageNo} maxPage={maxPage} buttons='8' type={`Product/${catId}`} />
                ) :
                    (
                        <Paginator pageNo={pageNo} maxPage={maxPage} buttons='8' type='Product' />
                    )
                }
            </>) : <>{(catId && !isSearch) ? <button onClick={() => navi('/Category/page=1')}>Categories</button>
                : (!isSearch) ?<button onClick={() => navi('/')}>Home</button>: null}
                <h2>{title}</h2>
                <p>No Datas Found</p></>}</>)
}

export default ProductTable;