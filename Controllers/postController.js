const POST = require('../Models/postModels')

const createPost = (req, res, next) => {
    try {
        console.log("User Id: ", req.userId)
        console.log("Content: ", req.body.content)
        console.log("Image Path: ", req.body.imagePath)

        POST({
            content: req.body.content,
            createdBy: req.userId,
            imagePath: req.body.imagePath,
        }).save()
            .then((result) => {
                res.status(201).json({ message: "Post created" })
            })
            .catch((err) => {
                console.log("Error occure in create post ", err)
            })
    } catch (err) {
        next(err)
    }
}

const addImageController = (req, res, next) => {
    console.log(req.file)
    res.status(201).json({ path: "images/" + req.file.filename }) // 201 - created
}

const getPostData = (req, res, next) => {
    let { pageNo, perPage } = req.query

    pageNo = parseInt(pageNo)
    perPage = parseInt(perPage)

    const skip = (pageNo - 1) * perPage

    console.log("Page No", pageNo)
    console.log("Per Page", perPage)

    // POST.find({ imagePath: { $exists: true, $ne: null } }).limit(100)
    POST.aggregate([
        { $match: { deleted: false } },
        {
            $facet: {
                totalCount: [{ $count: "totalCount" }],
                postData: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "userData"
                        }
                    },
                    {
                        $set: {
                            userData: { $arrayElemAt: ["$userData", 0] },
                            content: { $substrBytes: ["$content", 0, 300] }
                        }
                    },
                    {
                        $sort: { createdAt: 1 }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: perPage
                    },
                    {
                        $project: { "userData.password": 0 }
                    }
                ],
            }
        }
    ])
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = { createPost, addImageController, getPostData }  