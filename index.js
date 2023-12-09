const express = require('express');
const cors = require("cors");
// const jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//mongoDB code start here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okcyaww.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();

    const blogCollection =client.db('blogsDB').collection('blog');
    const wishlistCollection =client.db('blogsDB').collection('wishlist');
    const commentsCollection =client.db('blogsDB').collection('comment');

    // //auth api wit jwt
    // app.post("/jwt", async (req, res) => {
    //   const user= req.body;
    //   console.log('token for user', user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h '})
    //  res.cookie('token', token,{
    //   httpOnly:true,
    //   secure:true,
    //   sameSite:'strict'
    //  })
    //   res.send({success: true});
    // })
    
    // app.post('/logout', async(res,req)=>{
    //   const user =req.body;
    //   console.log('logging out', user);
    //   res.clearCookei('token', {maxAge:0}).send({success:true})


    // })
    
    
    
    

    
    
    
    //post data 
    //
    //     const blogdata = req.body;
    //     const currentDate = new Date();
    //     blogdata.createdAt = {
    //         date: currentDate.toISOString().split('T')[0],
    //         time: currentDate.toTimeString().split(' ')[0] 
    //     };
    //     const result = await blogCollection.insertOne(blogdata);
    //     res.send(result);
    // });



//blog api
    app.post("/blog", async (req, res) => {
      const blogData = req.body;
      const currentDate = new Date();
      blogData.createdAt = {
        date: currentDate.toISOString().split('T')[0],
        time: currentDate.toTimeString().split(' ')[0],
      };
      
      // Assuming the user's email is included in the request body as 'userEmail'
      const userEmail = req.body.userEmail;
      blogData.userEmail = userEmail; // Include user's email
    
      try {
        const result = await blogCollection.insertOne(blogData);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    





   // get data
    app.get("/blog", async (req, res) => {
      const result = await blogCollection.find().sort({ createdAt: -1 }).toArray();
      //console.log(result);
        res.send(result);
    });

    //Wshilist data post
// app.post("/wishlist", async(req, res)=>{
//   const whislist =  req.body;
//   const result = await
//   wishlistCollection.insertOne(whislist);
//   console.log(result);
//   res.send(result);
// });

app.post("/wishlist", async (req, res) => {
  const wishlist = req.body;
  console.log(wishlist);
  const { userEmail, blogItem } = req.body;
  const result = await wishlistCollection.insertOne(wishlist);
  console.log(result);
  res.send(result);
});



//Wishlist data get methood
app.get("/wishlist", async(req, res)=>{
  const result = await wishlistCollection.find().toArray();
  console.log(result);
  res.send(result);
});

// app.get("/wishlist", async (req, res) => {
//   const userEmail = req.query.email; 

//   try {
//     const result = await wishlistCollection.find({ email: userEmail }).toArray();
//     console.log(result);
//     res.send(result);
//   } catch (error) {
//     console.error("Error fetching wishlist data:", error);
//     res.status(500).json({ error: "An error occurred while fetching wishlist data" });
//   }
// });



//delete or remove wishlist data
app.delete("/wishlist/:id" , async(req, res) =>{
  const id = req.params.id;
  //console.log("id",id);
  const query ={
    _id : new ObjectId(id),
  };
  const result = await wishlistCollection.deleteOne(query);
  console.log(result);
  res.send(result);
})




//update data
app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  const query = {
    _id: new ObjectId(id),
  }
  const result = await blogCollection.findOne(query);
  //console.log(result);
  res.send(result);
});


//updaedt data
app.put("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const options = { upsert: true };
  const filter = {
    _id: new ObjectId(id),
  };
  const updatedData = {
    $set: {
      image: data.image,
      title: data.title,
      description: data.description,
      longdescription: data.longdescription,
      category: data.category,
    },
  };
  const result = await blogCollection.updateOne(filter, updatedData, options);
  res.send(result);
});



//Delete blog Data
app.delete("/blog/:id" , async(req, res) =>{
        const id = req.params.id;
        //console.log("id",id);
        const query ={
          _id : new ObjectId(id),
        };
        const result = await blogCollection.deleteOne(query);
        //console.log(result);
        res.send(result);
})


//Post Comment data 
app.post("/comment", async (req, res) => {
  const commentData = req.body;
  const currentDate = new Date();
  commentData.createdAt = {
    date: currentDate.toISOString().split('T')[0],
    time: currentDate.toTimeString().split(' ')[0],
  };
  // Assuming the user's email is included in the request body as 'userEmail'
  const userEmail = req.body.userEmail;
  commentData.userEmail = userEmail; // Include user's email

  try {
    const result = await commentsCollection.insertOne(commentData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//comment get
app.get("/comment", async (req, res) => {
  const result = await commentsCollection.find().toArray();
  res.send(result);
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




//server test code...
app.get("/", (req, res) => {
    res.send("server is running...");
  });

app.listen(port, () => {
    console.log(`server is Running on port ${port}`);
  });
  
  