class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
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
}

module.exports = ApiFeatures;
