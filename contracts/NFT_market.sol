// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.6.0;

// contract helloworld {
//     string public myword = "helloworld";
    
//     function show() public view returns(string memory){
//         return myword;
//     }
    
//     function changeName(string memory _Newname) public
//     {
//         myword = _Newname;
//     }
// }

contract NFT_market {
    address payable[] items;
    constructor() public {}
    function upload(string calldata _name, string calldata _img_link, uint128 _price) public 
    {
        NFT_item _NFT_item = new NFT_item(
            msg.sender, _name, _img_link, _price
        );
        items.push(_NFT_item.getAddress());
    }
    function buy(uint32 i) payable public returns(string memory){
        address payable addr_seller = NFT_item(items[i]).seller(); //contract's seller address
        address payable cont = items[i]; //contract's adderss
        if((msg.value/1 ether) < NFT_item(cont).price()){
            string memory r1 = "Buy Failed!";
            return r1;
        }
        else{
            // NFT_item(cont).bid(uint128(msg.value), msg.sender);
            addr_seller.transfer(msg.value);
            NFT_item(cont).hasBuyer(msg.sender);
            string memory r2 = "Buy Successed!";
            return r2;
        }
    }
    function getmarketsCount() public view returns(uint256) {
        return items.length;
    }
    function getNFTAddress(uint32 i) public view returns(address payable) {
        return items[i];
    }
    function getNFTseller(uint32 i) public view returns(address payable) {
        return NFT_item(items[i]).seller();
    }
    function getNFTbuyer(uint32 i) public view returns(address) {
        return NFT_item(items[i]).buyer();
    }
    function getNFTsituation(uint32 i) public view returns(uint128) {
        return NFT_item(items[i]).situation();
    }
    function getNFTprice(uint32 i) public view returns(uint128){
        return NFT_item(items[i]).price();
    }
    function getNFTName(uint32 i) public view returns(string memory){
        return NFT_item(items[i]).name();
    }
    function getNFTlink(uint32 i) public view returns(string memory){
        return NFT_item(items[i]).img_link();
    }
}


contract NFT_item {
    address payable public seller;
    string public name;
    string public img_link;
    
    uint128 public price;
    uint128 public situation;
    address public buyer;
    // uint128 public highest_bid;
    // address public highest_bidder;
    
    // address[] public bidders;
    // mapping(address => uint128) public bid_price;
    // mapping(address => uint32) public bid_Index;
    
    constructor(address payable _seller,string memory _name, string memory _img_link, uint128 _price) public {
        seller = _seller;
        name = _name;
        img_link = _img_link;
        
        price = _price;
        situation = 0;
    }
    
    
    function getAddress() public view returns(address payable){
        return address(this);
    }
    // function getInvestment(address _sender) public view returns(uint128) {
    //     return bid_price[_sender];
    // }
    function getBuyer() public view returns(address){
        return address(buyer);
    }
    function hasBuyer(address _sender) public {
        situation = 1;
        buyer = _sender;
    }
    
    // function bid(uint128 _amount, address _sender) payable public{
        
    //     if(bid_Index[_sender] == 0) {
    //         bidders.push(_sender);
    //         bid_price[_sender] = _amount;
    //         bid_Index[_sender] = uint32(bidders.length);
    //     } else {
    //         bid_price[_sender] += _amount;
    //     }
    //     // currentAmount += _amount; future for highest_bidder
    // }

    // struct Request {
    //     string purpose;
    //     uint128 totalAmount;
    //     uint128 approveVotes;
    //     uint128 disapproveVotes;
    //     mapping(address => bool) isVoted;
    // }
    // Request[] public requests;
    
    fallback() payable external {}
    receive () payable external {}
    
}










