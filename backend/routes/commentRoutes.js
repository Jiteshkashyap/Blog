import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { createComment, deleteComment, editComment, getAllComentsOnMyBlogs, getCommentOfPosts, likeComment } from '../controllers/commentControllers.js'

const router= express.Router()

router.post('/:id/create' , isAuthenticated , createComment)
router.delete('/:id/delete' , isAuthenticated , deleteComment)
router.put('/:id/edit', isAuthenticated , editComment)
router.get('/:id/comment/all', getCommentOfPosts)
router.get('/:id/like',isAuthenticated , likeComment)
router.get('/my-blogs/comments', isAuthenticated , getAllComentsOnMyBlogs)


export default router