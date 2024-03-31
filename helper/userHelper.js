
const { default: mongoose } = require("mongoose");
const userCollction = require("../model/userModel/userModel") 
let ObjectId = require("mongoose").ObjectId;
let path = require("path");

let userHelper = {

    userLogin: async function (data) {
        let findUser = await userCollction.findOne({ email: data.username, password: data.password });
        if (findUser) { 
            if (findUser.block == "active") {
                await userCollction.updateOne(
                    {
                        _id: new mongoose.Types.ObjectId(findUser._id)
                    },
                    {
                        $currentDate: { "lastLoggin": true }
                    }
                )
                return findUser
            } else {
                return false;
            }
        }
        else {
            return false
        }
    },

    updateUser: async function (userid, newData) {
        try {
            let updateData = {
                name: newData.name,
                email: newData.email,
                phone: newData.phone,
                role: newData.role,
                location: newData.location,
            };
 
            if (newData.dp) {
                updateData.dp = newData.dp.name;
                await newData.dp.mv(path.join(__dirname, "../public/user_profile/", newData.dp.name));
            }

            if (newData.password !== "") {
                updateData.password = newData.password;
            }

            const userUpdation = await userCollction.updateOne(
                {
                    _id: new mongoose.Types.ObjectId(userid)
                },
                {
                    $set: updateData
                }
            );

            return userUpdation;
        } catch (error) {
            throw error;
        }


    },

}

module.exports = userHelper;