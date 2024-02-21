const pluralize = require('pluralize');
const relatedProducts = async (seedProductIds, client) => {
    const likeTerm = seedProductIds.map((id) => ({ _index: 'product', _id: id })).slice(0,5)
    const related = await client.search({
        index: 'product',
        body: {
            size: 5,
            query: {
                more_like_this: {
                    fields: ["name", "brand", "Category"],
                    like: likeTerm,
                    min_term_freq: 1,
                    max_query_terms: 12
                }
            }
        }
    }
    );  
    if (related.hits && related.hits.hits) {
        return related.hits.hits.slice(0, 10);
    } else {
        return [];
    }
}

const filterQuery = searchTerm => {
    const matchLt = searchTerm.match(/\b(under|less than|below)\b/i);
    const matchGt = searchTerm.match(/\b(above|greater than|over)\b/i);
    const matchBtw = searchTerm.match(/\b(between|from)\b/i);
    if (matchLt) {
        const numberMatch = searchTerm.match(/\b(under|less than|below)\s*(\d+(\.\d+)?)\b/i);
        if (numberMatch) {
            const number = parseFloat(numberMatch[2]);
            return {
                range: {
                    discountedPrice: { lte: number }
                }
            };
        }
        else
            return null;
    }
    else if (matchGt) {
        const numberMatch = searchTerm.match(/\b(above|greater than|over)\s*(\d+(\.\d+)?)\b/i);
        if (numberMatch) {
            const number = parseFloat(numberMatch[2]);
            return {
                range: {
                    discountedPrice: { gte: number }
                }
            };
        }
    }
    else if(matchBtw) {
        const numberMatch = searchTerm.match(/\b(between|from)\s*(\d+(\.\d+)?)\s*(and|to)\s*(\d+(\.\d+)?)\b/i);
        if (numberMatch) {
            const number1 = parseFloat(numberMatch[2]);
            const number2 = parseFloat(numberMatch[5]);
            return {
                range: {
                    discountedPrice: { gte: number1, lte: number2 }
                }
            };
        }
    }
    return null;
}

const searchProducts = async (searchTerm, client) => {
    //console.log("Hey Im called:))")
    try {
        searchTerm = searchTerm.trim()
        searchTerm = searchTerm.replace(/[^0-9a-z\s-]/gi, '');
        const filterQry = filterQuery(searchTerm);
        //console.log(filterQry);
        const match = searchTerm.match(/\b(above|greater than|over|under|less than|below)\s*(\d+(\.\d+)?)\b/i) || searchTerm.match(/\b(between|from)\s*(\d+(\.\d+)?)\s*(and|to)\s*(\d+(\.\d+)?)\b/i);
        if(match)   searchTerm = searchTerm.slice(0,match.index)+searchTerm.slice(match.index+match[0].length);
        const tempTerms = searchTerm.split(' ');
        terms = tempTerms.filter((term) => term != '');
        const shouldClauses = terms.map(term => {
            return ({
                query_string: {
                    query: `${pluralize.singular(term)}* ${term}*`,
                    fields: ['name^3', 'brand^2', 'Category'],
                    analyze_wildcard: true
                }
            })
        });
        const body = await client.search({
            index: 'product',
            body: {
                query: {
                    bool: {
                        must: [{
                            bool: {
                                should: shouldClauses
                            }
                        }],//shouldClauses,
                        should: /* [{
                            match: {
                                brand: {
                                    query: searchTerm
                                }
                            }
                        }] */null,
                        filter: filterQry
                    }
                }
            }
        });
        if (body.hits && body.hits.hits.length > 0) {
            const seedProductIds = body.hits.hits.map((hit) => hit._source.id);
            const relateds = await relatedProducts(seedProductIds, client);
            return {
                search: (body.hits.hits).map((hit) => hit._source),
                related: (relateds).map((hit) => hit._source)
            }
        }
        else {
            //console.log('No results found.');
            let relatedProducts = await client.search({
                index: 'product',
                body: {
                    size: 5, 
                    query: {
                        multi_match: {
                            query: terms.map((term) => pluralize.singular(term)).join(' '),
                            fields: ["name^2", "brand"],
                            fuzziness: 'AUTO'
                        }
                    }
                }
            });
            //console.log(relatedProducts.hits.hits);
            if(relatedProducts.hits.hits.length<=0)
                relatedProducts = await client.search({
                    index: 'product',
                    body: {
                        size: 5, 
                        query: {
                            bool: {
                                should: {
                                    function_score: {
                                        query: { match_all: {} }, 
                                        random_score: {} 
                                    }
                                },
                                filter: filterQry
                            }
                        }
                    }
                });
            return {
                search: [],
                related: (relatedProducts.hits.hits).map((hit) => hit._source)
            };
        }
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

module.exports = {
    searchProducts: searchProducts
}