/* eslint-disable @typescript-eslint/no-explicit-any */
import sp from 'stopword';
class APIFeatures {
    queryParams: any;
    query: any;
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
    }
    filter() {
        //QUERY FILTER
        const queryParams = { ...this.queryParams };
        const excludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
        excludedFields.forEach((el) => delete queryParams[el]);
        // CASE INSENSITIVE SEARCH
        const newObj:any = {};
        const excluded = ['_id','startDate','endDate'];
        Object.keys(queryParams).forEach((el) => {
            if (!excluded.includes(el)) {
                if (Array.isArray(queryParams[el])) {
                    const regex = queryParams[el].map(function (val) {
                        return `^${val}$`;
                    });
                    const reg = regex.join('|');
                    newObj[el] = { regex: reg, options: 'i' };
                } else {
                    const value = `^${queryParams[el]}$`;
                    newObj[el] = { regex: value, options: 'i' };
                }
            } else {
                if (el === 'startDate' || el === 'endDate') {
                    newObj.createdAt = { gt: new Date(queryParams.startDate), lt: new Date(queryParams.endDate) }
                } else {
                    newObj[el] = queryParams[el];
                }
            }
        });
        // FILTER MONGOOSE OPERATORS
        let queryStr = JSON.stringify(newObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|regex|options|elemMatch|in)\b/g,
            (match) => `$${match}`
        );
        const obj = JSON.parse(queryStr);
        this.query = this.query.find(obj);
        return this;
    }

    search() {
        if (this.queryParams.keyword) {
            const oldString = this.queryParams.keyword.split(' ');
            const newString = sp.removeStopwords(oldString);
            const unique = [...new Set(newString)];
            this.query = this.query
                .find({ $text: { $search: unique.join(' ') } })
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        }
        return this;
    }

    sort() {
        if (this.queryParams.sort) {
            const sortBy = this.queryParams.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryParams.fields) {
            const fields = this.queryParams.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryParams.page * 1 || 1;
        const limit = this.queryParams.limit * 1 || 0;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export const APIFeature = APIFeatures;