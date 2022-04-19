import React from "react";
import { useRouter } from "next/router";
import { Menu } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
function MenuItems() {
	const { pathname } = useRouter();
	const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
		useMoralis();
	const [UserType, setUserType] = useState("explore");
	const [loading, setLoading] = useState("loading");

	//Hook when app starts enables Web3 and retrieves the user type (either normal client, restaurant, or unauthenticated user)
	useEffect(() => {
		console.log("HERE IN USEEFFECT!")
		if (isAuthenticated && !isWeb3EnableLoading) {
			console.log("ENABLING WEB3?")
			enableWeb3();
			request()
		}

	}, [isAuthenticated, isWeb3Enabled]);
	//This queries the moralis database to get the current user type
	const request = async () => {
		//Quick fix: I put this in a try catch since sometimes there are parse.initialize errors 
		//(this happens when moralis doesn't get initialized fast enough with the useMoralis() and enableWeb3() calls)
		//There's probably a cleaner solution, but for now this works 
		try {
			const User = Moralis.Object.extend("User");
			const query = new Moralis.Query(User);
			const currentUser = Moralis.User.current();
			console.log("current user:", currentUser)
			await query.get(currentUser.id).then((res) => {
				console.log("profile:", res)
				//FIX LOADING LOGIC!!!!!!
				if (typeof res.attributes.user_type !== 'undefined') {
					console.log("GOLDEN USER TYPE:", res.attributes.user_type)
					setUserType(res.attributes.user_type)
					setLoading("loaded")
				} else {
					console.log("HERE GOLD!!!!")
					setUserType("student")
					setLoading("loaded")
				}
			}, (error) => {
				// The object was not retrieved successfully.
				// error is a Moralis.Error with an error code and message.
			});
		}
		catch (e) {
		}

	}




	if (!isAuthenticated || loading == "loading") {
		return (
			<Menu
				theme='light'
				mode='horizontal'
				style={{
					display: "flex",
					fontSize: "17px",
					fontWeight: "500",
					width: "100%",
					justifyContent: "center",
				}}
			// defaultSelectedKeys={[pathname]}
			>
				<Menu.Item key='/quickstart'>
					<Link href='/quickstart'>
						<a>🚀 Analysis</a>
					</Link>
				</Menu.Item>

				{/* <Menu.Item key='/1inch'>
					<Link href='/1inch'>
						<a>🏦 Dex</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='onramp'>
					<Link href='/onramp'>
						<a>💵 Fiat</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/erc20balance'>
					<Link href='/erc20balance'>
						<a>💰 Balances</a>
					</Link>
				</Menu.Item> */}
				{/* <Menu.Item key='/erc20transfers'>
					<Link href='/erc20transfers'>
						<a>💸 Transfers</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/nftBalance'>
					<Link href='/nftBalance'>
						<a>🖼 NFTs</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/contract'>
					<Link href='/contract'>
						<a>📄 Contract</a>
					</Link>
				</Menu.Item> */}


				{/* <Menu.Item key='/annotationrequest'>
					<Link href='/annotationrequest'>
						<a>📄 Annotation Request</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/gamedetailsdebug'>
					<Link href='/gamedetailsdebug'>
						<a>📄 Debug</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/games'>
					<Link href='/games'>
						<a>📄 Games</a>
					</Link>
				</Menu.Item> */}

				<Menu.Item key='/games'>
					<Link href='/games'>
						<a>📄 Games</a>
					</Link>
				</Menu.Item>

				{/* <Menu.Item key='/profile'>
					<Link href='/profile'>
						<a>📑 Profile</a>
					</Link>
				</Menu.Item>
	
				<Menu.Item key='/editprofile'>
					<Link href='/editprofile'>
						<a>✏️ Edit Profile</a>
					</Link>
				</Menu.Item> */}

				<Menu.Item key='/coachverification'>
					<Link href='/coachverification'>
						<a>✔️ Coach Verification</a>
					</Link>
				</Menu.Item>

				{/* <Menu.Item key='/ninjas'>
					<Link href='/ninjas'>
						<a>📄 NINJAS</a>
					</Link>
				</Menu.Item> */}
			</Menu>
		);
	} else if (isAuthenticated && UserType == "coach") {
		return (
			<Menu
				theme='light'
				mode='horizontal'
				style={{
					display: "flex",
					fontSize: "17px",
					fontWeight: "500",
					width: "100%",
					justifyContent: "center",
				}}
			// defaultSelectedKeys={[pathname]}
			>
				<Menu.Item key='/quickstart'>
					<Link href='/quickstart'>
						<a>🚀 Analysis</a>
					</Link>
				</Menu.Item>

				{/* <Menu.Item key='/1inch'>
					<Link href='/1inch'>
						<a>🏦 Dex</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='onramp'>
					<Link href='/onramp'>
						<a>💵 Fiat</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/erc20balance'>
					<Link href='/erc20balance'>
						<a>💰 Balances</a>
					</Link>
				</Menu.Item> */}
				{/* <Menu.Item key='/erc20transfers'>
					<Link href='/erc20transfers'>
						<a>💸 Transfers</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/nftBalance'>
					<Link href='/nftBalance'>
						<a>🖼 NFTs</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/contract'>
					<Link href='/contract'>
						<a>📄 Contract</a>
					</Link>
				</Menu.Item> */}


				{/* <Menu.Item key='/annotationrequest'>
					<Link href='/annotationrequest'>
						<a>📄 Annotation Request</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/gamedetailsdebug'>
					<Link href='/gamedetailsdebug'>
						<a>📄 Debug</a>
					</Link>
				</Menu.Item>
				<Menu.Item key='/games'>
					<Link href='/games'>
						<a>📄 Games</a>
					</Link>
				</Menu.Item> */}

				<Menu.Item key='/games'>
					<Link href='/games'>
						<a>📄 Games</a>
					</Link>
				</Menu.Item>


				<Menu.Item key='/profile'>
					<Link href='/profile'>
						<a>📑 Profile</a>
					</Link>
				</Menu.Item>

				<Menu.Item key='/editprofile'>
					<Link href='/editprofile'>
						<a>✏️ Edit Profile</a>
					</Link>
				</Menu.Item>

				{/* <Menu.Item key='/coachverification'>
					<Link href='/coachverification'>
						<a>✔️ Coach Verification</a>
					</Link>
				</Menu.Item> */}

				{/* <Menu.Item key='/ninjas'>
					<Link href='/ninjas'>
						<a>📄 NINJAS</a>
					</Link>
				</Menu.Item> */}
			</Menu>
		);
	}


	return (
		<Menu
			theme='light'
			mode='horizontal'
			style={{
				display: "flex",
				fontSize: "17px",
				fontWeight: "500",
				width: "100%",
				justifyContent: "center",
			}}
		// defaultSelectedKeys={[pathname]}
		>
			<Menu.Item key='/quickstart'>
				<Link href='/quickstart'>
					<a>🚀 Analysis</a>
				</Link>
			</Menu.Item>

			{/* <Menu.Item key='/gamedetailsdebug'>
					<Link href='/gamedetailsdebug'>
						<a>📄 Debug</a>
					</Link>
				</Menu.Item> */}

			{/* <Menu.Item key='/1inch'>
				<Link href='/1inch'>
					<a>🏦 Dex</a>
				</Link>
			</Menu.Item>
			<Menu.Item key='onramp'>
				<Link href='/onramp'>
					<a>💵 Fiat</a>
				</Link>
			</Menu.Item>
			<Menu.Item key='/erc20balance'>
				<Link href='/erc20balance'>
					<a>💰 Balances</a>
				</Link>
			</Menu.Item> */}
			{/* <Menu.Item key='/erc20transfers'>
				<Link href='/erc20transfers'>
					<a>💸 Transfers</a>
				</Link>
			</Menu.Item>
			<Menu.Item key='/nftBalance'>
				<Link href='/nftBalance'>
					<a>🖼 NFTs</a>
				</Link>
			</Menu.Item>
			<Menu.Item key='/contract'>
				<Link href='/contract'>
					<a>📄 Contract</a>
				</Link>
			</Menu.Item> */}


			<Menu.Item key='/annotationrequest'>
				<Link href='/annotationrequest'>
					<a>📄 Annotation Request</a>
				</Link>
			</Menu.Item>

			{/* <Menu.Item key='/gamedetailsdebug'>
				<Link href='/gamedetailsdebug'>
					<a>📄 Debug</a>
				</Link>
			</Menu.Item> */}

			<Menu.Item key='/games'>
				<Link href='/games'>
					<a>📄 Games</a>
				</Link>
			</Menu.Item>


			<Menu.Item key='/profile'>
				<Link href='/profile'>
					<a>📑 Profile</a>
				</Link>
			</Menu.Item>

			<Menu.Item key='/editprofile'>
				<Link href='/editprofile'>
					<a>✏️ Edit Profile</a>
				</Link>
			</Menu.Item>

			<Menu.Item key='/coachverification'>
				<Link href='/coachverification'>
					<a>✔️ Coach Verification</a>
				</Link>
			</Menu.Item>

			{/* <Menu.Item key='/ninjas'>
				<Link href='/ninjas'>
					<a>📄 NINJAS</a>
				</Link>
			</Menu.Item> */}
		</Menu>
	);
}

export default MenuItems;
