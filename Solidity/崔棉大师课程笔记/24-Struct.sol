// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Structs {
    struct Car {
        string model;
        uint year;
        address owner;
    }

    Car public car;
    Car[] public cars;
    mapping(address => Car[]) public carsByOwner;

    function examples() external {
        // 依赖定义时的顺序
        Car memory toyota = Car("Toyota", 1990, msg.sender);
        // 不介意顺序
        Car memory lambo = Car({
            year: 1980,
            model: "Lamborghini",
            owner: msg.sender
        });
        // 也可以挨个属性赋值
        Car memory tesla;
        tesla.model = "Tesla";
        tesla.year = 2010;
        tesla.owner = msg.sender;

        cars.push(toyota);
        cars.push(lambo);
        cars.push(tesla);

        cars.push(Car("Ferrari", 2020, msg.sender));

        Car storage _car = cars[0];
        _car.year = 1999;
        delete _car.owner;

        // 在 remix 可以查看 cars[1] 的所有属性都被初始化
        delete cars[1];
    }
}
