import { useState } from 'react'

import { useMoralis } from "react-moralis";
import { Icon } from "antd";  //missing Image
//import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Switch } from 'antd';




export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [ImageUrl, setImageUrl] = useState(null)
    //const [formInput, updateFormInput] = useState({ username: '', email: '' })
    const [formInput, updateFormInput] = useState({ username: '', rating: '', email: '', title: '', lichess: '', chesscom: '', fide: '', country: '', national: '' })

    const { Moralis, enableWeb3 } = useMoralis();
    const [checked, setChecked] = useState(false);
    //const navigate = useNavigate();
    const history = useHistory();

    async function onChange(e) {
        const file = e.target.files[0]
        console.log("File:", file)
        //const fileInput = document.getElementById("file");
        //const data = fileInput.files[0];
        const imageFile = new Moralis.File(file.name, file);
        await imageFile.saveIPFS();
        const imageURI = imageFile.ipfs();
        console.log("imageURI btw:", imageURI)
        setImageUrl(imageURI)

        //try {
        //  const added = await client.add(
        //    file,
        //    {
        //      progress: (prog) => console.log(`received: ${prog}`)
        //    }
        //  )
        //  const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(file)
        //} catch (error) {
        //  console.log('Error uploading file: ', error)
        //}  
    }



    async function upload() {
        const User = Moralis.Object.extend("User");
        const query = new Moralis.Query(User);
        const currentUser = Moralis.User.current();
        query.get(currentUser.id).then((res) => {
            console.log("profile:", res)
            //res.set("minted", "true")
            //res.set("owner", currentUser)
            //res.set("token_id", parseInt(token_id))
            //res.set("list_price", listPrice)
            //res.set("brand_image", imageURI)
            try {
                if (checked) {
                    //alert("setting user type to restaurant")
                    res.set("user_type", "coach")
                } else {
                    res.set("user_type", "student")
                }

                if (formInput.username.length > 0) {
                    console.log("SETTING USERNAME BIT")
                    res.set("username", formInput.username)
                }

                if (formInput.email.length > 0) {
                    console.log("SETTING EMAIL BIT")
                    res.set("email", formInput.email)
                }

                if (formInput.rating.length > 0) {
                    console.log("SETTING RATING BIT")
                    res.set("rating", formInput.rating)
                }

                if (formInput.lichess.length > 0) {
                    console.log("SETTING LICHESS BIT")
                    res.set("lichess", formInput.lichess)
                }

                if (formInput.chesscom.length > 0) {
                    console.log("SETTING CHESSCOM BIT")
                    res.set("chesscom", formInput.chesscom)
                }


                res.save()
                alert("successfully updated user's profile!")
                history.push('profile');
            }
            catch (e) {
                console.log("expected handled error")
            }

            // The object was retrieved successfully.
        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }


    async function onChange2(checked) {
        setChecked(checked);
        console.log(`switch to ${checked}`);
        console.log("checked!:", checked)


    }


    return (
        <>
            <div className="container">
                <div className="div">
                    <h1 className="text-4xl font-bold mt-0 mb-2 ">Edit Profile</h1>
                </div>

                <div className="form-group">
                    <div className="mb-6 pt-5">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your username</label>
                        <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: ChessPlayer700"
                            onChange={e => updateFormInput({ ...formInput, username: e.target.value })} />
                        {/* <p class="mt-2 text-sm text-green-600 dark:text-green-500"><span class="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Email</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: exampleEmail@gmail.com"
                            onChange={e => updateFormInput({ ...formInput, email: e.target.value })} />
                        {/* <p class="mt-2 text-sm text-green-600 dark:text-green-500"><span class="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Rating (Fide or National)</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Rating"
                            onChange={e => updateFormInput({ ...formInput, rating: e.target.value })} />
                        {/* <p class="mt-2 text-sm text-green-600 dark:text-green-500"><span class="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Lichess Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Lichess.org Profile Link"
                            onChange={e => updateFormInput({ ...formInput, lichess: e.target.value })} />
                        {/* <p class="mt-2 text-sm text-green-600 dark:text-green-500"><span class="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Chess.com Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Chess.com Profile Link"
                            onChange={e => updateFormInput({ ...formInput, chesscom: e.target.value })} />
                        {/* <p class="mt-2 text-sm text-green-600 dark:text-green-500"><span class="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>







                    <div className="flex flex-row">
                        <Switch onChange={onChange2} />
                        <div className="pl-3 block mb-2 text-sm font-medium">Switch User Type (Dev Mode)</div>
                    </div>












                </div>



                <div className='pt-7'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={upload}>  Save Changes</button>
                </div>

            </div>


        </>
    );


}

