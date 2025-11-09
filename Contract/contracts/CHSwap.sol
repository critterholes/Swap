// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CHSwap is Ownable {
    IERC20 public immutable tokenCHP;
    IERC20 public immutable tokenUSDC;

    uint256 public buyPricePer1000CHP_USDC = 1_000_000;
    uint256 public sellPricePer1000CHP_USDC = 700_000;
    uint256 public feePercent = 1;

    event CHPBought(address indexed user, uint256 amountCHP, uint256 usdcCost);
    event CHPSold(address indexed user, uint256 amountCHP, uint256 usdcReceived);
    event TokensDeposited(uint256 amountCHP, uint256 amountUSDC);
    event PricesUpdated(uint256 newBuyPrice, uint256 newSellPrice);

    constructor(address _tokenCHPAddress, address _tokenUSDCAddress) Ownable(msg.sender) {
        tokenCHP = IERC20(_tokenCHPAddress);
        tokenUSDC = IERC20(_tokenUSDCAddress);
    }

    function buyCHP(uint256 _amountUSDCIn) external {
        require(_amountUSDCIn > 0, "Amount must be > 0");

        uint256 amountCHPToBuy = (_amountUSDCIn * 1000) / buyPricePer1000CHP_USDC;

        require(amountCHPToBuy > 0, "USDC amount too low");
        require(tokenCHP.balanceOf(address(this)) >= amountCHPToBuy, "Kiosk: Not enough CHP in stock");

        uint256 feeAmount = (amountCHPToBuy * feePercent) / 100;
        uint256 amountToUser = amountCHPToBuy - feeAmount;
        
        require(amountToUser > 0, "Amount too low after fee");

        tokenUSDC.transferFrom(msg.sender, address(this), _amountUSDCIn);
        tokenCHP.transfer(msg.sender, amountToUser);
        tokenCHP.transfer(owner(), feeAmount);

        emit CHPBought(msg.sender, amountToUser, _amountUSDCIn);
    }

    function sellCHP(uint256 _amountCHPToSell) external {
        require(_amountCHPToSell > 0, "Amount must be > 0");

        uint256 usdcToReceive = (_amountCHPToSell * sellPricePer1000CHP_USDC) / 1000;

        require(usdcToReceive > 0, "CHP amount too low");
        require(tokenUSDC.balanceOf(address(this)) >= usdcToReceive, "Kiosk: Not enough USDC in stock");

        uint256 feeAmount = (_amountCHPToSell * feePercent) / 100;
        uint256 amountFromUser = _amountCHPToSell + feeAmount;

        tokenCHP.transferFrom(msg.sender, address(this), amountFromUser);
        tokenUSDC.transfer(msg.sender, usdcToReceive);
        
        if (feeAmount > 0) {
            tokenCHP.transfer(owner(), feeAmount);
        }

        emit CHPSold(msg.sender, _amountCHPToSell, usdcToReceive);
    }

    function depositTokens(uint256 _amountCHP, uint256 _amountUSDC) external onlyOwner {
        if (_amountCHP > 0) {
            tokenCHP.transferFrom(msg.sender, address(this), _amountCHP);
        }
        if (_amountUSDC > 0) {
            tokenUSDC.transferFrom(msg.sender, address(this), _amountUSDC);
        }
        emit TokensDeposited(_amountCHP, _amountUSDC);
    }

    function Upprice(uint256 _newBuyPrice, uint256 _newSellPrice) external onlyOwner {
        buyPricePer1000CHP_USDC = _newBuyPrice;
        sellPricePer1000CHP_USDC = _newSellPrice;
        emit PricesUpdated(_newBuyPrice, _newSellPrice);
    }

    function withdrawERC20(address _tokenAddress, uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be > 0");
        IERC20(_tokenAddress).transfer(owner(), _amount);
    }

    function withdrawNative() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No native coin to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Failed to send native coin");
    }

    receive() external payable {}
}