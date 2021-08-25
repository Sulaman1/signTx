// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyContract{

    uint public data;
    uint public data2;

    event Data(address sender, uint value, uint data, uint num);
    event Data2(uint data, uint num);


    function setData(uint num) external payable{
        emit Data(msg.sender, msg.value, data, num);
        data = num;
    }

    function setData2(uint num) external{
        emit Data2(data, num);
        data2 = num;
    }
}