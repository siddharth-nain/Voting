// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Voting {
    uint256 public validVote = 1;
    uint256 public totalVotes;
    uint256 public votesForPartyA;
    uint256 public votesForPartyB;
    address public partyOwner;

    event TotalVotesSet(uint256 votes);
    event VoteForPartyA(uint256 votes);
    event VoteForPartyB(uint256 votes);

    constructor() {
        partyOwner = msg.sender;
    }

    function setTotalVotes(uint256 votes) public {
        require(msg.sender == partyOwner, "Party owner can't interfere");
        require(votes > 0, "Invalid votes");

        uint256 _previousTotalVotes = totalVotes;

       
        totalVotes = votes;

        
        assert(totalVotes == votes);

        emit TotalVotesSet(votes);
    }

    function voteForPartyA(uint256 votes) public {
        require(totalVotes > 0, "Total votes not set");
        require(votes > 0, "Votes must be greater than 0");
        require(votesForPartyA + votes <= totalVotes, "Total votes for Party A exceed total votes");

        uint256 _previousVotesForPartyA = votesForPartyA;

        // Add votes for Party A
        votesForPartyA += votes * validVote;

        // Assert the votes for Party A are updated correctly
        assert(votesForPartyA == _previousVotesForPartyA + votes * validVote);

        // Emit the event
        emit VoteForPartyA(votes);
    }

    function voteForPartyB(uint256 votes) public {
        require(totalVotes > 0, "Total votes not set");
        require(votes > 0, "Votes must be greater than 0");
        require(votesForPartyB + votes <= totalVotes - votesForPartyA, "Total votes for Party B exceed remaining votes");

        uint256 _previousVotesForPartyB = votesForPartyB;

        // Add votes for Party B
        votesForPartyB += votes * validVote;

        // Assert the votes for Party B are updated correctly
        assert(votesForPartyB == _previousVotesForPartyB + votes * validVote);

        // Emit the event
        emit VoteForPartyB(votes);
    }

    function getVotesForPartyA() public view returns (uint256) {
        return votesForPartyA;
    }

    function getVotesForPartyB() public view returns (uint256) {
        return votesForPartyB;
    }

    function getWinningParty() public view returns (string memory) {
        if (votesForPartyA > votesForPartyB) {
            return "Party A";
        } else if (votesForPartyB > votesForPartyA) {
            return "Party B";
        } else {
            return "It's a tie";
        }
    }
}
