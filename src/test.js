const { MongoClient } = require('mongodb');
// const url = "mongodb+srv://mayur123:mayur123@cluster0.wqzsozx.mongodb.net/?retryWrites=true&w=majority";
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        item = await client.db("Auth").collection("Email_Password").findOne({ _id: "mayur@mail.com" });
        console.log(item);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run();