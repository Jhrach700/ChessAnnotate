//import { Card, Timeline, Typography } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
//import dynamic from 'next/dynamic';
//import Chess from "./Chess";
import { Typography } from "antd";
import 'antd/dist/antd.css';
//import Chess from 'pages/Chess.js'
import Chess from '../components/Chess.js'
//const Chessground = dynamic(() => import('react-chessground'), { ssr: false });
import 'react-chessground/dist/styles/chessground.css'
import GameList from "components/GameList"

const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function Profile({ isServerInfo, wallet_addr, personal= false }) {
  const { Moralis, enableWeb3 } = useMoralis();


  const isInchDex = useMemo(() => (Moralis.Plugins?.oneInch ? true : false), [Moralis.Plugins?.oneInch]);

  //const [CG, setCg] = useState(cg())
  const [chess, setChess] = useState(new Chess())
  const [pendingMove, setPendingMove] = useState()
  const [selectVisible, setSelectVisible] = useState(false)
  const [fen, setFen] = useState("")
  const [lastMove, setLastMove] = useState()
  const [premove, getPremoves] = useState()
  const [pgn, setPgn] = useState([])
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [currentComment, setCurrentComment] = useState("")
  const [realFen, setRealFen] = useState("")
  const [realPgn, setRealPgn] = useState("")
  const [isWalletModalVisible, setisWalletModalVisible] = useState(false);
  const [formInput, updateFormInput] = useState({ comment: '', curr_pgn: null, question: '', price: 0 })
  const [chainId, updateChainId] = useState(null)
  const [ImageUrl, setImageUrl] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [username, setUsername] = useState("Unnamed")
  const [rating, setRating] = useState("")
  const [lichess, setLichess] = useState(null)
  const [chesscom, setChesscom] = useState("chesscom")


  //Initialize Moralis web3 instance to get current chain Id
  useEffect(() => {
    init()

    if (loaded == false) {
      //const marketplace_nfts = Moralis.Object.extend("NFTMetadata");
      //const query = new Moralis.Query(marketplace_nfts);
      //const currentUser = Moralis.User.current();
      //console.log("currentUser:", currentUser)
      //console.log("currentUser user_type:", currentUser.attributes.user_type)
      
      fetch_profile_image().then(function (res) {
        try {
          if (res.length > 0) {
            //alert("MAJOR ALERT!")
            //console.log("GOLDEN GOLD:", res)

          }
          setLoaded(true)
        }
        catch (e) {

        }
        //set


      })
      if (ImageUrl != null) {

        setLoaded('true')
      }
    } else {
      //console.log("market address:", marketAddress)
      console.log("HERE?")
      setRand("rancid")
    }



  });



  async function fetch_profile_image() {
    console.log("Fetching profile image!")
    const User = Moralis.Object.extend("User");
    const query = new Moralis.Query(User);
    const currentUser = Moralis.User.current();
    console.log("current user:", currentUser)
    //query.equalTo("objectId",currentUser.objectId)
    //const results = await query.find();
    //var img_url = ""

    await query.get(currentUser.id).then((res) => {
      console.log("profile:", res)
      //res.set("minted", "true")
      //res.set("owner", currentUser)
      //res.set("token_id", parseInt(token_id))
      //res.set("list_price", listPrice)p
      //res.set("brand_image",imageURI)
      //res.save()
      //alert("successfully updated restaurant's brand image!")
      // The object was retrieved successfully.

      try {
        //console.log("IMAGE URL!:", res.attributes.brand_image)
        if (res.attributes.username.length > 0) {
          setUsername(res.attributes.username)
        }
        //if (res.attributes.user_type.length > 0) {
        //  console.log("GOLDEN USER TYPE:", res.attributes.user_type)
        //  //setUserType(res.attributes.user_type)
        //}


        //var img_url = res.attributes.brand_image
        ////setImageUrl(img_url)
        //if (img_url.length > 0) {
        //  //alert("HELLO?????")
        //  setImageUrl(res.attributes.brand_image)
        //  console.log("Golden Set Image Url:", ImageUrl)
//
        //  return res.attributes.brand_image
        //}

        var lichess_profile = res.attributes.lichess
        var chesscom_profile = res.attributes.chesscom
        var rating = res.attributes.rating
        if (lichess_profile.length > 0) {
          setLichess(lichess_profile)
        }
        if (chesscom_profile.length > 0) {
          setChesscom(chesscom_profile)
        }

        if (rating.length > 0) {
          setRating(rating)
        }



      }
      catch (e) {
        console.log("handling expected error:",e)
      }



    }, (error) => {
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    });

    //return ""
  }



  async function init() {
    await Moralis.enableWeb3()
    var chainId2 = await Moralis.getChainId()
    updateChainId(chainId2)

  }





  if (personal) {
    return (


      <div className="">
        <div className="flex flex-col justify-center items-center">
  
          <label className="w-32 h-32  bg-green-300 border-solid border-1 rounded-full border-black hover:bg-gray-300">
  
            <img className="h-32 w-32 object-fill rounded-full" width="" src={ImageUrl} />
  
  
            {/* <input type='file' class="hidden" onChange={onChange} /> */}
  
          </label>
  
          {/*                         <div className="flex flex-row">
              <h1 className="font-bold text-3xl pt-4">{username}</h1>
              <div className="div pt-5 pl-3">
                  <CheckCircleOutlined style={{ fontSize: '150%' }} />
              </div>
  
          </div> */}
  
          <h1 className="font-bold text-3xl pt-4">{username}</h1>
  
          {/* <Icon type="file-image" width="5em" height="5em" style={{ fontSize: '500%' }} theme="outlined" /> */}
  
          <div className="text-gray-500 font-medium ">{Moralis.User.current().attributes.ethAddress}</div>
          <div className="text-gray-500 font-medium ">Rating: {rating}</div>
          <div className="text-gray-500 font-medium ">Lichess Profile: <a href={lichess} rel="noopener noreferrer" target="_blank">{lichess}</a> </div>
          <div className="text-gray-500 font-medium ">Chess.com Profile: <a href={chesscom} rel="noopener noreferrer" target="_blank"></a></div>
          <div className="text-gray-500 font-medium">Joined March 2022</div>
  
          {/* <div className="text-gray-500 font-medium ">{walletAddress.slice(0, 6) + "..." + walletAddress.slice(walletAddress.length - 4, walletAddress.length)}</div>
          <div className="text-gray-500 font-medium">Joined January 2022</div> */}
        </div>
  
  
        <div className="py-8">
          <GameList requester_wallet_address={Moralis.User.current().attributes.ethAddress} />
        </div>
  
  
      </div>
  
  
  
  
    );
  }

  return (


    <div className="">
      <div className="flex flex-col justify-center items-center">

        <label className="w-32 h-32  bg-green-300 border-solid border-1 rounded-full border-black hover:bg-gray-300">

          <img className="h-32 w-32 object-fill rounded-full" width="" src={ImageUrl} />


          {/* <input type='file' class="hidden" onChange={onChange} /> */}

        </label>

        {/*                         <div className="flex flex-row">
            <h1 className="font-bold text-3xl pt-4">{username}</h1>
            <div className="div pt-5 pl-3">
                <CheckCircleOutlined style={{ fontSize: '150%' }} />
            </div>

        </div> */}

        <h1 className="font-bold text-3xl pt-4">{username}</h1>

        {/* <Icon type="file-image" width="5em" height="5em" style={{ fontSize: '500%' }} theme="outlined" /> */}

        <div className="text-gray-500 font-medium ">{wallet_addr}</div>
        <div className="text-gray-500 font-medium ">Rating: {rating}</div>
        <div className="text-gray-500 font-medium ">Lichess Profile: <a href={lichess} rel="noopener noreferrer" target="_blank">{lichess}</a> </div>
        <div className="text-gray-500 font-medium ">Chess.com Profile: <a href={chesscom} rel="noopener noreferrer" target="_blank"></a></div>
        <div className="text-gray-500 font-medium">Joined March 2022</div>

        {/* <div className="text-gray-500 font-medium ">{walletAddress.slice(0, 6) + "..." + walletAddress.slice(walletAddress.length - 4, walletAddress.length)}</div>
        <div className="text-gray-500 font-medium">Joined January 2022</div> */}
      </div>


      <div className="py-8">
        <GameList requester_wallet_address={wallet_addr} />
      </div>


    </div>




  );
}
