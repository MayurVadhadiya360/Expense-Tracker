const { MongoClient, ObjectId } = require('mongodb');
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;

// const url = "mongodb+srv://mayur123:mayur123@cluster0.wqzsozx.mongodb.net/?retryWrites=true&w=majority";
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        // const item = await client.db("Auth").collection("Email_Password").find().toArray();
        // console.log(item);

        //////////////////////////////// INSERT
        // const for_insert = {
        //     _id: "Category",
        //     category: []
        // }
        // for (let i = 0; i < item.length; i++) {
        //     const status = await client.db("Auth").collection(item[i]._id).insertOne(for_insert);
        //     console.log(item[i]._id);
        // }
        

        //////////////////////////////// ADD INTO CATEGORY
        // let categories = ["Income", "Daily", "Purchase", "Recharge/Bill"];
        // let push_categories = {
        //     $push: {
        //         category: { $each: categories }
        //     }
        // };
        // for (let i = 0; i < item.length; i++) {
        //     const status = await client.db("Auth").collection(item[i]._id).updateOne({_id: "Category"}, push_categories);
        //     console.log(item[i]._id);
        // }


        //////////////////////////////// DELETE FROM CATEGORY
        // let delete_categories = ["Salary", ""];
        // let delete_query = {
        //     $pull: {
        //         category: { $in: delete_categories }
        //     }
        // };
        // for (let i = 0; i < item.length; i++) {
        //     const status = await client.db("Auth").collection(item[i]._id).updateOne({_id: "Category"}, delete_query);
        //     console.log(item[i]._id);
        // }


        //////////////////////////////// GET CATEGORIES
        // for (let i = 0; i < item.length; i++) {
        //     const status = await client.db("Auth").collection(item[i]._id).findOne({_id: "Category"});

        //     console.log(item[i]._id);
        //     // console.log(status.category);
        //     for (let j = 0; j < status.category.length; j++){
        //         console.log(status.category[j]);
        //     }
        //     console.log();
        // }


        ////////////////////////////////
        // for (let i = 0; i < item.length; i++) {
        //     const status = await client.db("Auth").collection(item[i]._id).drop();
        //     console.log(item[i]._id);
        // }

        ////////////////////////////////649014d2f7b2d94f91a0bbb6
        // const status = await client.db("Auth").collection("Email_Password").deleteOne({_id: "something"});
        const status = await client.db("Auth").collection("mayur123@mail.com").findOne({_id: new ObjectId("649014d2f7b2d94f91a0bbb6")});//.toArray();
        console.log(status);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run();