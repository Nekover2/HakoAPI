const pageView = (array, page, limit) => {
    let start = (page - 1) * limit;
    let end = page * limit;
    return array.slice(start, end);
};