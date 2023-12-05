import { useEffect, useState } from "react";
import mintTokenAbi from "../mintTokenAbi.json";
import contractAddress from "../contractAddress.json";
import OptionCard from "./OptionCard";

const TokenCard = ({ web3, account, owner, address, walletAccount }) => {
  const [callName, setCallName] = useState("TOKEN");
  const [callSymbol, setCallSymbol] = useState("TOKEN");
  const [callBalance, setCallBalance] = useState("TOKEN");
  const [contract, setContract] = useState();
  const [inputAddress, setInputAddress] = useState("");
  const [inputValue, setInputValue] = useState();

  const clipBoard = async () => {
    await navigator.clipboard.writeText(walletAccount);
  };

  const onClickSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAddress, web3.utils.toWei(inputValue, "ether"))
        .send({ from: account });
      // 나로부터 인풋어드레스로 우리 블체스

      setInputAddress("");
      setInputValue("");
      alert("성공!");
    } catch (err) {
      console.warn("error");
    }
  };

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();

      setCallName(response);
    } catch (err) {
      console.warn("error");
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setCallSymbol(response);
    } catch (err) {
      console.warn("error");
    }
  };

  const getBalance = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();
      // 지갑주소
      setCallBalance(Number(web3.utils.fromWei(response, "ether")));
    } catch (err) {
      console.warn("error");
    }
  };

  useEffect(() => {
    if (!contract || !account) return;
    getName();
    getSymbol();
    getBalance();
  });

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3, address]);
  // 컨트랙트 주소
  // web3 쓸려면 json형식 abi 필요 useSDK에 provider에 web3 그리고 컨트랙트에 abi와 컨트랙트주소

  return (
    <>
      <div className="flex gap-2">
        <button className="underline" onClick={clipBoard}>
          {owner}
        </button>
        <span>{callName}</span>
        <span>{callSymbol}</span>
        <span>{callBalance}</span>
        <form onSubmit={onClickSubmitSend}>
          <input
            className="border-2 rounded-md"
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <input
            className="border-2 rounded-md"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <select
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          >
            <option value=""></option>
            {contractAddress.map((v, i) => (
              <OptionCard
                key={i}
                owner={v.owner}
                walletAccount={v.walletAccount}
              />
            ))}
          </select>

          <button value="submit">보내기</button>
        </form>
      </div>
    </>
  );
};

export default TokenCard;
