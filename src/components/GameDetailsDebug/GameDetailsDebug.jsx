import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
const Chessground = dynamic(() => import('react-chessground'), { ssr: false });
import 'react-chessground/dist/styles/chessground.css'
import Chess from '../Chess.js'
import { Card, Tooltip, Modal, Input, Alert, Spin, Button, Menu, Dropdown, Typography } from "antd";
import Wallet2 from 'components/GameDetailsDebug/Wallet2';


export default function GameDetails() {

    const [loadedGames, setLoadedGames] = useState(false);
    const [Games, setGames] = useState([]);
    const [loadedPosts, setLoadedPosts] = useState(false);
    const [Posts, setPosts] = useState([]);
    const { Moralis, enableWeb3 } = useMoralis();
    const [chainId, updateChainId] = useState(null)
    const router = useRouter()
    const game_id = "WCm1wSEqzngU0Nqq66C09SPM"
    const [ra, updatera] = useState('')
    const [fen, setFen] = useState('')
    const [formInput, updateFormInput] = useState({ post: '', curr_pgn: null, question: '', price: 0 })
    const [chess, setChess] = useState(new Chess())
    const [currentComment, setCurrentComment] = useState("")
    const [isPaymentModalVisible, setisPaymentModalVisible] = useState(false);


    // const [chess, setChess] = useState(new Chess())
    const [pendingMove, setPendingMove] = useState()
    const [selectVisible, setSelectVisible] = useState(false)
    // const [fen, setFen] = useState("")
    const [lastMove, setLastMove] = useState()
    const [premove, getPremoves] = useState()
    const [pgn, setPgn] = useState([])
    const [clickedIndex, setClickedIndex] = useState(-1);
    const [moveIndex, setMoveIndex] = useState(-1);
    // const [currentComment, setCurrentComment] = useState("")
    const [realFen, setRealFen] = useState("")
    const [realPgn, setRealPgn] = useState("")

    useEffect(() => {
        try {
            init()
        }
        catch (e) {
        }
        try {
            if (!loadedGames) {
                //const router2 = useRouter()
                //const game_id2 = router2.query.id
                log2(game_id).then(function (res) {
                    console.log("RES!:", res)
                    if (typeof res !== 'undefined') {
                        //if (res.length > 0) {
                        console.log("RESULT:", res)
                        setGames(res)
                        setLoadedGames(true)
                        const chess2 = new Chess()
                        chess2.load_pgn(res.attributes.pgn)
                        setChess(chess2)
                        console.log("STARTING FEN:", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
                        console.log("SETTING THE FEN:", chess2.fen())
                        console.log("pgn btw:", chess2.pgn())
                        setFen(chess2.fen())
                        setPgn(chess2.pgn().split(" "))


                        //setFen()
                        //}
                    }
                })
            } else {
                updatera('hh')
            }
        } catch (e) {

        }

        try {
            if (!loadedPosts) {
                //const router2 = useRouter()
                //const game_id2 = router2.query.id
                get_posts(game_id).then(function (res) {
                    console.log("RES!:", res)
                    if (typeof res !== 'undefined') {
                        if (res.length > 0) {
                            console.log("RESULT:", res)
                            setPosts(res)
                            setLoadedPosts(true)
                            //setFen()
                        }
                    }
                })
            } else {
                updatera('hh')
            }
        } catch (e) {

        }



    });

    async function get_posts(game_id) {
        const Posts = Moralis.Object.extend("Posts");
        const query = new Moralis.Query(Posts);
        query.equalTo("game_id", game_id);
        var res2 = await query.find()
        console.log("RESSS:", res2)

        if (typeof res2 !== 'undefined') {
            if (res2.length > 0) {
                var post_arr = []
                for (var i = 0; i < res2.length; i++) {
                    console.log("res2[i]:", res2[i])
                    var p = res2[i].attributes.post
                    var post_addr = res2[i].attributes.poster_wallet_address
                    let data = {
                        post: p,
                        poster_wallet_address: post_addr
                    }
                    post_arr.push(data)
                }
                return post_arr
            }
        }


        return []
    }

    async function log2(game_id) {
        //const { Moralis, enableWeb3 } = useMoralis();
        console.log("LOG2")
        const Games = Moralis.Object.extend("Game");
        const query = new Moralis.Query(Games);
        //await query.get(game_id).then((res) => {
        //    console.log("game:", res)        //    // The object was not retrieved successfully.
        //    // error is a Moralis.Error with an error code and message.
        //});

        var res2 = await query.get(game_id)
        console.log("RESSS:", res2)
        //console.log("res2:", res2)
        return res2;
    }

    async function init() {
        await Moralis.enableWeb3()
        var chainId2 = await Moralis.getChainId()
        updateChainId(chainId2)
    }


    async function make_post() {
        const Post = Moralis.Object.extend("Posts");
        //const query = new Moralis.Query(Game);
        const currentUser = Moralis.User.current();
        //query.equalTo("collection_name", formInput.CollectionName);

        const ann = new Post();
        ann.set("Poster", currentUser);
        //ann.set("pgn", chess.pgn());
        //ann.set("game_length", chess.moves().length)
        //ann.set("price", parseInt(formInput.price))
        ann.set("game_id", game_id)
        ann.set("post", formInput.post)
        //ann.set("fen", chess.fen());
        ann.set("chain_id", chainId);
        ann.set("poster_wallet_address", currentUser.attributes.ethAddress)
        //ann.set("CurrUser", currentUser);
        ann.save();
        //alert("successfull saved post!")
        let data = {
            post: formInput.post,
            poster_wallet_address: currentUser.attributes.ethAddress
        }
        var ps = Posts.slice()
        ps.push(data)
        setPosts(ps);
    }



    const onMove = (from, to) => {
        console.log("#1 Current chess turn!", chess.turn())
        console.log("on move!!!")
        const moves = chess.moves({ verbose: true })
        for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
            if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
                console.log("EVER HERE??")
                setPendingMove([from, to])
                setSelectVisible(true)
                return
            }
        }

        console.log("from:", from)
        console.log("to:", to)

        if (chess.move({ from, to, promotion: "x" })) {
            console.log("Current chess turn!", chess.turn())
            console.log("chess moves:", moves)
            setFen(chess.fen())
            setLastMove([from, to])

            //setTimeout(onMove, 1000)
            //setTimeout(randomMove, 1000)
            setTimeout(onMove2, 0)
            console.log("NEW chess turn!", chess.turn())

        }
        //console.log("PGN:", chess.pgn())
        //var disp_pgn = chess.pgn().split(" ")
        //console.log("disp_pgn:",disp_pgn)
        //var real_disp = []
        //for (let i = 0; i < disp_pgn.length; i++) {
        //  if (disp_pgn[i].indexOf('{') > -1) {
        //    //console.log("rip")
        //  } else {
        //    real_disp.push(disp_pgn[i])
        //  }
        //}
        //setPgn(real_disp)

        var rancid_copy = new Chess()
        rancid_copy.load_pgn(chess.pgn())
        rancid_copy.delete_comments()
        setPgn(rancid_copy.pgn().split(" "))

        setRealPgn(chess.pgn())

    }

    const onMove2 = (from, to) => {
        console.log("HERE IN ONMOVE2!!!!")
        console.log("#1 Current chess turn!", chess.turn())
        console.log("on move!!!")
        const moves = chess.moves({ verbose: true })
        for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
            if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
                console.log("EVER HERE??")
                setPendingMove([from, to])
                setSelectVisible(true)
                return
            }
        }

        console.log("from:", from)
        console.log("to:", to)

        if (chess.move({ from, to, promotion: "x" })) {
            console.log("Current chess turn!", chess.turn())
            console.log("chess moves:", moves)
            setFen(chess.fen())
            setLastMove([from, to])

            //setTimeout(onMove, 1000)
            //setTimeout(randomMove, 1000)
            console.log("NEW chess turn!", chess.turn())

        }

        //console.log("PGN:", chess.pgn())
        //var disp_pgn = chess.pgn().split(" ")
        //var real_disp = []
        //for (let i = 0; i < disp_pgn.length; i++) {
        //  if (disp_pgn[i].indexOf('{') > -1) {
        //    //console.log("rip")
        //  } else {
        //    real_disp.push(disp_pgn[i])
        //  }
        //}
        //setPgn(real_disp)
        var rancid_copy = new Chess()
        rancid_copy.load_pgn(chess.pgn())
        rancid_copy.delete_comments()
        setPgn(rancid_copy.pgn().split(" "))
        //setPgn(chess.pgn().split(" "))
        setRealPgn(chess.pgn())

    }

    //User wants to move a piece to somewhere --> where can they move it?
    const calcMovable = () => {
        //console.log("UHHH IS THIS BEING CALCULATED?")
        //console.log("current turn:", turnColor())
        const dests = new Map()
        chess.SQUARES.forEach(s => {
            const ms = chess.moves({ square: s, verbose: true })
            if (ms.length) dests.set(s, ms.map(m => m.to))
        })
        //console.log("dests:",dests)
        return {
            free: false,
            dests,
            //Start out with white to move, for every piece, show squares
            //they can move to. When they actually move, turn gets set to white!
            //Need turnColor function to keep track of whose turn it as after each move!
            color: turnColor()
        }
    }

    const turnColor = () => {
        return chess.turn() === "w" ? "white" : "black"
    }

    function log(pg, ind) {
        //console.log("move CLICKED!", pg)
        //console.log("Index", ind)
        //console.log("pgn:", pgn)
        //console.log("")
        setClickedIndex(ind)
        var detect = ind % 3
        var add = 0
        if (detect == 0) {
            console.log("nothing happening here!")
            return
        }
        if (detect == 2) {
            add += 1
        }
        var correct_index = 2 * Math.floor(ind / 3) + add
        //console.log("correct index!", correct_index)
        setMoveIndex(correct_index)
        //var clean_pgn = []
        //for (var i = 0; i < pgn.length; i++) {
        //  if (pgn[i].indexOf('.') > -1) {
        //    //
        //  } else {
        //    clean_pgn.push(pgn[i])
        //  }
        //}
        //console.log("clean pgn:",clean_pgn)
        var moves = chess.history({ verbose: true });
        //console.log("MOVES!:", moves)

        var tmp = new Chess();
        for (var i = 0; i < correct_index; i++) {
            //console.log("moves[i]:", moves[i])
            tmp.move(moves[i]);
        }
        //var correct_index_fen = tmp.fen();
        tmp.move(moves[correct_index]);
        //setCurrentComment(tmp.get_comment())
        //console.log("tmp fen:", tmp.fen())
        //console.log("this move just played from:", moves[correct_index].from)
        //console.log("this move just played to:", moves[correct_index].to)
        //var from = moves[correct_index].from
        //var to = moves[correct_index].to
        //future.push(tmp.fen());


        //setChess(tmp)
        setFen(tmp.fen())
        //setLastMove([from, to])
        console.log("chess comments:", chess.get_comments())
        var comments = chess.get_comments()
        for (var i = 0; i < comments.length; i++) {
            if (tmp.fen() == comments[i].fen) {
                //alert("EQUAL:")

                setCurrentComment(comments[i].comment)
                break
            } else {
                setCurrentComment("")
            }
        }

        console.log("form input:", formInput.comment)

    }


    async function pay(wallet_addr, index) {
        console.log("HERERERE")
        setisPaymentModalVisible(true)
    }

    function log_boys() {
        console.log("PGN:", pgn)
        console.log("FEN:", fen)
    }


    if (!loadedGames) {
        return (
            <div>
                <h1>LOADING Game Details Page with id: {game_id}</h1>
            </div>
        )
    } else {
        return (
            <div>
                {/* <h1>Game Details Page with id: {game_id}</h1>
                <h1>Game Details Page with Requester: {Games.attributes.requester_wallet_address}</h1>
                <h1>Game Details Page with FEN: {Games.attributes.fen}</h1>
                <h1>Game Details Page with PGN: {Games.attributes.pgn}</h1>
                <h1>Game Details Page with Question: {Games.attributes.questions}</h1>
                <h1>Game Details Page with Max Price Willing: {Games.attributes.price}</h1> */}
                <div className="block mb-2 text-sm font-bold pt-3">Requester: <span className="font-medium">{Games.attributes.requester_wallet_address}</span></div>
                <div className="block mb-2 text-sm font-bold pt-3">Max Price willing to pay: <span className="font-medium"> {Games.attributes.price} (ETH)</span></div>
                <div className="block mb-2 text-sm font-bold pt-3">General Question(s): <span className="font-medium">{Games.attributes.questions}</span></div>


                {/* <Chessground
                    width="38vw"
                    height="38vw"
                    fen={Games.attributes.fen}
                    style={{ margin: "auto", }}
                /> */}

                <Modal
                    visible={isPaymentModalVisible}
                    footer={null}
                    onCancel={() =>

                        setisPaymentModalVisible(false)}
                // bodyStyle={{
                //     padding: "15px",
                //     fontSize: "17px",
                //     fontWeight: "500",
                // }}
                // style={{ fontSize: "16px", fontWeight: "500" }}
                // width="400px"
                >
                    {/* Comment
                    <textarea type="text" id="username-success"
                        className=" mt-3 border h-48 text-sm rounded-lg  block w-full p-3 dark:bg-green-100 dark:border-green-400"
                        placeholder="Example: Ng5 was an okay move, but you needed to continue developing all your pieces before you start the attack."
                        onChange={e => updateFormInput({ ...formInput, comment: e.target.value })}

                    />

                    <Button
                        size="large"
                        type="primary"
                        style={{

                            width: "100%",
                            marginTop: "35px",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        onClick={() => {
                            handleRightClick()

                            //logout();
                            //openInNewTab('https://metamask.io/download/')
                            //setisWalletModalVisible(false);
                        }}
                    >
                        Add Comment
                    </Button> */}
                    <Wallet2 />


                </Modal>


                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex justify-center  border-2 border-gray-300 rounded-xl p-6 bg-gray-100 break-normal">
                            <div className="col-span-1">{currentComment.length == 0 ? <div>No PGN comments for this position</div> : <div> PGN Comments: {currentComment}</div>}</div>
                        </div>

                        <div className="justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 bg-gray-100 col-span-2">
                            <Chessground
                                width="38vw"
                                height="38vw"
                                onMove={onMove}
                                // onPremove={onPreMove}
                                movable={calcMovable()}
                                turnColor={turnColor()}
                                lastMove={lastMove}
                                // premovable={calcPreMovable()}
                                fen={fen}

                                style={{ margin: "auto" }}
                            />
                        </div>

                        {/* <div class="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 bg-gray-100">3</div> */}

                        <div className=' border-2 border-gray-300 rounded-xl'>
                            <div className="grid grid-cols-3 p-2">
                                {
                                    pgn.map((pg, index) => (
                                        <button key={index} className='overflow-auto hover:bg-green-300 mr-1' onClick={() => log(pg, index)} onContextMenu={() => log(pg, index)}> {pg}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div ></div>

                        {/* <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center col-span-2">PGN: {realPgn} </div>
            <div ></div>
            <div ></div> */}
                        <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center col-span-2">PGN: {Games.attributes.pgn} </div>


                    </div>
                </div>

                {/* <button class="font-bold py-2 px-4 w-full bg-purple-400 text-lg text-white shadow-md rounded-lg " onClick={log_boys}>TEST </button> */}



                <div>

                    <section className="rounded-b-lg  mt-16 ">


                        {/* <form action="/" accept-charset="UTF-8" method="post"><input type="hidden" /> */}
                        <textarea className="w-full shadow-inner p-4 border-0 mb-4 rounded-lg focus:shadow-outline text-2xl p-8"
                            placeholder="Ask questions here."
                            cols="6" rows="6" id="comment_content" spellCheck="false"
                            onChange={e => updateFormInput({ ...formInput, post: e.target.value })}
                        ></textarea>
                        <button className="font-bold py-2 px-4 w-full bg-purple-400 text-lg text-white shadow-md rounded-lg " onClick={make_post}>Comment </button>
                        {/* </form> */}

                        <div id="task-comments" className="pt-4">
                            {Posts &&
                                Posts.map((post, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3  flex flex-col justify-center items-center md:items-start shadow-lg mb-4">
                                        <div className="flex flex-row justify-center mr-2">

                                            <img alt="avatar" width="48" height="48" className="rounded-full w-10 h-10 mr-4 shadow-lg mb-4" src="https://cdn1.iconfinder.com/data/icons/technology-devices-2/100/Profile-512.png" />
                                            <h3 className="text-purple-600 font-semibold text-lg text-center md:text-left ">{post.poster_wallet_address}</h3>
                                        </div>

                                        <p className="text-gray-600 text-lg text-center md:text-left ">{post.post} </p>

                                        <button className="font-bold py-2 px-4 flex justify-center items-center bg-purple-400 text-lg text-white shadow-md rounded-lg " onClick={() => pay(post.poster_wallet_address, index)}>Pay</button>

                                        {/* <div className="px-4 h-4">
                                            <button class="font-bold py-2 px-4 w-full bg-purple-400 text-lg text-white shadow-md rounded-lg " onClick={() => pay(post.poster_wallet_address, index)}>Pay</button>
                                        </div> */}
                                    </div>
                                ))}


                        </div>
                    </section>

                </div>

            </div>
        )
    }

}

//export default gameDetails;