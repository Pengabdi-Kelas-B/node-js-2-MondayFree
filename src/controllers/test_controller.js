const testController = {}

testController.healthCheck = (req,res) => {
    // logic menggunakan models
    res.status(200).json({
        ping : "pong !"
    })
}

module.exports = testController