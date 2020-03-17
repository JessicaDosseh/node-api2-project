const express = require('express'); 

const db = require('../data/db.js'); 

const router = express.Router(); 

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const comment = await db.findCommentById(id);
    console.log(comment); 
    if(comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ 
        success: false, message: 'invalid comment id' 
      }); 
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  } 
}); 

module.exports = router; 