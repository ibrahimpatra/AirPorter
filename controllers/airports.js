const Airport = require('../models/airports');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxtoken = process.env.mapbox_token ;
const geocoder = mbxGeocoding({ accessToken: mapboxtoken})

module.exports.index =  async (req, res) => {
    const airports = await Airport.find({});
    res.render('airports/index', {airports});
}

module.exports.newform = (req, res) => {   
    res.render('airports/new')
}

module.exports.newairport = async (req, res, next) => {
    //if(req.body.airport) throw new ExpressError('Invalid Airport Data', 400);
    const geodata = await geocoder.forwardGeocode({
        query: req.body.airport.code,
        limit: 1
    }).send()
    console.log(geodata.body.features)
    const airport = new Airport(req.body.airport)
    airport.geometry = geodata.body.features[0].geometry;
    airport.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    airport.creator = req.user._id;
    await airport.save();
    console.log(airport)
    req.flash('success', 'Successfully added a new Airport');
    res.redirect(`/airports/${airport._id}`)
    /*  for (let i = 0; i < 10; i++){
        if ( geodata.body.features[i].properties.category === 'airport'){
            console.log(geodata.body.features)
            res.send(geodata.body.features[i].geometry.coordinates)
  
        } 
    }*/ 
    
}

module.exports.airportdetails =  async (req, res) => {
    const airport = await (await Airport.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'creator'
        }
    }).populate('creator'));
     console.log(airport)
    if(!airport) {
        req.flash('error', 'Cant find Airport.')
        return res.redirect('/airports')
    }
    //console.log(airport);
    res.render('airports/show', {airport})
}

module.exports.editform = async (req, res) => {
    const {id} = req.params;
    const airport = await Airport.findById(id)
    if(!airport) {
        req.flash('error', 'Cant find Airport.')
        return res.redirect('/airports')
    }
    res.render('airports/edit', {airport})
}

module.exports.editairport = async (req,res) => {
    // res.send("it worked bc!!")
    const { id } = req.params;  
    // console.log(req.body) 
    const geodata = await geocoder.forwardGeocode({
        query: req.body.airport.code,
        limit: 1
    }).send()
   
    const airport = await Airport.findByIdAndUpdate(id, { ...req.body.airport })
    airport.geometry = geodata.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    airport.images.push(...imgs)   
    await airport.save()
    if (req.body.deleteImages){
        for (let file of req.body.deleteImages){
            await cloudinary.uploader.destroy(file);
        }
        await airport.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(airport)
    }
    req.flash('success', 'Successfully updated Airport');
    res.redirect(`/airports/${airport._id}`)
}

module.exports.deleteairport = async (req,res) => {
    const { id } = req.params;
    await Airport.findByIdAndDelete(id)
    req.flash('error', 'Successfully deleted Airport');
    res.redirect('/airports')
}