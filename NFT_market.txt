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
    function buy(uint32 i) payable public {
        address payable addr = items[i];
        NFT_item(addr).bid(uint128(msg.value), msg.sender);
        addr.transfer(msg.value);
    }
    function getmarketsCount() public view returns(uint256) {
        return items.length;
    }
    function get_NFTAddress(uint32 i) public view returns(address payable) {
        return items[i];
    }
    function getNTFseller(uint32 i) public view returns(address payable) {
        return NFT_item(items[i]).seller();
    }
    function getName(uint32 i) public view returns(string memory){
        return NFT_item(items[i]).name();
    }
    function getlink(uint32 i) public view returns(string memory){
        return NFT_item(items[i]).img_link();
    }
}


contract NFT_item {
    address payable public seller;
    string public name;
    string public img_link;
    
    uint128 public price;
    // uint128 public highest_bid;
    // address public highest_bidder;
    
    address[] public bidders;
    mapping(address => uint128) public bid_price;
    mapping(address => uint32) public bid_Index;
    
    constructor(address payable _seller,string memory _name, string memory _img_link, uint128 _price) public {
        seller = _seller;
        name = _name;
        img_link = _img_link;
        
        price = _price;
        
    }
    
    
    function getAddress() public view returns(address payable){
        return address(this);
    }
    function getInvestment(address _sender) public view returns(uint128) {
        return bid_price[_sender];
    }
    
    function bid(uint128 _amount, address _sender) payable public{
        
        if(bid_Index[_sender] == 0) {
            bidders.push(_sender);
            bid_price[_sender] = _amount;
            bid_Index[_sender] = uint32(bidders.length);
        } else {
            bid_price[_sender] += _amount;
        }
        // currentAmount += _amount; future for highest_bidder
    }

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









