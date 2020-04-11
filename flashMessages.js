
niceFlash = (req, res, next) => {
    //req.flash('success',"Hi everybody! I hope you're having a nice day!");
    next();
};




module.exports = {
    niceFlash
};