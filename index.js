const express = require("express");
const app = express();
PORT = process.env.PORT || 5001;
const cors = require("cors");

const { graphqlHTTP } = require('express-graphql');
const graphql = require("graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = graphql;

const mongoose = require('mongoose');

// const dbURI = 'mongodb+srv://tiktaktoe:ryklrvUOQV7mBgkq@tiktaktoe.g2iap.mongodb.net/results';

// mongodb+srv://tiktaktoe:ryklrvUOQV7mBgkq@tiktaktoe.n9z04.mongodb.net/results?retryWrites=true&w=majority
const dbURI =process.env.MONGODB_URI;

const ResultsSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true
    },
    results: {
        type: String,
        required: true
    }
});

const ResultsMon = mongoose.model('results',ResultsSchema);

const ResultsType = new GraphQLObjectType({
    name: "Results",
    fields: ()=> ({
        id: {type: GraphQLString},
        player: {type: GraphQLString},
        results: {type: GraphQLString}
    })
});


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getResults: {
            type: new GraphQLList(ResultsType),
            // args: {id: {type: GraphQLInt}} ,
            async resolve(parent,args) {
                return await ResultsMon.find();
            }
        }
    }
})
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createGameResults: {
            type: ResultsType,
            args: {
                id: {type: GraphQLInt},
                player: {type: GraphQLString},
                results: {type: GraphQLString}
            },
        async resolve(parent,args){
                if(!results.some(item => item.id === args.id)){
                    const result = new ResultsMon({player:args.player, results: args.results })
                    await result.save();
                    return args
                }
                return null
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery, mutation: Mutation
})
app.use(cors());
app.use(express.json());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));




mongoose.connect(dbURI, {useNewUrlParser: true}).then((data)=>{

   return app.listen(PORT, () => {
        console.log('Server runnig' ,data)
    })

}).catch(err=>{
    console.log(err)
});

