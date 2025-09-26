import { Blog } from "../models/blogModel.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/dataUri.js"


export const createBlog=async(req,res)=>{
    try {

        const{title,category}=req.body
        if(!title || !category){
            return res.status(400).json({
                message:"Blog title and category is required"
            })
        }

        const blog=await Blog.create({
            title,
            category,
            author:req.id
        })

        return res.status(201).json({
            success:true,
            message:"Blog Created Succesfully",
            blog
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to create blog"
        })
        
    }

}

export const updateBlog=async(req,res)=>{
    try {

        const blogId=req.params.blogId
        const {title, subTitle ,description,category}=req.body
        const file=req.file

        let blog=await Blog.findById(blogId)

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog Not Found"
            })
        }

        let thumbnail;
        if(file){
            const fileUri=getDataUri(file)
            thumbnail= await cloudinary.uploader.upload(fileUri.content)
        }
        
        const updateData={title , subTitle , description, category, author:req.id, thumbnail:thumbnail?.secure_url}
        blog=await Blog.findByIdAndUpdate(blogId,updateData , {new:true})
        res.status(200).json({
            success:true,
            message:"Blog Updated Succesfully",
            blog
        })

    } catch (error) {
          console.log(error)

        return res.status(500).json({
            success:false,
            message:"Error Uploading Blog"
        })
    }
}

export const  getOwnBlogs=async(req,res)=>{
    try {
        const userId=req.id

        if(!userId){
            res.status(400).json({
             message:"UserId is required"
         })
        }

        const blogs =await Blog.find({author:userId}).populate({
             path:"author",
             select:" firstName lastName photoUrl"
            })
            if(!blogs){
                return res.status(404).json({
                    message:"No blogs found",
                    blogs:[],
                    success:false
                })
            }
            return res.status(200).json({
                message:"Blogs Found",
                blogs,
                success:true
            })

         
    } catch (error) {
        res.status(500).json({
            message:"Error fetching blogs",
            error:error.message ,
            success:false
        })
    }
}

export const deleteBlog=async(req,res)=>{
    try {
        const blogId=req.params.id
        const author=req.id
        const blogs= await Blog.findById(blogId)

        if(!blogs){
            return res.status(404).json({
                success:false,
                message:"Blog Not found"
            })
        }
        if(blogs.author.toString() !== author){
            res.status(403).json({
                success:false,
                message:"Unauthorized to delete this blog"
            })
        }
  //Delete
   await Blog.findByIdAndDelete(blogId)
    res.status(200).json({
    success:true,
    message:"Blog Deleted succesfully"
   })
        
    } catch (error) {
        res.status(500).json({
            message:"Error deleting blog",
            success:false,
            error:error.message
        })
   }
}

export const getPublishedBlog=async(__,res)=>{
    try {
        const blog= await Blog.find({isPublished:true}).sort({createdAt: -1}).populate({
            path:"author",
            select:" firstName lastName photoUrl"
        })

        
        if(!blog){
            res.status(401).json({
                message:"Blog not found",
                success:false
            })
        }

      return  res.status(200).json({
        success:true,
        blog,
        
      })

    } catch (error) {
        return res.status(500).json({
            message:"Fail to Publish code",
            success:false,
            error
        })
        
    }
}

export const togglePublished=async(req,res)=>{
    try {
        const {blogId}= req.params

        const blog =await Blog.findById(blogId)

        if(!blog){
             return res.status(404).json({
                message:"Blog not found"
            })
        }
        //Publish status based on query parameter
        blog.isPublished =!blog.isPublished
        await blog.save()

        const statusmessage= blog.isPublished ? "Published" : "Unpublished"
         return res.status(200).json({
            success:true ,
            message:`Blog is ${statusmessage} `
         })
        
    } catch (error) {
        return res.status(500).json({
            message:"Fail to update status",
            success:false,
            error
        })
    }
}

export const likeBlog=async(req,res)=>{
    try {
        const blogId =req.params.id
        const userLiked=req.id
        const blog = await Blog.findById(blogId).populate({path:"likes"})
        if(!blog){
            return res.status(404).json({
                message:"Blog not found",
                success:false
            })
        }
        await blog.updateOne({$addToSet :{likes : userLiked}})
        await blog.save()
        return res.status(200).json({
            message:"Liked blog succesfully",
            success:true,
            blog
        })
        
    } catch (error) {
        console.log(error)
    }
}
export const dislikeBlog= async(req,res)=>{
    try {
        const blogId =req.params.id
        const userDisliked=req.id
        const blog = await Blog.findById(blogId).populate({path:"likes"})
        if(!blog){
            res.status(404).json({
                message:"Blog not found",
                success:false
            })
        }
         await blog.updateOne({$pull:{likes: userDisliked}})
         await blog.save()
         return res.status(200).json({
            message:"Blog disliked succesfully",
            success:true,
            blog
         })

    } catch (error) {
        console.log(error)
    }
}

export const getMyTotalBlogLikes = async(req,res)=>{
       try {
        const userId =req.id
        const myBlogs = await Blog.find({author:userId}).select("likes")
        const totalLikes = myBlogs.reduce((acc,blog)=> acc+(blog.likes?.length || 0), 0)

        return res.status(200).json({
            success:true ,
            totalLikes,
            totalBlogs:myBlogs.length
        })
        
       } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to fetch total Blog likes"
        })
       }
}

