import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
//const Chessground = dynamic(() => import('react-chessground'), { ssr: false });
import 'react-chessground/dist/styles/chessground.css'
//import Chess from './Chess'
//import { Card, Tooltip, Modal, Input, Alert, Spin, Button, Menu, Dropdown, Typography } from "antd";
//import Wallet2 from 'components/GameDetailsDebug/Wallet2';
import Profile2 from "components/Profile"

export default function GameDetails() {

    const { Moralis, enableWeb3 } = useMoralis();
    const [chainId, updateChainId] = useState(null)
    const router = useRouter()
    const profile_id = router.query.id
    const [ra, updatera] = useState('')
    const [fen, setFen] = useState('')
    const [formInput, updateFormInput] = useState({ post: '', curr_pgn: null, question: '', price: 0 })
    //const [chess, setChess] = useState(Chess())
    const [currentComment, setCurrentComment] = useState("")
    const [isPaymentModalVisible, setisPaymentModalVisible] = useState(false);




    return (
        <div>
            {/* <h1>Game Details Page with id: {game_id}</h1>
                <h1>Game Details Page with Requester: {Games.attributes.requester_wallet_address}</h1>
                <h1>Game Details Page with FEN: {Games.attributes.fen}</h1>
                <h1>Game Details Page with PGN: {Games.attributes.pgn}</h1>
                <h1>Game Details Page with Question: {Games.attributes.questions}</h1>
                <h1>Game Details Page with Max Price Willing: {Games.attributes.price}</h1> */}

            <h1>PROFILE Details Page with ID: {profile_id}</h1>
            <Profile2 wallet_addr={profile_id} />;


            <div>

            </div>

        </div>
    )


}

//export default gameDetails;