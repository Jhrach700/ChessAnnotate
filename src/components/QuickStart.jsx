//import { Card, Timeline, Typography } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import dynamic from 'next/dynamic';
//import Chess from "./Chess";
import { Card, Tooltip, Modal, Input, Alert, Spin, Button, Menu, Dropdown, Typography } from "antd";
import 'antd/dist/antd.css';
//import Chess from 'pages/Chess.js'
import Chess from '../components/Chess.js'
const Chessground = dynamic(() => import('react-chessground'), { ssr: false });
import 'react-chessground/dist/styles/chessground.css'


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

export default function QuickStart({ isServerInfo }) {
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
  const [formInput, updateFormInput] = useState({ comment: '', curr_pgn: null, question: '' , price: 0})
  const [chainId, updateChainId] = useState(null)
  const [bottomPgn, setBottomPgn] = useState("")

  //Initialize Moralis web3 instance to get current chain Id
  useEffect(() => {
    init()
  });

  async function init() {
    await Moralis.enableWeb3()
    var chainId2 = await Moralis.getChainId()
    updateChainId(chainId2)
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
    setBottomPgn(chess.pgn())
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
    setBottomPgn(chess.pgn())

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
    console.log("TEMPORARY PGN:",tmp.pgn())
    setBottomPgn(tmp.pgn())
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



  function pgn_log() {
    console.log("THE CHESS PGN IS:", chess.pgn())
  }


  async function make_annotation_request() {
    const Game = Moralis.Object.extend("Game");
    //const query = new Moralis.Query(Game);
    const currentUser = Moralis.User.current();
    //query.equalTo("collection_name", formInput.CollectionName);

    const ann = new Game();
    ann.set("Requester", currentUser);
    ann.set("pgn", chess.pgn());
    ann.set("game_length", chess.moves().length)
    ann.set("price", parseInt(formInput.price))
    ann.set("questions", formInput.question)
    ann.set("fen", chess.fen());
    ann.set("status", "pending")
    ann.set("chain_id", chainId);
    //ann.set("CurrUser", currentUser);
    ann.save();
    alert("successfull saved Game!")

  }














  function import_pgn() {
    var pgn = formInput.curr_pgn
    console.log("PGN TO LOAD:", pgn)

    const chess2 = new Chess()
    chess2.load_pgn(pgn)
    setChess(chess2)
    //console.log("STARTING FEN:", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    //console.log("SETTING THE FEN:", chess2.fen())
    //console.log("pgn btw:", chess2.pgn())
    setFen(chess2.fen())
    setPgn(chess2.pgn().split(" "))
    setRealPgn(chess2.pgn())
    setBottomPgn(chess2.pgn())


    //chess.load_pgn(pgn)
    //setFen(chess.fen())



  }



  return (


    <div>

      <div>
        {/* <div className='flex flex-row'>
          <Dropdown overlay={menu} trigger={['contextMenu']} className='flex flex-row'>
            <div className="grid grid-cols-3">
              {
                pgn.map((pg, index) => (
                  <button key={index} className='flex flex-row hover:bg-green-300 mr-1' onClick={() => log(pg, index)} onContextMenu={() => log(pg, index)}> {pg}
                  </button>
                ))}
            </div>
          </Dropdown>
        </div> */}

        {/* <div className="some-container">
          {
            (() => {
              if (chess.get_comments().length == 0)
                //alert("HERE")
                //var commment = check()

                return <div> NO Comments Detected:</div>
              else {
                //alert("HERE")
                var cm = check()
                console.log("CURRENT COMMENT:", currentComment)
                return <div> COMMENTS  DETECTED: {currentComment}</div>
              }

            })()
          }
        </div> */}

        {/* <div class='pt-7'>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">Back!</button>
        </div> */}

        <Modal
          visible={isWalletModalVisible}
          footer={null}
          onCancel={() =>

            setisWalletModalVisible(false)}
          bodyStyle={{
            padding: "15px",
            fontSize: "17px",
            fontWeight: "500",
          }}
          style={{ fontSize: "16px", fontWeight: "500" }}
          width="400px"
        >
          Comment
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
          </Button>


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
                //onPremove={onPreMove}
                movable={calcMovable()}
                turnColor={turnColor()}
                lastMove={lastMove}
                premovable={calcPreMovable()}
                fen={fen}
                style={{ margin: "auto" }}
              />
            </div>

            {/* <div class="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 bg-gray-100">3</div> */}

            <Dropdown overlay={menu} trigger={['contextMenu']} className=' border-2 border-gray-300 rounded-xl'>
              <div className="grid grid-cols-3 p-2">
                {
                  pgn.map((pg, index) => (
                    <button key={index} className='overflow-auto hover:bg-green-300 mr-1' onClick={() => log(pg, index)} onContextMenu={() => log(pg, index)}> {pg}
                    </button>
                  ))}
              </div>
            </Dropdown>

            <div ></div>

            <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center col-span-2">FEN: {chess.fen()}</div>
            <div ></div>
            <div ></div>
            {/* <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center col-span-2">PGN: {realPgn} </div>
            <div ></div>
            <div ></div> */}
            <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center col-span-2">PGN: {bottomPgn} </div>
            <div></div>
            <div></div>
            {/* <textarea name="description" value={formInput}
              placeholder="Example: Ng5 was an okay move, but you needed to continue developing all your pieces before you start the attack."
              onChange={e => updateFormInput({ ...formInput, comment: e.target.value })}

              className=" mt-3 border h-48 text-sm rounded-lg block w-full p-3 dark:bg-green-100 dark:border-green-400 justify-center items-center col-span-2">
              PGN: {realPgn} </textarea> */}

            <textarea type="text" id="username-success"
              className=" mt-3 border h-12 text-sm rounded-lg block w-full p-3 dark:bg-green-100 dark:border-green-400 justify-center items-center col-span-2"
              placeholder="Import PGN here!"
              onChange={e => updateFormInput({ ...formInput, curr_pgn: e.target.value })}
            />
            <div ></div>
            <div ></div>
            <div className='pt-2 col-span-2 flex justify-center items-center'>
              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => import_pgn()} >Import PGN</button>
            </div>
            <div ></div>
            <div ></div>
            {/* <textarea type="text" id="username-success"
              className=" mt-3 border h-24 text-sm rounded-lg block w-full p-3 dark:bg-green-100 dark:border-green-400 justify-center items-center col-span-2"
              placeholder="Insert any general questions you have about the game (Note if you have questions about specific moves, you can also put them directly
                as comments in the PGN)"
              onChange={e => updateFormInput({ ...formInput, question: e.target.value })}
            />
            <div ></div>
            <div ></div>

            <input type="text" id="username-success" class="flex justify-center items-center col-span-2 border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" 
            placeholder="Maximum Price you'd be willing to pay (in MATIC)"
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })} required /> */}
            {/* <div ></div>
            <div ></div>

            <div className='pt-2 col-span-2 flex justify-center items-center'>
              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={make_annotation_request} >Annotation Request</button>
            </div> */}


          </div>
        </div>



        {/* <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center">FEN: {chess.fen()}</div>
        <div className="block flex mb-2 text-sm font-medium pt-3 justify-center items-center">PGN: {realPgn} </div> */}

        {/* <div className='pt-7'>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={make_annotation_request} >Annotation Request</button>
        </div> */}

      </div>
    </div>
  );
}
