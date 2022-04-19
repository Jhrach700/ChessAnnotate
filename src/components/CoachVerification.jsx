import { useState } from 'react'

// import { useMoralis } from "react-moralis";
// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Icon } from "antd";  //missing Image
//import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { useHistory } from "react-router-dom";





export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [ImageUrl, setImageUrl] = useState(null)
    //const [formInput, updateFormInput] = useState({ username: '' , restaurant_name: '', state: '', zip_code: '', country: '', owner:'', manager: '', email : '', country: ''})
    const [formInput, updateFormInput] = useState({name: '', rating: '', email: '', title: '', lichess: '', chesscom: '', fide: '', country: '', national: '' })

    const { Moralis, enableWeb3 } = useMoralis();
    // const { chainId } = useMoralisDapp();
    const [checked, setChecked] = useState(false);
    //const navigate = useNavigate();
    const history = useHistory();
    const {isAuthenticated } = useMoralis();


  
    async function upload() {
        if (isAuthenticated) {
            upload_auth()
        } else {
            upload_unauth()
        }
 
    }

    async function upload_unauth() {
        //alert("HERE")
        const Coach = Moralis.Object.extend("Coach");
        const query = new Moralis.Query(Coach);
        //const currentUser = Moralis.User.current();
        //console.log("CURRENT USER:",currentUser)
        console.log("formInput:", formInput)
        //query.equalTo("user", currentUser)
        query.equalTo("name", formInput.name)
        query.equalTo("email", formInput.email)
        query.equalTo("lichess", formInput.lichess)
        query.equalTo("rating", formInput.rating)
        query.equalTo("chesscom", formInput.chesscom)
        query.equalTo("title", formInput.title)
        query.equalTo("fide", formInput.fide)
        query.equalTo("national", formInput.national)
        query.equalTo("country", formInput.country)
        await query.find().then((res) => {
            if (res == 0) {
                //alert("res is 0!")
                const rest = new Coach();
                //rest.set("user", currentUser)
                rest.set("name", formInput.name)
                rest.set("email", formInput.email)
                rest.set("lichess", formInput.lichess)
                rest.set("rating", formInput.rating)
                rest.set("chesscom", formInput.chesscom)
                rest.set("title", formInput.title)
                rest.set("fide", formInput.fide)
                rest.set("national", formInput.national)
                rest.set("country", formInput.country)
                rest.set("verified", "false")
                rest.save();
                //alert("s!")
                var params = formInput
                //params["user"] = currentUser.id
                console.log("params:", params)
                sendEmailToMe(params)
                sendEmailToCoach(params)
                //alert("Successfully sent request!")
                //history.push('NFTMarketplace');
            }


        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }


    async function upload_auth() {
        const Coach = Moralis.Object.extend("Coach");
        const query = new Moralis.Query(Coach);
        const currentUser = Moralis.User.current();
        console.log("CURRENT USER:",currentUser)
        console.log("formInput:", formInput)
        query.equalTo("user", currentUser)

        //const currentUser = Moralis.User.current();
        //console.log("CURRENT USER:",currentUser)
        console.log("formInput:", formInput)
        //query.equalTo("user", currentUser)
        query.equalTo("name", formInput.name)
        query.equalTo("email", formInput.email)
        query.equalTo("lichess", formInput.lichess)
        query.equalTo("rating", formInput.rating)
        query.equalTo("title", formInput.title)
        query.equalTo("fide", formInput.fide)
        query.equalTo("chesscom", formInput.chesscom)
        query.equalTo("title", formInput.title)
        query.equalTo("country", formInput.country)
        await query.find().then((res) => {
            if (res == 0) {
                //alert("res is 0!")
                const rest = new Coach();
                rest.set("user", currentUser)
                rest.set("name", formInput.name)
                rest.set("email", formInput.email)
                rest.set("lichess", formInput.lichess)
                rest.set("rating", formInput.rating)
                rest.set("chesscom", formInput.chesscom)
                rest.set("title", formInput.title)
                rest.set("fide", formInput.fide)
                rest.set("national", formInput.national)
                rest.set("country", formInput.country)
                rest.set("verified", "false")
                rest.save();
                //alert("s!")
                var params = formInput
                params["user"] = currentUser.id
                console.log("params:", params)
                sendEmailToMe(params)
                sendEmailToCoach(params)
                //alert("Successfully sent request!")
                //history.push('NFTMarketplace');
            }


        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }

    async function sendEmailToMe(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 

        try {

            await Moralis.Cloud.run("sendVerificationRequestToMe", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //console.log("")
            alert("Successfully sent email to Me!")
            //alert("Successfully sent request!")

        }
        catch (e) {
            console.log("error!1", e)
            alert("david1")
        }
    }

    async function sendEmailToCoach(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 

        try {

            await Moralis.Cloud.run("sendVerificationRequestToCoach", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //console.log("")
            alert("Successfully sent email to Coach!")
            //alert("Successfully sent request!")

        }
        catch (e) {
            console.log("error!2", e)
            alert("david2")
        }
    }

    function log() {
        console.log("file url:", fileUrl)
    }

    function reroute() {
        history.push('CreateNFT');
    }
    // async function onChange(checked) {
    //     setChecked(checked);
    //     console.log(`switch to ${checked}`);
    //     console.log("checked!:", checked)


    // }


    return (
        <>
            <div className="container">
                <div className="div">
                    <h1 className="text-4xl font-bold mt-0 mb-2 ">Chess Coach Verification Request Form</h1>
                </div>

                <div className="block mb-2 text-sm font-medium pt-3">Thank you for your interest!</div>
                <div className="block mb-2 text-sm font-medium pt-3">Please fill out the form so we can verify you and get you started reviewing games.</div>

                <div className="form-group">
                    <div className="mb-2 pt-5">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Name</label>
                        <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Your Name"
                            onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>


                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Primary Email Contact</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Email"
                            onChange={e => updateFormInput({ ...formInput, email: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Country</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Country"
                            onChange={e => updateFormInput({ ...formInput, country: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Rating (Fide or National)</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Rating"
                            onChange={e => updateFormInput({ ...formInput, rating: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Title</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Professional Title"
                            onChange={e => updateFormInput({ ...formInput, title: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Fide Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Fide Profile Link"
                            onChange={e => updateFormInput({ ...formInput, fide: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">National Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter National Profile Link"
                            onChange={e => updateFormInput({ ...formInput, national: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Lichess Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Lichess.org Profile Link"
                            onChange={e => updateFormInput({ ...formInput, lichess: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Chess.com Profile</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Chess.com Profile Link"
                            onChange={e => updateFormInput({ ...formInput, chesscom: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>









                </div>



                <div className='pt-7'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={upload}>  Request</button>
                </div>

            </div>


        </>
    );


}

