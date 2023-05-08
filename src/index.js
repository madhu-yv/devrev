const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")
const Userdetails=require("./models/usermodel")
const slotDetails = require("./models/slots")
const methodOverride = require("method-override");
const { CLIENT_RENEG_LIMIT } = require("tls")
const usermodel = require("./models/usermodel")

app.use(methodOverride('_method'));
const templatepath=path.join(__dirname,'../templates')

let name,id;

app.use(express.json());
app.set("view engine","hbs");
app.set("views",templatepath);
app.use(express.urlencoded({extended:false}))

app.use(express.static(__dirname+'/assets'))

app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/booked",(req,res)=>{
    res.render("booked")
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.post("/signup",async (req,res)=>{
    const data={
        name:req.body.name,
        password:req.body.password
    } 
    await collection.insertMany([data])
    res.render("userdetails");
})

app.post("/login",async (req,res)=>{
    try{
        const check=await collection.findOne({name:req.body.name});
        name=check.name;
        id=check._id
        if(check.password===req.body.password ){
            res.render("userdetails");
        }
        else{
            res.send("Wrong password");
        }
    }
    catch{
        res.send("wrong Details");
    } 
    res.render("login");
})

////////////////////////////////////////////////////admin///////////////////////////////////////////////////////////////////
app.get('/admin', async(req,res)=>{
    res.render('adminLogin');
});

app.post('/admin', async(req,res)=>{
    try{
        if("admin123" === req.body.password && "admin" === req.body.name){
            console.log("object");
            Userdetails.find()
            .then((data)=>{
                console.log("data",data);
                res.render("adminHome", {details:data});
            })
        }
        else{
            res.send("You must enter credentials");
        }
    }
    catch{
        res.send("wrong Details");
    }
});
/////////////////////////////////////////////////////user side ///////////////////////////
app.get("/userdetails",(req,res)=>{
    res.render("userdetails");
})

app.post("/userdetails",(req,res)=>{
    const data=new Userdetails(req.body);
    data.save();
    console.log(data);
    res.redirect("/home");
})

app.get("/home", async function(req, res) {
console.log(name)

console.log(id)

    await slotDetails.find()
	        // <a href="#myModal" class="trigger-btn btn btn-success submit"  data-toggle="modal">Book Now</a>
    .then((data)=>{
        console.log("object", data);
        res.render('home', {details:data});
    })
});

app.post("/home", async function(req, res) {
    const district = req.body.district;
    await slotDetails.find({"district":district})
    // console.log(name)
    .then((data)=>{
        console.log("object", data);
        res.render('home', {details:data});
    })

});

app.get('/user/show/:id', async function(req, res) {
    await slotDetails.findById(req.params.id)
    .then((data)=>{
        console.log(data)
        res.render('usershow', {details:data});
    })
});



// update
app.get('/user/edit/:id', async function(req, res) {
    await Userdetails.findById(req.params.id)
    .then((data)=>{
        console.log(data)
        console.log("3",data);
        res.render('useredit', {details:data});
    })
});

app.post('/user/edit/:id', async function(req, res) {
    await Userdetails.findByIdAndUpdate(req.params.id, req.body)
    .then((data)=>{
        res.render('useredit', {details:data});
    })
}); 

app.get('/user/book/:id', async function(req, res){

    await slotDetails.findById(req.params.id)
    .then((data)=>{
        res.render('useredit', {details:data});
    })
});



app.post('/user/bookSlot/:id', async function(req, res){

    console.log("hi")

    const data = await slotDetails.findById(req.params.id)
    await usermodel.findOneAndUpdate({phone:req.body.phone},{slot:data.slot,center:data.centerName})

    const user = await usermodel.findOne({phone:req.body.phone})
    console.log(user)
    await slotDetails.findByIdAndUpdate(req.params.id,{available:data.available-1})
    .then((data)=>{
        res.render('booked', {details:user});
    })
});






// app.post('/user/book/:id', async function(req, res){
//     const available = { available: req.body.available - 1};
//     await slotDetails.findByIdAndUpdate(req.params.id, available)
//     .then((data)=>{
//         res.render('useredit', {details:data});
//     })
// });

// delete
app.delete('/user/:id', async function(req, res) {
    await Userdetails.findByIdAndDelete(req.params.id)
    res.redirect('/home')
});

///////////////////////////////////////////////////////////////////////////
// slot home
app.get('/slot', async function(req, res) {
    await slotDetails.find()
    .then((data)=>{
        res.render('slotHome', {details:data});
    })
});






// create
app.get('/slot/add', async function(req, res) {
    res.render('slotAdd');
});


app.post('/slot/add', function(req,res) {
    const data=new slotDetails(req.body);
    data.save();
    console.log(data);
    res.redirect("/slot");
});


// read
app.get('/slot/show/:id', async function(req, res) {
    await slotDetails.findById(req.params.id)
    .then((data)=>{
        res.render('slotshow', {details:data});
    })
});

// update
app.get('/slot/edit/:id', async function(req, res) {
    await slotDetails.findByIdAndUpdate(req.params.id, req.body)
    .then((data)=>{
        res.render('slotEdit', {details:data});
    })
});

app.post('/slot/edit/:id', async function(req, res) {
    await slotDetails.findByIdAndUpdate(req.params.id, req.body)
    .then((data)=>{
        res.render('slotshow', {details:data});
    })
});

// delete
app.delete('/slot/:id', async function(req, res) {
    await slotDetails.findByIdAndDelete(req.params.id)
    res.redirect('/slot')
}); 

app.listen(3000,()=>{
    console.log("port connected running at http://localhost:3000");
})
