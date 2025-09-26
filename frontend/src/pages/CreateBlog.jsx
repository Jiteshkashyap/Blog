import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../components/redux/blogSlice";
import { toast } from "sonner";
import { setLoading } from "../components/redux/authSlice";
import { Loader2 } from "lucide-react";
import axios from "axios";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((store) => store.blog);

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        "https://blog-3up1.onrender.com/api/v1/blog/create-blog",
        { title, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]));
          navigate(`/dashboard/create-blog/${res.data.blog._id}`);
          toast.success(res.data.message);
        }
        dispatch(setBlog([...blog, res.data.blog]));
        toast.success(res.data.message);
        navigate(`/dashboard/create-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
      <Card className="md:p-10 p-4 dark:bg-gray-800 -space-y-5">
        <h1 className="text-2xl font-bold">Lets create Blog</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          sunt tempore est excepturi quo non autem! Dignissimos iste blanditiis
          ex explicabo necessitatibus. Temporibus quis quos iusto voluptas
          aliquam? Similique nemo consequuntur voluptas eaque delectus vel quasi
          quia eum perspiciatis in, dolor placeat explicabo.!
        </p>
        <div className="mt-10">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Your Blog Name"
              className="bg-white dark:bg-gray-700 mt-1"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="mt-4 mb-5">
            <Label className="mb-1">Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button disabled={loading} onClick={createBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please Wait{" "}
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default CreateBlog;
