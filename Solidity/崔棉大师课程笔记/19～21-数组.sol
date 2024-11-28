// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// 19 数组
// Array - dynamic or fixed size
// Initialization
// Insert (push), get, update, delete, pop, length
// Creating array from function
// Returning array from function

contract Array {
    uint[] public nums = [1, 2, 3];
    uint[3] public numsFixed = [4, 5, 6];

    function examples() external {
        nums.push(4); // [1, 2, 3, 4]
        uint x = nums[1];
        nums[2] = 777; // [1, 2, 777, 4]
        delete nums[1]; // [1, 0, 777, 4] 删除只是初始化数组为 0
        nums.pop(); // [1, 0, 777]
        uint len = nums.length;

        // create array in memory
        uint[] memory a = new uint[](5); // 内存中无法定义不定长数组
        a[1] = 123;
    }

    // nums 状态变量会自动生成查询函数 nums，但只能输入索引查询单个数据
    // 返回整个数组
    function returnArray() external view returns (uint[] memory) {
        return nums; // 返回整个数组
    }
}

// 20 数组删除元素通过移动位置
contract ArrayShift {
    uint[] public arr;

    function example() public {
        arr = [1, 2, 3];
        delete arr[1]; // [1, 0, 3]
    }

    // 从删除的位置开始，后面数据覆向前挪一个，最后 pop 最后一个无用的
    // gas 消耗较大
    // [1, 2, 3[ -- remove(1) -> [1, 3, 3] --> [1, 3]
    // [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] --> [1, 2, 4, 5, 6]
    // [1] -- remove(0) --> [1] --> []
    function remove(uint index) public {
        require(index < arr.length, "index out of bound");

        for (uint i = index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function test() external {
        arr = [1, 2, 3, 4, 5];
        remove(2);
        // [1, 2, 4, 5]
        assert(arr[0] == 1);
        assert(arr[1] == 2);
        assert(arr[2] == 4);
        assert(arr[3] == 5);

        arr = [1];
        remove(0);
        // []
        assert(arr.length == 0);
    }
}

// 21 删除数组元素通过替换，不考虑顺序的话，这样比较节约 gas
// remove array element by shifting elements to left
// [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] -> [1, 2, 4, 5, 6]
contract ArrayReplaceLast {
    uint[] public arr;

    function remove(uint index) public {
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }

    function test() external {
        arr = [1, 2, 3, 4];

        remove(1);

        // [1, 4, 3]
        assert(arr.length == 3);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
        assert(arr[2] == 3);

        remove(2);
        // [1, 4]
        assert(arr.length == 2);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
    }
}
