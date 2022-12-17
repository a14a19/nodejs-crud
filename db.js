const { MongoClient, ObjectId } = require("mongodb");

const getMongoClient = async () => {
    const clusterConnect = "mongodb+srv://a14a19:5ZhAE4zyJbi1k36T@cluster0.6ty5nvf.mongodb.net/test";
    return new MongoClient(clusterConnect, { monitorCommands: true });
}

const getUserList = async () => {
    const dbClient = await getMongoClient().catch(console.error);
    try {
        await dbClient.connect().catch(err => console.error(err));

        const itemList = await dbClient.db('items').collection('sales').find({}).toArray();
        return { itemList: itemList };
    } catch {
        console.error(err);
        return
    } finally {
        await dbClient.close()
    }
}

const createUser = async (userObj) => {
    const dbClient = await getMongoClient().catch(console.error);
    try {
        await dbClient.connect().catch(err => console.error(err))

        const insertUser = await dbClient.db('items').collection('sales').insertOne(userObj)
        return insertUser;
    } catch {
        console.error(err);
        return
    } finally {
        await dbClient.close()
    }
}

const updateUser = async (userId, userObj) => {
    const dbClient = await getMongoClient().catch(console.error);
    try {
        await dbClient.connect().catch(err => console.error(err))

        const updated = await dbClient.db('items').collection('sales').updateOne({ _id: ObjectId(userId) }, { $set: userObj })
        return updated;
    } catch {
        console.error(err);
        return
    } finally {
        await dbClient.close()
    }
}

const deleteUser = async (userId) => {
    const dbClient = await getMongoClient().catch(console.error);
    try {
        await dbClient.connect().catch(err => console.error(err))

        const deleted = await dbClient.db('items').collection('sales').deleteOne({ _id: ObjectId(userId) })
        return deleted;
    } catch {
        console.error(err);
        return
    } finally {
        await dbClient.close()
    }
}

module.exports = {
    getUserList,
    createUser,
    updateUser,
    deleteUser
}