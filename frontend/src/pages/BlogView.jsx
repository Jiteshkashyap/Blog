import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageSquare, Share2 } from "lucide-react";
import { setBlog } from "../components/redux/blogSlice";
import CommentBox from "../components/CommentBox";
import axios from "axios";
import { toast } from "sonner";
const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const selectedBlog = blog.find((blog) => blog._id === blogId);
  const [blogLike, setBlogLike] = useState(selectedBlog.likes.length);
  const [liked, setLike] = useState(
    selectedBlog.likes.includes(user._id) || false
  );

  const changeTimeFormat = (isDate) => {
    const date = new Date(isDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };
  ///creating url which have to be shared

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this blog",
          text: "Read this amazing blog",
          url: blogUrl,
        })
        .then(() => console.log("Share Successfully"))
        .catch((err) => console.log(err));
    } else {
      //fallback to clipboard
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success("Blog link copied to the clipboard");
      });
    }
  };
  const likeorDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://blog-3up1.onrender.com/blogs/blog/${selectedBlog._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLike(!liked);
      }
      const updatedBlogData = blog.map((p) =>
        p._id === selectedBlog._id
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
          : p
      );
      toast.success(res.data.message);
      dispatch(setBlog(updatedBlogData));
    } catch (error) {
      console.log(error);
      toast.error(error.res.data.message);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-10  ">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/"> Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* blog reader */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className=" flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedBlog.author.photoUrl} alt="author" />
                <AvatarFallback>KW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)} . 8 min
              read
            </p>
          </div>
        </div>
        {/* featured image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog.thumbnail}
            alt="thumbnail"
            width={1000}
            height={500}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog.subTitle}
          </p>
        </div>
        <p
          className=""
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        />
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">Node.js</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Javacript</Badge>
            <Badge variant="secondary">Web Development</Badge>
          </div>
          {/* engagement */}
          <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={likeorDislikeHandler}
                variant="ghost"
                className="flex items-center gap-1"
              >
                {liked ? (
                  <FaHeart size={24} className="cursor-pointer text-red-600" />
                ) : (
                  <FaRegHeart
                    size={24}
                    className="cursor-pointer hover:text-gray-600 text-white"
                  />
                )}
                <span>{blogLike}</span>{" "}
              </Button>
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4" />
                <span>1 Comment</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleShare(selectedBlog._id)}
                variant="ghost"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <CommentBox selectedBlog={selectedBlog} />
      </div>
    </div>
  );
};

export default BlogView;
