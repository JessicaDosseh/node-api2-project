const express = require('express'); 
const db = require('../data/db.js'); 

const router = express.Router(); 

// MVP

// -------  :)  -------- //
// POST	/api/posts	
// Creates a post using the information sent inside the request body.

router.post('/', (req, res) => {
  const postData = req.body;

  if (!postData.contents || !postData.title) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(postData)
      .then(post => {
        res.status(201).json({ success: true, post });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
}); 


// -------  :(  -------- //
// POST	/api/posts/:id/comments	
// Creates a comment for the post with the specified id using information sent inside of the request body.

router.post('/:id/comments', async (req, res) => {
  const postComment = req.body.text;
  const id = req.params.id;

  if (postComment) {
    db.findById(id)
      .then((post) => {
        if (post.length > 0) {
          db.insertComment({ text: postComment, post_id: Number(id) })
            .then(commentID => {
              db.findCommentById(commentID.id)
                .then((comment) => res.status(201).json({ success: true, comment }));
            })
            .catch((err) => res.status(500).json({ error: 'There was an error while saving the comment to the database', err }));
        } else {
          res.status(404).json({ message: 'The post with the specified ID does not exist.' });
        }
      });
  } else {
    res.status(400).json({ errorMessage: 'Please provide text for the comment' });
  }
});

// -------  :) -------- // 
// GET	/api/posts	
// Returns an array of all the post objects contained in the database.

router.get('/', (req, res) => {
  console.log(req.query); 
  db.find(req.query)
    .then(response => {
      res.status(200).json(response); 
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error retrieving the db post', error,
      });
    });
});

// -------  :) -------- // 
// GET	/api/posts/:id	
// Returns the post object with the specified id.

router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(response => {
      if(response) {
        res.status(200).json(response);
      } else { 
        res.status(404),json({
          message: 'Response not found'
        }); 
      }
    })
    .catch(error => {
      console.log(error); 
      res.status(500).json({
        message: 'Error retrieving the db id post',
      });
    });
});

// -------  :) -------- // 
// GET	/api/posts/:id/comments	
// Returns an array of all the comment objects associated with the post with the specified id.

router.get('/:id/comments', async (req, res) => {
  const id = req.params.id;

  db.findCommentById(id)
    .then((comment) => {
      if (comment) {
        res.status(200).json({ success: true, comment });
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'The comments information could not be retrieved.', err });
    });

});


// -------  :)  -------- //
// DELETE	/api/posts/:id	
// Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
    .then(postID => {
      if (postID) {
        res.status(200).json({ success: true, postID });
      } else {
        res.status(404).json({ 
          message: 'The post with the specified ID does not exist.' 
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: 'The post could not be removed', error });
    });
});


// -------  :)  -------- //
// PUT	/api/posts/:id	
// Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const postData = req.body;

  if (!postData.title || !postData.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  } else {
    db.update(id, postData)
      .then(response => {
        if (response) {
          res.status(200).json({ success: true, response });
        } else {
          res.status(404).json({ message: 'The post with the specified ID does not exist.' });
        }
      })
      .catch((err) => {
        res.status(500).json({ errorMessage: 'The user information could not be modified.', err });
      });
  }
});

module.exports = router; 