import {useParams, useNavigate } from 'react-router-dom';
import Error from './Error.jsx';
import Paginator from './Paginator.jsx';
import Search from './Search.jsx';

function CategoryTable({categoryData}){ 
    let {pageNo} = useParams();
    if(/^page=[0-9]+$/.test(pageNo))
        pageNo= parseInt(pageNo.slice(5));
    else
        return(<Error/>);
    const navi = useNavigate();
    const maxPage = (categoryData.length)?Math.ceil(categoryData.length / 10):1;
    if(pageNo > maxPage)   return(<Error/>);
    const pageDatas = categoryData.slice((pageNo-1)*10,pageNo*10);
    return(
        <>
        <Search />
        <div className = "header" id="catHeader">
            <button onClick={()=>navi('/')}>Home</button>
            <h2>Categories</h2>
        </div>
        <table id="catTable">
            <thead>
                <tr>
                    <th>S. No</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Created Date</th>
                </tr>
            </thead>
            {<tbody>
                {
                    pageDatas.map((category,i) => {
                        return(
                            <tr key={category.id}>
                                <td>{(pageNo-1)*10+(i+1)}</td>
                                <td className="link" onClick={()=>navi(`/Product/catId=${category.id}/page=1`)}>{category.name}</td>
                                <td>{category.stock}</td>
                                <td>{category.createdDate.substring(0,10)}</td>
                            </tr>
                        )
                    })
                }
            </tbody>}
        </table>
        <Paginator pageNo={pageNo} maxPage={maxPage} buttons='4' type='Category'/>
        </>
    )
}

export default CategoryTable;