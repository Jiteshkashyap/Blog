import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBlog } from "./redux/blogSlice";
import BlogCardList from "./BlogCardList";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const RecentBlogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector((store) => store.blog);

  useEffect(() => {
    const getAllPublishedBlogs = async () => {
      try {
        const res = await axios.get(
          `https://blog-3up1.onrender.com/api/v1/blog/get-published-blogs`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blog));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllPublishedBlogs();
  }, []);
  console.log(blog);
  return (
    <div className="bg-gray-100 dark:bg-gray-800 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col space-y-4 items-center">
        <h1 className="text-4xl font-bold pt-10">Recent Blog</h1>
        <hr className="w-24 text-center border-2 border-red-500 rounded-full"></hr>
      </div>
      <div className="max-w-7xl mx-auto  flex gap-6">
        <div>
          <div className="mt-10 px-4 md:px-0">
            {blog?.slice(0, 4)?.map((blog, index) => {
              return <BlogCardList blog={blog} key={index} />;
            })}
          </div>
        </div>
        <div className="bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10">
          <h1 className="text-2xl font-semibold">Popular Categories</h1>
          <div className="my-5 flex flex-wrap gap-3">
            {[
              "Blogging",
              "Web Development",
              "Digital Marketing",
              "Photography",
              "Sports",
              "Cooking",
            ].map((item, index) => {
              return (
                <Badge
                  onClick={() => navigate(`/search?q=${item}`)}
                  key={index}
                  className="cursor-pointer"
                >
                  {item}
                </Badge>
              );
            })}
          </div>
          <h1 className="text-xl font-semibold">Subscribe to Newsletter</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get the latest post and updates delivered striaght to your inbox{" "}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mx-auto max-w-md mt-5">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2  text-sm text-gray-300"
            />
            <Button>Subscribe</Button>
          </div>
          <div className="mt-7">
            <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
            <ul className="space-y-3">
              {[
                "10 tips to master react",
                "Understanding Tailwind css",
                "Inprove SEO in 2 minutes ",
              ].map((title, index) => {
                return (
                  <li
                    key={index}
                    className="text-sm dark:text-gray-100 hover:underline cursor-pointer"
                  >
                    {title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;
