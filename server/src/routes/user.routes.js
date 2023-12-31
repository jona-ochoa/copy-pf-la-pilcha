const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();

//create user -- para crear usuarios y que puedan coprar
router.post("/user", (req, res) => {
  const user = userSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get all users -- para que desde admin se pueda ver los usuarios
router.get("/users", (req, res) => {
  const user = userSchema;
  user
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//update a user -- para que el usuario pueda cambiar algun dato personal?
router.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, isBanned, isAdmin } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name, email, password, isBanned, isAdmin } })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario actualizado correctamente" });
    })
    .catch((error) => res.status(500).json({ error: "Error al actualizar al usuario" }));
});

//delete user by id
router.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
