const User = require('../schema/user.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page);
        limit = parseInt(limit)
        const aggregrationQuery = [{
            $lookup:
            {
                from: "posts",
                localField: "_id",
                foreignField: "userId",
                as: "userPosts"
            }
        }, {
            $project: {
                "posts": {
                    $size: "$userPosts",
                },
                name: 1,
            }
        }]
        let mainQuery = [...aggregrationQuery, {
            $skip: (page * limit) || 0,
        }]
        limit && mainQuery.push({ $limit: limit })

        let countQuery = [...aggregrationQuery, {
            $count: "totalDocs",
        }]
        const users = await User.aggregate(mainQuery)
        const countData = await User.aggregate(countQuery)
        const totalDocs = countData[0].totalDocs
        const totalPages = Math.ceil(totalDocs / limit)
        res.status(200).json({
            data: {
                users,
                pagination: {
                    totalDocs,
                    limit,
                    page,
                    totalPages,
                    pagingCounter: page,
                    hasPrevPage: page > 1,
                    hasNextPage: page < totalPages,
                    prevPage: page - 1 || null,
                    nextPage: page + 1 || null
                }
            }
        })
    } catch (error) {
        res.send({ error: error.message });
    }
}