import { Card } from "../components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();

  const getAllComments = async () => {
    try {
      const res = await axios.get(
        `https://blog-3up1.onrender.com/api/v1/comment/my-blogs/comments`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setAllComments(res.data.Comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);
  console.log(allComments);

  return (
    <div className="pb-10 pt-20 md:ml-[320px] h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent comments.</TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                <TableHead>Blog Title</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto">
              {allComments?.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <h1 className=" w-[58px] md:w-full truncate">
                      {comment?.postId?.title}
                    </h1>
                  </TableCell>
                  <TableCell className=" w-[120px] md:w-auto truncate">
                    <h1 className=" w-[58px] md:w-full truncate">
                      {comment?.content}
                    </h1>
                  </TableCell>
                  <TableCell>{comment?.userId?.firstName}</TableCell>
                  <TableCell className="text-right flex gap-3 items-center justify-center">
                    <Eye
                      className="cursor-pointer"
                      onClick={() => navigate(`/blogs/${comment.postId._id}`)}
                    />
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
export default Comments;
