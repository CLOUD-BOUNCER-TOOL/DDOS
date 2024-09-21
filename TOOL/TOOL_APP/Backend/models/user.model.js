const { connect, model, Schema } = require("mongoose");
const {encryptPassword} = require("../bcrypt");
require("dotenv").config();

const connectDb = async () => {
    try {
        await connect(`${process.env.MONGO_URL}`);
        console.log("Database Connected Successfully");
    } catch (err) {
        console.error(err);
    }
}
connectDb();

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },

}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.modifiedPaths().includes("password")) {
        user.password = await encryptPassword(user.password);
    }
    next();
});


const User = model("User", UserSchema);

module.exports = User;