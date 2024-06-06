import { useState, useEffect } from "react";
import { ethers } from "ethers";
import voting_abi from "../artifacts/contracts/Voting.sol/Voting.json";

export default function VotingPage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [voting, setVoting] = useState(undefined);
  const [totalVotes, setTotalVotes] = useState(undefined);
  const [votesForPartyA, setVotesForPartyA] = useState(undefined);
  const [votesForPartyB, setVotesForPartyB] = useState(undefined);
  const [winningParty, setWinningParty] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const votingABI = voting_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getVotingContract();
  };

  const getVotingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const votingContract = new ethers.Contract(contractAddress, votingABI, signer);

    setVoting(votingContract);
  };

  const fetchVotes = async () => {
    if (voting) {
      const total = (await voting.totalVotes()).toNumber();
      const partyA = (await voting.votesForPartyA()).toNumber();
      const partyB = (await voting.votesForPartyB()).toNumber();

      setTotalVotes(total);
      setVotesForPartyA(partyA);
      setVotesForPartyB(partyB);
    }
  };

  const fetchWinningParty = async () => {
    if (voting) {
      const winner = await voting.winningParty();
      setWinningParty(winner);
    }
  };

  const setVotes = async (votes) => {
    if (voting) {
      let tx = await voting.setTotalVotes(votes);
      await tx.wait();
      fetchVotes();
    }
  };

  const voteForPartyA = async (votes) => {
    if (voting) {
      let tx = await voting.voteForPartyA(votes);
      await tx.wait();
      fetchVotes();
    }
  };

  const voteForPartyB = async (votes) => {
    if (voting) {
      let tx = await voting.voteForPartyB(votes);
      await tx.wait();
      fetchVotes();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to authenticate.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button className="connect-button" onClick={connectAccount}>
          Authenticate with MetaMask Wallet
        </button>
      );
    }

    if (totalVotes === undefined) {
      fetchVotes();
    }

    return (
      <div className="voting-container">
        <div className="set-votes">
          <label>Set Total Votes: </label>
          <input type="number" id="totalVotes" name="totalVotes" />
          <button onClick={() => setVotes(document.getElementById("totalVotes").value)}>Set</button>
        </div>

        <div className="boundary"></div>

        <div className="vote-section">
          <div className="vote-for-party">
            <label>Vote for Party A: </label>
            <input type="number" id="votesPartyA" name="votesPartyA" />
            <button onClick={() => voteForPartyA(document.getElementById("votesPartyA").value)}>Vote</button>
          </div>
          <div className="vote-for-party">
            <label>Vote for Party B: </label>
            <input type="number" id="votesPartyB" name="votesPartyB" />
            <button onClick={() => voteForPartyB(document.getElementById("votesPartyB").value)}>Vote</button>
          </div>
        </div>

        <div className="boundary"></div>

        <div className="result-section">
          <button className="result-button" onClick={fetchWinningParty}>Show Result</button>
          {winningParty && <p className="winner">Winning Party: {winningParty}</p>}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, [ethWallet]);

  return (
    <main className="container">
      <header><h1 className="title">Hello EC, Please update the following</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #f0f0f0;
          color: #333;
          border: 2px solid #ccc;
          padding: 20px;
          border-radius: 10px;
          margin: 20px auto;
          max-width: 600px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .connect-button, .result-button, .vote-for-party button, .set-votes button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          margin: 10px 0;
          transition: background-color 0.3s ease;
        }
        .connect-button:hover, .result-button:hover, .vote-for-party button:hover, .set-votes button:hover {
          background-color: #0056b3;
        }
        .voting-container {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .boundary {
          width: 100%;
          height: 2px;
          background-color: #ccc;
          margin: 20px 0;
        }
        .set-votes {
          margin
-bottom: 20px;
        }
        .set-votes label {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .set-votes input {
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 150px;
          font-size: 16px;
        }
        .set-votes button {
          padding: 8px 20px;
          font-size: 16px;
        }
        .vote-section {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .vote-for-party {
          text-align: center;
        }
        .vote-for-party label, .vote-for-party input, .vote-for-party button {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .vote-for-party input {
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 150px;
        }
        .vote-for-party button {
          padding: 8px 20px;
        }
        .result-section {
          margin-bottom: 20px;
        }
        .winner {
          font-size: 20px;
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
