import {APIFeature} from './apiFeatures';

export const filter = async (query, queryParams) => {
    const results = new APIFeature(query, queryParams).filter().search().sort().limitFields();
    const totalCount = await results.query.countDocuments().clone();
    const freatures = new APIFeature(query, queryParams)
        .filter()
        .search()
        .sort()
        .limitFields()
        .pagination(); 
    const doc = await freatures.query;

    return [totalCount, doc];
};

export const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};