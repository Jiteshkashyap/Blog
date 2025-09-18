import React from "react";
import { Button } from "../components/ui/button";
import Hero from "../components/Hero";
import RecentBlogs from "../components/RecentBlog";
import PopularAuthors from "../components/PopularAuthors";
import Footer from "../components/Footer";

const Home=()=>{
    return(
        <div className="pt-20">
           <Hero/>
           <RecentBlogs/>
           <PopularAuthors/>
           
        </div>
    )
}

export default Home;