const mongoose = require('mongoose');
const Airport = require('../models/airports');
const cities = require('./cities');
const { places, descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/airports', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Airport.deleteMany({});
    //const c = new Airport({title: 'New York'});
    //await c.save();
    for(let i = 0; i<50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const airp = new Airport({
            creator: '613a103d144c51189882e2b1',
            geometry: { 
                type: 'Point' ,
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude, 
                ]         
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate neque officiis delectus fugit quibusdam. Suscipit quod assumenda, temporibus vel ut fugiat ex magni molestiae eum illum doloribus. Distinctio, nisi eligendi.',
            code: 'XYZ',
            images: [
                {
                  url: 'https://res.cloudinary.com/ibrahimp25/image/upload/v1631638985/Airporter/jf0ltcq4mp6tqnfkylja.jpg',
                  filename: 'Airporter/jf0ltcq4mp6tqnfkylja'
                },
                {
                  url: 'https://res.cloudinary.com/ibrahimp25/image/upload/v1631638986/Airporter/avllznrjxaioiaivzcmk.jpg',
                  filename: 'Airporter/avllznrjxaioiaivzcmk'
                }
              ],

        })
        await airp.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
})

