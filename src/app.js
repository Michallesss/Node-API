const Joi=require('joi');
const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
//app.use('/public', express.static('public'));
const users=require('./data.json');
app.use(express.json());

// Index
app.get('/', (req, res) => {
    res.send('index');
});

// User API
app.get('/api/users', (req, res) => {
    res.send(users);
});

// Select User API
app.get('/api/users/:id', (req, res) => {
    const user=users.find(c => c.id === parseInt(req.params.id));
    if(!user) {return res.status(404).send('User with that id was not found');}
    else {res.send(user);}
});

//Post User API
app.post('/api/users', (req, res) => {
    const { error } = validateuser(req.body);
    if(error) {return res.status(400).send(error.details[0].message);}
    
    const user={
        id: users.length+1,
        name: req.body.name,
        age: req.body.age,
        is_gay: req.body.is_gay,
        comment: req.body.comment
    };
    users.push(user);
    res.send(user);
});

// Update User API
app.put('/api/users/:id', (req, res) => {
    const user=users.find(c => c.id === parseInt(req.params.id));
    if(!user) {res.status(404).send('User with that id was not found');}

    const schema=Joi.object({
        id: Joi.number().required()
    });
    const result=schema.validate({id: req.params.id});
    if(result.error) {return res.status(400).send(result.error.details[0].message);}

    user.name=req.body.name;
    user.age=req.body.age;
    user.is_gay=req.body.is_gay;
    user.comment=req.body.comment;
    const { error } = validateuser(req.body);
    if(error) {return res.status(400).send(error.details[0].message);}
    res.send(user);
});

// Delete user API
app.delete('/api/users/:id', (req, res) => {
    const user=users.find(c => c.id === parseInt(req.params.id));
    if(!user) {return res.status(404).send('User with that id was not found');}

    const index=users.indexOf(user);
    users.splice(index, 1);
    res.send(user);
});

// Validator
function validateuser(user) {
    const schema=Joi.object({
        name: Joi.string().min(3).max(50).required(),
        age: Joi.number().min(1).max(999).required(),
        is_gay: Joi.bool().required(),
        comment: Joi.string().max(250).allow(null).required()
    });
    return schema.validate({name: user.name, age: user.age, is_gay: user.is_gay, comment: user.comment});
}

// Host
app.listen(port, (err) => {
    if(err) {
        return console.error('Can not start a server:',err);
    }
    else {
        console.log(`Server listening on port ${port}...`);
    }
});