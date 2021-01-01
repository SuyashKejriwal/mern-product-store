const notFound = (req, res, next) => {
    if (res.statusCode != 200) {
      //  console.log(res.statusCode);
    const error = new Error(`Not Found- ${req.originalUrl}`);
        res.status(404);
    }
    next();
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 404 ? 400 : res.statusCode;
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV==='production' ? null : null,
    })
    next();
}

export {notFound,errorHandler}