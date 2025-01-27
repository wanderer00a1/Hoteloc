
const Hotel = require('../models/hoteloc')
const cities = require('./cities');
const Review = require('../models/reviews')
const { places,descriptors, images } = require('./seedHelpers')
const mongoose = require('mongoose');

main().catch(err =>{ 
    console.log("Connection Failed");
    console.log(err)});

async function main() {
  await mongoose.connect('mongodb+srv://dhamalove25:aMP86EIMjIY4I21g@hoteloc.odush.mongodb.net/mydatabase');
    console.log("Connected")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)]
}

const rootDB = async() =>{
    await Hotel.deleteMany({});
    await Review.deleteMany({});
    const total = cities.length;
    for(let i = 0; i < 400; i++){
        const random1000 = Math.floor(Math.random()*cities.length);
        const price = Math.floor(Math.random()*20)+10;
        const hotel = new Hotel({
            author: '679641c23e8c250b76013eee',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo esse vero recusandae, fuga deserunt ab repudiandae non, explicabo sequi quos iure quasi asperiores commodi quae! Fugiat inventore pariatur perferendis fugit!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,cities[random1000].latitude]
              },
            images:[
              {
                url: 'https://res.cloudinary.com/dl13fjvsp/image/upload/v1737367832/Hoteloc/cjygu18uhapec6gnaiex.jpg',
                filename: 'Hoteloc/cjygu18uhapec6gnaiex',
              },
              {
                url: 'https://res.cloudinary.com/dl13fjvsp/image/upload/v1737367833/Hoteloc/l2sa89gdntjnib3akqfq.jpg',
                filename: 'Hoteloc/l2sa89gdntjnib3akqfq',
              }
            ]
          })
      await hotel.save();
    }
}


rootDB();