const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { checkForAuthentication, restrictTo} = require('./middleware/auth')
const URL = require("./models/url");

const urlRoute = require("./routes/url");

const staticRoute = require('./routes/staticRouter');

const userRoute = require("./routes/user");


const app = express();

// number of port for using in url
const PORT = 9867;

// for connecting mongoDB in server
connectToMongoDB(process.env.MONGODB ?? "mongodb://127.0.0.1:27017/short_url").then(() => console.log('MongoDB connecteed.')
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render('home', {
//         urls: allUrls,
//     });
// });

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
        shortId
        }, 
        { 
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
        },
    },
}
);
res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))