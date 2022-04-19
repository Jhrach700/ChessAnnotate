import Profile2 from "components/prof_fix"
import React, { useState  } from "react";
function Profile() {
	//const { Moralis, enableWeb3 } = useMoralis();
	//const [addr, setAddr] = useState("0xb9c612c65e736bba5bb0ba3c52d7b296d4792bc9")
	//try {
	//	
	//	const addr2 = Moralis.User.current().attributes.ethAddress
	//	setAddr(addr2)
	//} catch(e) {
	//	//lol
	//	//const addr = "0xb9c612c65e736bba5bb0ba3c52d7b296d4792bc9";
	//}

	return <Profile2 personal = {true} />;
}

export default Profile;
