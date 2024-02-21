import {useNavigate} from 'react-router-dom';
function Paginator({pageNo,maxPage,type}){
    const navi = useNavigate();
    /* <div className='paginator'>
            <button onClick={()=>{pageNo=Math.max(pageNo-1,1);navi(`/${type}/page=${pageNo}`)}}>Previous Page</button>
            <p>Page: {pageNo} / {maxPage}</p>
            <button onClick={()=>{pageNo=Math.min(pageNo+1,maxPage);navi(`/${type}/page=${pageNo}`)}}>Next Page</button>
        </div> */
    const end = (pageNo>1)?(Math.min(maxPage, pageNo+6)):(Math.min(maxPage, pageNo+7));
    const start = (end<=8)?1:(Math.min(end-7,pageNo));
    let pages =[];
    for(let i=start;i<=end;i++)
        pages.push(i);
    return (
        <div className='paginator'>
            <button onClick={()=>{pageNo=Math.max(pageNo-1,1);navi(`/${type}/page=${pageNo}`)}}>Previous Page</button> 

            {pages.map((page)=><button onClick={()=>{pageNo=page;navi(`/${type}/page=${pageNo}`)}} className={(page==pageNo)?"active-but":"deact-but"} key={page}>{page}</button>)}

            <button onClick={()=>{pageNo=Math.min(pageNo+1,maxPage);navi(`/${type}/page=${pageNo}`)}}>Next Page</button>
        </div>
        )
    
}

export default Paginator;