class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // making a keyword to put into the query
    const keyword = this.queryStr.keyword // extracting a keyword and if there is a keyword then it will be true
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    // making queryStr's copy so that our original queryStr doesnt change
    const queryCopy = { ...this.queryStr };

    // removing feilds from query string
    const removeFeilds = ["keyword", "limit", "page"];
    removeFeilds.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // this will replace gt gte lt lte with $gt $gte $lt $lte

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    // extracting page value from query string, by_default = 1
    let currentPage = Number(this.queryStr.page) || 1;

    // calculating to skip products on a page
    const skip = resultPerPage * (currentPage - 1);

    // query mongodb product model according to our limit i.e: products on a single page and skip i.e: products to be skipped ona single page
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
