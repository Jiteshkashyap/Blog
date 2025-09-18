import { Blog } from "../models/blogModel.js"
import { comment } from "../models/commentModel.js"

export const createComment= async (req,res)=>{
    try {
        const postId =req.params.id
        const userCommentedId= req.id
        const {content}=req.body

        if(!content){
            return res.status(400).json({
                success:false,
                message:"Text is required"
            })
        }

        const blog= await Blog.findById(postId)

        if(!blog){
            return res.status(400).json({
                success:false,
                message:"Blog not found"
            })
        }
        const Comment= await comment.create({
            content ,
            userId: userCommentedId,
            postId:postId
        })

        await Comment.populate({
            path:'userId',
            select: 'firstName lastName photoUrl'
        })
        
        blog.comments.push(Comment._id)
        await blog.save()

        return res.status(200).json({
            success:true,
            message:"Comment added succesfully",
            comment:Comment
        })
    } catch (error) {
         return res.status(500).json({
            success:false ,
            message:"Unable to write comment",
            error:error.message
         })
    }

}

export const getCommentOfPosts=async (req,res)=>{
    try {
        const blogId= req.params.id
        const Comments = await comment.find({postId:blogId}).populate({
            path:'userId',
            select:'firstName lastName photoUrl'
        }).sort({createdAt:-1})

        if(!Comments){
            return res.status(404).json({
                success:false,
                message:"No Comments found for this blog"
            })
        }
        return res.status(200).json({
            success:true,
            Comments,
            message:"Comments Showing"
        })
        
    } catch (error) {
       return res.status(404).json({
        success:false,
        message:'Unable to get Comments'
       })
    }
}

export const deleteComment = async(req,res)=>{
    try {
         const commentId= req.params.id
         const authorId= req.id
         const Comment= await comment.findById(commentId)

         if(!Comment){
            return res.status(404).json({
                success:false,
                message:"Comment not found"
            })
         }
         if(Comment.userId.toString() !== authorId){
            return res.status(403).json({
                success:false,
                message:"Unauthorized to delete the comment"
            })
         }

         const blogId = Comment.postId

         //Delete the comment
         await comment.findByIdAndDelete(commentId)

         // Remove commentId from the blogs
         await Blog.findByIdAndUpdate(blogId,{
            $pull:{comments:commentId}
         })

         return res.status(200).json({
            success:true,
            message:"Comment deleted Succesfully"
         })

        
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"Unable to delete Comment",
            error:error.message
        })
    }
}

export const editComment= async (req,res)=>{
    try {
        const userId=req.id
        const {content} = req.body
        const commentId=req.params.id

        const Comment= await comment.findById(commentId)

        if(!Comment){
          return res.status(404).json({
            success:false,
            message:'Comment not found'
          })
        }
        //Check if user owns the comment

        if(Comment.userId.toString() !== userId.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorize to edit this comment"
            })
        }
        
        Comment.content=content
        Comment.editedAt= new Date()

        await Comment.save()

        return res.status(200).json({
            success:true,
            message:'Comment updated successfully!'
        })
        
    } catch (error) {
        return res.status(500).json({
             success:false ,
             message:"Comment is not edited",
             error:error.message
        })
    }
}

export const likeComment= async (req,res)=>{
    try {
        const commentId=req.params.id
        const userId=req.id
        const Comment= await comment.findById(commentId).populate('userId')

        if(!Comment){
            return res.status(404).json({
                success:false,
                message:"Comment not found!"
            })
        }

        const alreadyLiked=Comment.likes.includes(userId)

        if(alreadyLiked){
            // if already like unlike it
            Comment.likes= Comment.likes.filter(id => id !== userId)
            Comment.nunmberOfLikes -= 1
        }else{
            // if not liked it like it
            Comment.likes.push(userId)
            Comment.nunmberOfLikes += 1
        }
        await Comment.save()
        res.status(200).json({
            success:true,
            message:alreadyLiked? "Comment unliked" : "Comment liked",
            updatedComment: Comment
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false ,
            message:"Unable to like the comment",
            error:error.message
        })
    }
}

export const getAllComentsOnMyBlogs=async (req,res)=>{
    try {
        const userId= req.id
        //find all blog posts by user

        const myBlogs= await Blog.find({author:userId}).select("_id")

        const blogsId= myBlogs.map(blog=> blog._id)

        if(myBlogs.length === 0){
            return res.status(200).json({
                success:true,
                totalComments:0,
                comment:[],
                message:"No blogs found for this user"
            })
        }

        const Comments= await comment.find({postId:{$in:blogsId}})
        .populate('userId', 'firstName lastName email' )
        .populate('postId', 'title')

        return res.status(200).json({
            success:true ,
            Comments,
            totalComments:Comments.length
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Failed to get Comments',
            error:error.message
        })
    }
}