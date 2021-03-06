const { ObjectId } = require("bson");
let Assignment = require("../model/assignment");

// Récupérer tous les assignments (GET)
// function getAssignments(req, res){
//     Assignment.find((err, assignments) => {
//         if(err){
//             res.send(err)
//         }

//         res.send(assignments);
//     });
// }

function getAssignments(req, res) {
  var aggregateQuery = Assignment.aggregate([
    {
      "$lookup": {
        "from": "assignments",
        "localField": "matiere",
        "foriegnField": "matiere",
        "as": "assignments"
      }
    },
  ]);
  Assignment.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }
      res.send(Assignment.populate(assignments, { path: 'matiere' }));
    }
  );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  // Assignment.findOne({ id: assignmentId }, (err, assignment) => {
  //   if (err) {
  //     res.send(err);
  //   }
  //   res.json(assignment);
  // });

  Assignment.aggregate([
    {
      $match: {
        assignment: {
          $in: [ObjectId(assignmentId)]
        }
      }
    }, {
      // https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
      "$lookup": {
        "from": "matieres",
        "localField": "matiere",
        "foreignField": "_id",
        "as": "matiere"
      }
    },
    {
      "$lookup": {
        "from": "prof",
        "localField": "matiere.prof",
        "foreignField": "_id",
        "as": "prof"
      }
    },
  ]).then(res => {
    console.log(res);
  })


}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  let assignment = new Assignment();
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;

  console.log("POST assignment reçu :");
  console.log(assignment);

  assignment.save((err) => {
    if (err) {
      res.send("cant post assignment ", err);
    }
    res.json({ message: `${assignment.nom} saved!` });
  });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.json({ message: "updated" });
      }

      // console.log('updated ', assignment)
    }
  );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  });
}

module.exports = {
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
