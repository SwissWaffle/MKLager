let express = require('express');

let app = express();
app.use(express.json());



const students = [ 
      { id : "1", name : "Tinashe Makuti"},
      { id : "2", name : "John Doe"},
      { id : "3", name : "Some Name"}
];

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s =>s.id===req.params.id);
  if(!student) return res.status(404).send("Student not found");
  res.send(student);
});



  app.post('/api/students/', (req, res) => { 
   const student = {
         id : req.body.id,
         name : req.body.name
   };
   students.push(student);
   res.send(student);
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
   console.log(`Server running on ${port}`);
  })