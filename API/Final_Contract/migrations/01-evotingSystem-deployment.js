const _eVotingSystem = artifacts.require("./eVotingSystem");

module.exports = function(deployer) {
    deployer.deploy(_eVotingSystem);
}