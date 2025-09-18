import { Card } from "../components/ui/card";
import React, { useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../components/redux/authSlice";
import { setBlog } from "../components/redux/blogSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const YourBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector((store) => store.blog);
  const getOwnBlogs = async () => {
    try {
      const res = await axios.get(
        "https://blog-3up1.onrender.com/blogs/blog/get-own-blogs",
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(
        `https://blog-3up1.onrender.com/blogs/blog/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedBlog = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlog));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getOwnBlogs();
  }, []);

  const formatDate = (index) => {
    const date = new Date(blog[index].createdAt);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };

  return (
    <div className="pb-10 pt-20 md:ml-[320px] h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent Blogs</TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto">
              {blog?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 items-center">
                    <img
                      src={item.thumbnail}
                      className="w-20 rounded-md hidden md:block"
                      alt=""
                    />
                    <h1
                      onClick={() => navigate(`/blogs/${item._id}`)}
                      className="hover:underline cursor-pointer w-[58px] md:w-full truncate"
                    >
                      {item.title}
                    </h1>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{formatDate(index)}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/create-blog/${item._id}`)
                          }
                        >
                          {" "}
                          <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteBlog(item._id)}
                          className="text-red-500"
                        >
                          {" "}
                          <Trash2 className="text-red-500" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
export default YourBlog;
