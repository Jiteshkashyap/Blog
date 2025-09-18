import { Avatar } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import React, { useState } from "react";
import { AvatarImage } from "../components/ui/avatar";
import userLogo from"../assets/user.jpg"
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { useDispatch, useSelector } from "react-redux";
import store from "../components/redux/store";
import { setLoading, setUser } from "../components/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TotalProperty from "../components/TotalProperty";

const Profile=()=>{
 
    const[open,setOpen]=useState(false)
    
    const {user , loading}=useSelector(store=>store.auth)
    const dispatch=useDispatch()
    const [input, setInput]=useState({
        firstName:user?.firstName || "",
        lastName:user?.lastName || "",
        occupation:user?.occupation || "",
        bio:user?.bio || "",
        facebook:user?.facebook || "",
        instagram:user?.instagram || "",
        linkedin:user?.linkedin || "",
        github:user?.github || "",
        file:user?.photoUrl || ""
    })

    const changeEventHandler=async(e)=>{
    const {name,value}=e.target;
    setInput((prev)=>({
        ...prev,
        [name]:value
    }))
  }
  

  const fileHandler=(e)=>{
    setInput({...input , file:e.target.files?.[0]})
  }
  const handleSubmit=async (e)=>{
    e.preventDefault()

    const formData= new FormData()
    formData.append("firstName",input.firstName);
    formData.append("lastName",input.lastName);
    formData.append("bio",input.bio);
    formData.append("occupation",input.occupation);
    formData.append("facebook",input.facebook);
    formData.append("linkedin",input.linkedin);
    formData.append("instagram",input.instagram);
    formData.append("github",input.github);
    if(input?.file){
      formData.append("file", input?.file)
    }
   console.log(input)
    
    try {
      dispatch(setLoading(true))

      const res =await axios.put("http://localhost:8000/api/v1/user/profile/update",formData ,{
        headers:{
          "Content-Type":"multipart/form-data"
          
        },withCredentials:true
      })
      console.log("🚀 Profile Update Response", res.data)
      if(res.data.success){
        setOpen(false)
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
      
    } catch (error) {
      console.log(error)
    }
    finally{
      dispatch(setLoading(false))
    }
  }

    return(
        <div className="pt-20 md:ml-[320px] md:h-screen">
            <div className="max-w-6xl mx-auto mt-8">
                <Card className="flex md:flex-row  flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:md-0">
                {/* image section */}
                <div className="flex flex-col items-center justify-center md:w-[400px]">
                   <Avatar className="w-40 h-40 border-2">
                    <AvatarImage src={ user?.photoUrl || userLogo} />
                   </Avatar>
                   <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">{user?.occupation ||"MERN Stack Developer"}</h1>
                   <div className="flex gap-4  items-center">
                    <Link><FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" /></Link>
                    <Link><FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" /></Link>
                    <Link><FaLinkedin className="w-6 h-6 text-gray-800 dark:text-gray-300" /></Link>
                    <Link><FaGithub className="w-6 h-6 text-gray-800 dark:text-gray-300" /></Link>
                   </div>
                </div>
                      {/* info section */}
                      <div>
                        <h1 className="font-bold text-center md:text-start text-4xl mb-7">Welcome {user?.firstName || "user"} !</h1>
                        <p><span className="font-semibold">Email: </span>{user?.email}</p>
                        <div className="flex flex-col gap-2 items-start justify-start my-5">
                            <Label>About Me</Label>
                            <p className="border dark:border-gray-600 p-6 rounded-lg">
                                {user?.bio || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem corrupti, enim voluptatibus labore exercitationem reiciendis culpa possimus iste ut debitis! Deserunt accusamus, inventore cupiditate minus quidem eum! Minima non tenetur, odio iure accusamus magni neque! "}
                            </p>
                        </div>
    <Dialog open={open} onOpenChange={setOpen}>
          <Button type="button" onClick={()=>setOpen(true)} >Edit Profile</Button>
           <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
              <DialogTitle >Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex gap-2">
            <div className="grid gap-3">
              <Label htmlFor="name-1">First Name</Label>
              <Input id="firstName"
                name="firstName" 
                placeholder="First Name"
                type="text"
                className="col-span-3  text-gray-500" 
                onChange={changeEventHandler}
                value={input.firstName}
                 />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Last Name</Label>
              <Input id="lastName"
                name="lastName" 
                placeholder="Last Name"
                type="text"
                className="col-span-3  text-gray-500"
                onChange={changeEventHandler}
                value={input.lastName}
                  />
            </div>
        </div>
        <div className="flex gap-2">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Facebook</Label>
              <Input id="facebook"
                name="facebook" 
                placeholder="Enter a Url"
                type="text"
                className="col-span-3  text-gray-500"
                onChange={changeEventHandler}
                value={input.facebook}
                />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Instagram</Label>
              <Input id="instagram"
                name="instagram" 
                placeholder="Enter a Url"
                type="text"
                className="col-span-3  text-gray-500"
                onChange={changeEventHandler}
                value={input.instagram}
                />
            </div>
        </div>
          <div className="flex gap-2">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Linkedin</Label>
              <Input id="linkedin"
                name="linkedin" 
                placeholder="Enter a Url"
                type="text"
                className="col-span-3  text-gray-500"
                onChange={changeEventHandler}
                value={input.linkedin}
                />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Github</Label>
              <Input id="github"
                name="github" 
                placeholder="Enter a Url"
                type="text"
                className="col-span-3  text-gray-500"
                onChange={changeEventHandler}
                value={input.github}
                />
            </div>
        </div>
        <div>
            <Label className="text-right ">Description</Label>
            <Textarea
            id="bio"
            name="bio"
            placeholder="Enter your description"
            className="col-span-3 text-gray-500"
            onChange={changeEventHandler}
            value={input.bio}    />
        </div>
        <div>
            <Label className="text-right mb-1">Image</Label>
            <Input
            id="file"
            type="file"
            accept="image/*"
            className="w-[277px]"
            onChange={fileHandler}
            />
        </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} type="submit"> {
                loading? (<>
                 <Loader2 className="mr-2 w-4 h-4 animate-spin" />Please Wait   </>):
                  ("Save Changes")  }
                  </Button>
          </DialogFooter>
        </DialogContent>
      
    </Dialog>
                      </div>
                </Card>

            </div>
            <TotalProperty/>
        </div>
    )
}

export default Profile;