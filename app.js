const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');


const app = express();

let dummyMessage = "Something in DummyMessage";
let dummyUser;

// create schema
const graphQLSchema = buildSchema(`
    type User {
        name : String,
        age : Int,
        address : String,
        password : String,
        confirmPassword : String,
    }
    
    type Post {
        userId : Int,
        id : Int,
        title : String,
        body : String
    }

    type Query {
        hello : String,

        sayWelcome(name:String) : String!

        getUserDetails : User

        getAllUserList : [User]

        getDummyMessage : String

        getExternalAPI : [Post]

    }

    type Mutation {
        changeDummyMessage(msg : String) : String

        createUser(name:String!, 
            age:Int!, 
            address:String!, 
            password:String!, 
            confirmPassword:String!
        ) : User
    }
`);


// 2. create resolver for graphQLSchema
const root = {
    hello : () => {
        return "Hello World!";
    },

    sayWelcome : (args) => {
        return `Welcome to GraphQL, Mr.${args.name}`
    },

    getUserDetails : () => {
        /* 
         * I am Hardcoding for Practice Purpose, 
         * (Realtime it get from db or external API)
         */


        const user = {
            name : "Anbalagan",
            age : 21,
            address : "Kallikaadu, Thanjai District, Tamil Nadu",
            password : "1234",
            confirmPassword : "1234",
        }

        return user
    },


    getAllUserList : () => {

        const userList = [
            {
                name : "Anbalagan",
                age : 21,
                address : "Kallikaadu, Thanjai District, Tamil Nadu",
                password : "1234",
                confirmPassword : "1234",
            },{
                name : "Bakiyaraj",
                age : 29,
                address : "Arasalur, Thiruvanamalai District, Tamil Nadu",
                password : "1234",
                confirmPassword : "1234",
            }
        ];

        return userList;
    },


    getDummyMessage : () => {
        return dummyMessage
    },

    changeDummyMessage : (args) => {
        dummyMessage = args.msg
        return "Changed"
    },

    createUser : (args) => {
        const user = {
            name : args.name,
            age : args.age,
            address : args.address,
            password : args.password,
            confirmPassword : args.confirmPassword
        }
        dummyUser = user;
        console.log(`DummyUser - ${JSON.stringify(dummyUser)}`)
        return user;
    },

    getExternalAPI : async() => {
        try{
            // const result = await fetch('https://jsonplaceholder.typicode.com/posts')

            const result = await axios.get("https://jsonplaceholder.typicode.com/posts");
            // console.log(result);
            return result.data;

        }catch(err){
            console.warn(err);
            return null
        }
    }

}



// 3. api-end-point
app.use(
    '/graphQL',
    graphqlHTTP({
        graphiql : true,
        schema : graphQLSchema,
        rootValue : root,
    }),
);


app.get('/', function(req, res){
    res.send('Welcome to GraphQL')
});


app.listen(8080, function(){
    console.log("SERVER IS RUNNING on 8080 ....");
})
