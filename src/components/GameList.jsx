//import { Card, Timeline, Typography } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import dynamic from 'next/dynamic';
//import Chess from "./Chess";
import { Card, Tooltip, Modal, Menu, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
//import Chess from 'pages/Chess.js'
const Chessground = dynamic(() => import('react-chessground'), { ssr: false });
import 'react-chessground/dist/styles/chessground.css'
import Link from "next/link";
import Chess from '../components/Chess.js'


const styles2 = {
    NFTs: {
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "start",
        justifyContent: "flex-start",
        margin: "0 auto",
        maxWidth: "1000px",
        gap: "10px",
    },
};

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

const { Meta } = Card;

export default function QuickStart({ isServerInfo, requester_wallet_address }) {
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
    const [formInput, updateFormInput] = useState({ comment: '' })
    const [chainId, updateChainId] = useState(null)
    const [GameRequests, setGameRequests] = useState([1, 2, 3]);
    const [Games, setGames] = useState([]);
    const [loadedGames, setLoadedGames] = useState(false);

    { }

    //Initialize Moralis web3 instance to get current chain Id
    useEffect(() => {
        try {
            init()




        }
        catch (e) {
        }
        try {
            if (!loadedGames) {
                console.log("CURRENT USER LOGGED IN!")
                //const currentUser = Moralis.User.current();
                //console.log("CURR USER:", currentUser)
                //console.log("CURR USER:", currentUser.attributes.ethAddress)
                getGames().then(function (res) {
                    //console.log("RES!:", res)
                    if (typeof res !== 'undefined') {
                        if (res.length > 0) {

                            for (var i = 0; i < res.length; i++) {

                                //console.log("i:",i)
                                //console.log("HELLO:",res[i].attributes.Requester)
                                try {
                                    //console.log("HELLO:",res[i].attributes.Requester.attributes.ethAddress)
                                }
                                catch (e) {

                                }

                            }
                            setGames(res)
                            setLoadedGames(true)

                        }
                    }
                })
            }
        } catch (e) {

        }



    });

    async function init() {
        await Moralis.enableWeb3()
        var chainId2 = await Moralis.getChainId()
        updateChainId(chainId2)
    }

    async function getGames() {
        const Games = Moralis.Object.extend("Game");
        const query = new Moralis.Query(Games);
        if (requester_wallet_address !== null) {
            query.equalTo("requester_wallet_address", requester_wallet_address)
        }
        const results = await query.find();
        console.log("results:", results)
        var games_arr = []
        for (var i = 0; i < results.length; i++) {
            games_arr.push(results[i])
        }
        console.log("games_arr:", games_arr)
        return games_arr
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



    const onPreMove = (from, to) => {
        console.log("onPreMove!")
        const moves = chess.moves({ verbose: true })
        for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
            if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {

                setPendingMove([from, to])
                setSelectVisible(true)
                return
            }
        }

        console.log("from:", from)
        console.log("to:", to)

        if (chess.move({ from, to, promotion: "x" })) {
            console.log("chess moves:", moves)
            setFen(chess.fen())
            setLastMove([from, to])
            setTimeout(randomMove, 1000)
        }
    }

    const randomMove = () => {
        const moves = chess.moves({ verbose: true })
        const move = moves[Math.floor(Math.random() * moves.length)]
        if (moves.length > 0) {
            chess.move(move.san)
            setFen(chess.fen())
            setLastMove([move.from, move.to])
        }
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

    const calcPreMovable = (orig, dest) => {
        //console.log("hello!!!")
        //console.log("current:", orig)
        return {
            enabled: true,
            //set:
        }
    }

    const turnColor = () => {
        return chess.turn() === "w" ? "white" : "black"
    }

    function click() {
        var addMenu = new nw.Menu();
        addMenu.append(new nw.MenuItem({
            label: 'doSomething',
            click: function () {
                // doSomething
            }
        }));
    }

    // Update the chess engine and board based on the most recent move
    const playOtherSide = (cg, chess) => {
        return (orig, dest) => {
            // Update chess.js
            // Note: we don't check the return value here which would tell
            // us if this is a legal move.  That's because we only allowed legal moves by setting "dests"
            // on the board.
            chess.move({ from: orig, to: dest });

            cg.set({
                // I'm not sure what this does! You can comment it out and not much changes
                // turnColor: toColor(chess),

                // this highlights the checked king in red
                check: chess.in_check(),

                movable: {
                    // Only allow moves by whoevers turn it is
                    color: toColor(chess),

                    // Only allow legal moves
                    dests: toDests(chess)
                }
            });
        };
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





    function handleClick(e) {
        if (e.type === 'click') {
            console.log('Left click');
        } else if (e.type === 'contextmenu') {
            console.log('Right click');
        }
    }


    function handleRightClick() {
        var moves = chess.history({ verbose: true });
        console.log("MOVES!:", moves)
        var tmp = new Chess();


        console.log("current comments:", chess.get_comments())
        var comments = chess.get_comments()
        //var previous = 3;

        console.log("move index:", moveIndex)

        for (var i = 0; i < moveIndex; i++) {
            console.log("i:", i)

            //console.log("moves[i]:", moves[i])
            tmp.move(moves[i]);

            //console.log("tmp.fen:",tmp.fen())
            //console.log("comments[0].fen",comments[0].fen)

            for (var j = 0; j < comments.length; j++) {
                console.log("")
                //console.log("tmp fen:", tmp.fen())
                //console.log("comments fen:", comments[j].fen)
                if (tmp.fen() == comments[j].fen) {
                    tmp.set_comment(comments[j].comment)
                    //alert("EQUAL1!")
                    break
                }
            }
        }
        //var moveIndex_fen = tmp.fen();
        tmp.move(moves[moveIndex]);
        //console.log("tmp.fen:",tmp.fen())
        //console.log("comments[0].fen",comments[0].fen)
        //if (tmp.fen() == comments[0].fen) {
        //  //alert("EQUAL!")
        //}
        //tmp.set_comment("TEST COMMENT")
        tmp.set_comment(formInput.comment)
        setCurrentComment(tmp.get_comment())

        console.log("New pgn before copying!:", tmp.pgn())

        for (var i = moveIndex + 1; i < moves.length; i++) {
            //alert("IS THIS EVER RAN LOL?")
            console.log("i:", i)
            tmp.move(moves[i]);
            for (var j = 0; j < comments.length; j++) {
                if (tmp.fen() == comments[j].fen) {
                    tmp.set_comment(comments[j].comment)
                    //alert("EQUAL1!")
                }
            }
        }




        console.log("NEW PGN:", tmp.pgn())
        setChess(tmp)
        //setPgn(tmp.pgn().split(" "))
        //const target = { comment: ''}
        //const source = formInput
        //const newObj = Object.assign({}, target, source);
        ////formInput.comment = ''
        //updateFormInput(newObj)

        updateFormInput({ comment: '' })

        setisWalletModalVisible(false)
    }


    function hello() {
        console.log("Currently clicked index!", clickedIndex)
        console.log("Correct move index!", moveIndex)
    }

    function check() {
        console.log("Currently clicked index!", clickedIndex)
        console.log("Correct move index!", moveIndex)

        var comments = chess.get_comments()
        for (var i = 0; i < comments.length; i++) {
            if (chess.fen() == comments[i].fen) {
                //alert("EQUAL:")
                return comments[i].comment
            }
        }

        return false
    }

    function handleCommentAdd() {
        console.log("FORM INPUT BTW:", formInput)
        setisWalletModalVisible(true)
    }

    //https://github.com/ant-design/ant-design/blob/master/components/dropdown/demo/context-menu.md
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={handleCommentAdd}>Add comment</Menu.Item>
            <Menu.Item key="2">Delete Comment</Menu.Item>
        </Menu>
    );






    async function make_annotation_request() {
        const Game = Moralis.Object.extend("Game");
        //const query = new Moralis.Query(Game);
        const currentUser = Moralis.User.current();
        //query.equalTo("collection_name", formInput.CollectionName);

        const ann = new Game();
        ann.set("Requester", currentUser);
        ann.set("pgn", chess.pgn());
        ann.set("status", "pending")
        ann.set("chain_id", chainId);
        //ann.set("CurrUser", currentUser);
        ann.save();
        alert("successfull saved Game!")

    }















    async function log2() {
        //console.log("clicked")
        ////console.log("THE CHESS PGN IS:", chess.pgn())
        //const Games = Moralis.Object.extend("Game");
        //const query = new Moralis.Query(Games);
        //const results = await query.find();
        //console.log("results:",results)
        //var games_arr = []
        //for (var i = 0; i < results.length; i++) {
        //    games_arr.push(results[i])
        //}
        //console.log("games_arr:",games_arr)
        //setGames(games_arr)
        ////setGameRequests(games_arr)

        const Games = Moralis.Object.extend("Game");
        const query = new Moralis.Query(Games);
        const id = "0vJ3vMZnftqErq6B76OzBSbC"
        //const currentUser = Moralis.User.current();
        await query.get(id).then((res) => {
            console.log("game:", res)

        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });

        var res2 = await query.get(id)
        console.log("res2:", res2)


    }


    function deb() {
        console.log("REQUESTER WALLET ADDRESS!:", requester_wallet_address)
        console.log("REQUESTER WALLET ADDRESS!:", requester_wallet_address === null)
        const currentUser = Moralis.User.current().attributes.ethAddress;
        console.log("", currentUser)
    }


    if (loadedGames) {
        return (
            <div style={{ display: "flex", gap: "10px" }}>
                <div>
                    <div style={styles2.NFTs}>
                        {Games &&
                            Games.map((nft, index) => (
                                <Card
                                    hoverable
                                    actions={[
                                        <Tooltip key={index} title="See Game Review Request">
                                            <Link href={'/games/' + nft.id} key={index} className='pt-15'>
                                                <ShoppingCartOutlined />
                                            </Link>

                                        </Tooltip>,

                                    ]}
                                    style={{ width: 240, border: "2px solid #e7eaf3" }}
                                    // cover={
                                    //     //  <img
                                    //     //      preview={false}
                                    //     //      src={nft?.image || "error"}
                                    //     //      fallback="data:image/png;base64,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"
                                    //     //      alt=""
                                    //     //      style={{ height: "300px" }}
                                    //     //  />
                                    //     <Chessground
                                    //         width="150px"
                                    //         height="150px"
                                    //         fen={nft.attributes.fen}
                                    //         style={{ margin: "auto" , }}
                                    //     />
                                    // }
                                    key={index}
                                >
                                    {/* <div className="div pb-1">{nft.attributes.pgn}</div> */}
                                    {/* <div className="div pb-1">{nft}</div> */}
                                    <Chessground
                                        width="150px"
                                        height="150px"
                                        fen={nft.attributes.fen}
                                        style={{ margin: "auto", }}
                                    />
                                    <div className="pt-10">
                                        <div><span className="div pb-1 font-bold underline">Requester</span><span>:</span><span className="pl-1">{`${nft.attributes.requester_wallet_address.slice(0, 8)}...`}</span></div>
                                        <div><span className="div pb-1 font-bold underline">Payment</span><span>:</span><span className="pl-1">{`${nft.attributes.price} MATIC`}</span></div>
                                        <div><span className="div pb-1 font-bold underline">Game Length</span><span>:</span><span className="pl-1">{`${nft.attributes.game_length} moves`}</span></div>

                                        {/* <div className="div pb-1 font-bold underline">{`Number of Moves: ${nft.attributes.game_length}`}</div>
                                    <div className="div pb-1 font-bold underline">{`Requester: ${nft.attributes.Requester.attributes.accounts[0].slice(0,8)}...`}</div>
                                    <div className="div pb-1 font-bold underline">{`Price willing to pay: ${nft.attributes.price} MATIC`}</div> */}

                                        {/* <Meta title={`Requester: ${nft.attributes.Requester.attributes.accounts[0]}`} description={`Price willing to pay: ${nft.attributes.price} MATIC`} /> */}
                                    </div>
                                    {/* <Link href={'/games/' + nft.id} key={index} className='pt-15'>
                                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full pt-15"  >See game details</button>
                                    </Link> */}

                                </Card>
                            ))}


                    </div>

                </div>
                {/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={deb} >MORALIS Q</button> */}
            </div>

        )
    } else {
        return (
            <div className="flex flex-col justify-center items-center">
                <div>No Game Annotation Requests found!</div>
            </div>


        )
    }





}
