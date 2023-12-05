import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import contractAddress from "./contractAddress.json";

import TokenCard from "./components/TokenCard";

const App = () => {
  const { sdk, provider } = useSDK();
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();

  const metaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
      console.log(accounts[0]);
    } catch (error) {
      console.warn("error");
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {account ? (
        <>
          <div>{`${account.substring(0, 7)}...${account.substring(
            account.length - 7
          )}`}</div>
          {contractAddress.map((v, i) => (
            <TokenCard
              key={i}
              web3={web3}
              account={account}
              owner={v.owner}
              address={v.address}
              walletAccount={v.walletAccount}
            />
          ))}
          <button onClick={() => setAccount("")}>나가</button>
        </>
      ) : (
        <button onClick={metaMask}>login</button>
      )}
    </div>
  );
};

export default App;
