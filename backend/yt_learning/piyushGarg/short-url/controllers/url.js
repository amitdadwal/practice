const Url = require("../models/url");
const shortid = require("shortid");

async function handleCreateShortUrl(req, res){
    if(!req.body.url){
        return res.status(400).json({
            error:"url is required"
        })
    }
    const result = await Url.create({
        shortID: shortid(),
        redirectUrl:req.body.url,
        timestamp:[],
        createdBy: req.user._id
    })
    return res.status(201).json({
        msg:"Success",
        data: result
    })
}

async function handleRedirection (req, res){
    const shortID = req?.params?.shortID;
    const result = await Url.findOneAndUpdate({shortID}, {
        $push: {
            visitHistory:{timeStamp: Date.now()}
        }
    })
    res.redirect(result.redirectUrl);
}

async function handleGetVisitAnalytics(req, res){
    console.log(req.params, "params")
    const shortID = req.params.shortID;
    const result = await Url.findOne({shortID});
    res.status(200).json({
        totalClicks : result.visitHistory.length,
        data: result.visitHistory
    })
}
module.exports= {
    handleCreateShortUrl,
    handleRedirection,
    handleGetVisitAnalytics
}

