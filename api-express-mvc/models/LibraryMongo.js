// const mysql = require("mysql2");
const { MongoClient, ObjectId} = require("mongodb");
const dbConfig = require("../config/mongoDB.config.js");

const URL =  "mongodb://localhost:27017";
const DB = "books";

class Library {
  constructor() {
    this.client = new MongoClient(URL);
  }  
    async connect() {
      try{
        await this.client.connect();
        this.database = this.client.db(DB);
        this.collection = this.database.collection("books");
        console.log("Successfully connected to the MongoDB database.");
      }
      catch(error){
        console.error("Error connecting to MongoDB:", error);
      }
    }


  close = async () => {
    await this.client.close();
  }

  // métodos de la clase Library
  listAll = async () => {
    await this.connect();
    const books = await this.collection.find({}).toArray();
    console.log("fetched books", books);
    await this.close();
    return books;
  }

  create = async (newBook) => {
    try {
      await this.connect();
      const result = await this.collection.insertOne(newBook);
      return result.insertedId;
    }
    catch (error) {
      return error;

    }
  };

  update = async (bookID, updateBooks) => {

    await this.connect();

    const result = await this.collection.updateOne(
      { _id: new ObjectId(String(bookID)) }, 
      { $set:  updateBooks}
    );

    await this.close();
    return result.modifiedCount;
  }

  delete = async (bookID) => {
    try {
        await this.connect();
        const result = await this.collection.deleteOne({ _id: new ObjectId(String(bookID)) }); 
        return result.deletedCount;
    } catch (error) {
        console.error("Error delete:", error);
        return 0;
    } finally {
        await this.close();
    }
};

}

module.exports = Library;